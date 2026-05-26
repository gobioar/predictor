import { notFound } from "next/navigation";
import { VentaPeriodoForm } from "@/app/ventas/VentaPeriodoForm";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditarVentaPeriodoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAuth();

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const periodoId = Number(id);
  const [periodo, productos] = await Promise.all([
    prisma.ventaMensualPeriodo.findUnique({
      where: { id: periodoId },
      include: { items: true },
    }),
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
      include: { familia: true, tipoProductoVenta: true },
    }),
  ]);

  if (!periodo) notFound();

  return (
    <VentaPeriodoForm
      title="Editar mes de ventas"
      eyebrow="Ventas mensuales"
      productos={productos}
      error={query?.error}
      formPath={`/ventas/${periodo.id}`}
      periodo={{
        id: periodo.id,
        nombre: periodo.nombre,
        mes: periodo.mes,
        anio: periodo.anio,
        items: periodo.items.map((item) => ({
          productoId: item.productoId,
          unidadesVendidas: item.unidadesVendidas,
        })),
      }}
    />
  );
}
