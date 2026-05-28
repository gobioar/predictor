import type { Prisma } from "@prisma/client";
import { PrecioCostoPeriodoForm } from "@/app/precios-costos/PrecioCostoPeriodoForm";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const tiposProduccion = ["Propio", "Externo"] as const;

export default async function NuevoPrecioCostoPeriodoPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    q?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
    tipoProduccion?: string;
  }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const filters = {
    q: params?.q?.trim() ?? "",
    familiaId: params?.familiaId ?? "",
    tipoProductoVentaId: params?.tipoProductoVentaId ?? "",
    tipoProduccion: params?.tipoProduccion ?? "all",
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
  const currentYear = new Date().getFullYear();
  const [productos, familias, tipos] = await Promise.all([
    prisma.producto.findMany({
      where,
      orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
      include: { familia: true, tipoProductoVenta: true },
    }),
    prisma.familiaProducto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.tipoProductoVenta.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <PrecioCostoPeriodoForm
      title="Nuevo período de precios y costos"
      eyebrow="Precios y costos"
      productos={productos}
      familias={familias}
      tipos={tipos}
      error={params?.error}
      formPath="/precios-costos/nuevo"
      filters={filters}
      periodo={{
        nombre: "",
        mes: new Date().getMonth() + 1,
        anio: currentYear,
        items: [],
      }}
    />
  );
}
