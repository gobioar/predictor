import type { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { PrecioCostoPeriodoForm } from "@/app/precios-costos/PrecioCostoPeriodoForm";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tiposProduccion = ["Propio", "Externo"] as const;

export default async function EditarPrecioCostoPeriodoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    q?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
    tipoProduccion?: string;
  }>;
}) {
  await requireAuth();

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const periodoId = Number(id);
  const filters = {
    q: query?.q?.trim() ?? "",
    familiaId: query?.familiaId ?? "",
    tipoProductoVentaId: query?.tipoProductoVentaId ?? "",
    tipoProduccion: query?.tipoProduccion ?? "all",
  };
  const where: Prisma.ProductoWhereInput = {
    activo: true,
    ...(filters.q
      ? {
          OR: [
            { sku: { contains: filters.q } },
            { nombre: { contains: filters.q } },
          ],
        }
      : {}),
    ...(filters.familiaId ? { familiaId: Number(filters.familiaId) } : {}),
    ...(filters.tipoProductoVentaId
      ? { tipoProductoVentaId: Number(filters.tipoProductoVentaId) }
      : {}),
    ...(tiposProduccion.includes(filters.tipoProduccion as (typeof tiposProduccion)[number])
      ? { tipoProduccion: filters.tipoProduccion }
      : {}),
  };

  const [periodo, productos, familias, tipos] = await Promise.all([
    prisma.precioCostoMensualPeriodo.findUnique({
      where: { id: periodoId },
      include: { items: true },
    }),
    prisma.producto.findMany({
      where,
      orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
      include: { familia: true, tipoProductoVenta: true },
    }),
    prisma.familiaProducto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.tipoProductoVenta.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!periodo) notFound();

  return (
    <PrecioCostoPeriodoForm
      title="Editar precios y costos"
      eyebrow="Precios y costos"
      productos={productos}
      familias={familias}
      tipos={tipos}
      error={query?.error}
      formPath={`/precios-costos/${periodo.id}`}
      filters={filters}
      periodo={{
        id: periodo.id,
        nombre: periodo.nombre,
        mes: periodo.mes,
        anio: periodo.anio,
        items: periodo.items.map((item) => ({
          productoId: item.productoId,
          precioVentaPromedio: item.precioVentaPromedio.toString(),
          costoUnitarioPromedio: item.costoUnitarioPromedio.toString(),
        })),
      }}
    />
  );
}
