import { notFound } from "next/navigation";
import { VentaPeriodoForm } from "@/app/ventas/VentaPeriodoForm";
import { prisma } from "@/lib/prisma";

export default async function NuevoVentaPeriodoPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; duplicar?: string }>;
}) {
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const [productos, source] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
      include: { familia: true, tipoProductoVenta: true },
    }),
    params?.duplicar
      ? prisma.ventaMensualPeriodo.findUnique({
          where: { id: Number(params.duplicar) },
          include: { items: true },
        })
      : null,
  ]);

  if (params?.duplicar && !source) notFound();

  return (
    <VentaPeriodoForm
      title={source ? "Duplicar mes de ventas" : "Nuevo mes de ventas"}
      eyebrow="Ventas mensuales"
      productos={productos}
      error={params?.error}
      formPath={`/ventas/nuevo${source ? `?duplicar=${source.id}` : ""}`}
      periodo={{
        nombre: source ? `Copia de ${source.nombre}` : "",
        mes: source?.mes ?? new Date().getMonth() + 1,
        anio: source?.anio ?? currentYear,
        items:
          source?.items.map((item) => ({
            productoId: item.productoId,
            unidadesVendidas: item.unidadesVendidas,
          })) ?? [],
      }}
    />
  );
}
