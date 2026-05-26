import type { Prisma } from "@prisma/client";
import { Filter, X } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import {
  buildProductSeries,
  calculateProductForecastModels,
  forecastMethodLabels,
  getForecastForMethod,
  type ForecastMethod,
} from "@/lib/forecast-report";
import { prisma } from "@/lib/prisma";
import { formatMonth, nextMonth } from "@/lib/utils";

const methodOptions: Array<{ value: ForecastMethod; label: string }> = [
  { value: "movingAverage", label: forecastMethodLabels.movingAverage },
  { value: "linear", label: forecastMethodLabels.linear },
  { value: "polynomial", label: forecastMethodLabels.polynomial },
  { value: "holtWinters", label: forecastMethodLabels.holtWinters },
  { value: "recommended", label: forecastMethodLabels.recommended },
];

const isForecastMethod = (value?: string): value is ForecastMethod =>
  methodOptions.some((option) => option.value === value);

const formatDemand = (value: number | null) =>
  typeof value === "number" ? value.toLocaleString("es-AR") : "—";

export default async function MatrizForecastPage({
  searchParams,
}: {
  searchParams?: Promise<{
    metodo?: string;
    q?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
  }>;
}) {
  const params = await searchParams;
  const selectedMethod: ForecastMethod = isForecastMethod(params?.metodo)
    ? params.metodo
    : "movingAverage";
  const filters = {
    q: params?.q?.trim() ?? "",
    familiaId: params?.familiaId ?? "",
    tipoProductoVentaId: params?.tipoProductoVentaId ?? "",
  };
  const productWhere: Prisma.ProductoWhereInput = {
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
  };

  const [productos, familias, tipos, periodos, config] = await Promise.all([
    prisma.producto.findMany({
      where: productWhere,
      orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
      include: { familia: true, tipoProductoVenta: true },
    }),
    prisma.familiaProducto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.tipoProductoVenta.findMany({ orderBy: { nombre: "asc" } }),
    prisma.ventaMensualPeriodo.findMany({
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
      select: { id: true, anio: true, mes: true },
    }),
    prisma.forecastConfig.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    }),
  ]);

  const horizon = config.forecastHorizonMonths || 12;
  const allItems = periodos.length
    ? await prisma.ventaMensualItem.findMany({
        where: {
          periodoId: { in: periodos.map((periodo) => periodo.id) },
          productoId: { in: productos.map((producto) => producto.id) },
        },
        select: { periodoId: true, productoId: true, unidadesVendidas: true },
      })
    : [];
  const itemMap = new Map(
    allItems.map((item) => [`${item.periodoId}:${item.productoId}`, item.unidadesVendidas]),
  );
  const lastPeriod = periodos.at(-1);
  const projectedMonths = lastPeriod
    ? Array.from({ length: horizon }, (_, index) =>
        nextMonth(lastPeriod.anio, lastPeriod.mes, index + 1),
      )
    : [];

  const rows = productos.map((producto) => {
    const seriesPeriodos = periodos.map((periodo) => ({
      items: [
        {
          unidadesVendidas:
            itemMap.get(`${periodo.id}:${producto.id}`) ?? 0,
        },
      ],
    }));
    const values = buildProductSeries(seriesPeriodos);
    const models = calculateProductForecastModels(values, config);
    const { forecast, modelKey } = getForecastForMethod(models, selectedMethod);
    const projectedValues = projectedMonths.map((_, index) =>
      typeof forecast[index] === "number" ? forecast[index] : null,
    );
    const total = projectedValues.reduce<number>(
      (sum, value) => sum + (typeof value === "number" ? value : 0),
      0,
    );

    return {
      producto,
      projectedValues,
      total,
      modelKey,
    };
  });

  const monthlyTotals = projectedMonths.map((_, monthIndex) =>
    rows.reduce<number>(
      (sum, row) =>
        sum +
        (typeof row.projectedValues[monthIndex] === "number"
          ? row.projectedValues[monthIndex]
          : 0),
      0,
    ),
  );
  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);
  const showRecommendedModel = selectedMethod === "recommended";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          FORECAST
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Matriz Forecast</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Proyección mensual consolidada por producto
        </p>
      </header>

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1.4fr_1.5fr_1.2fr_1.4fr_auto_auto]">
        <select
          name="metodo"
          defaultValue={selectedMethod}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          {methodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          name="q"
          placeholder="Buscar SKU o producto"
          defaultValue={filters.q}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
        />
        <select
          name="familiaId"
          defaultValue={filters.familiaId}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Todas las familias</option>
          {familias.map((familia) => (
            <option key={familia.id} value={familia.id}>
              {familia.nombre}
            </option>
          ))}
        </select>
        <select
          name="tipoProductoVentaId"
          defaultValue={filters.tipoProductoVentaId}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href="/matriz-forecast"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      {productos.length === 0 ? (
        <EmptyState
          title="Sin productos activos"
          detail="No hay productos que coincidan con los filtros seleccionados."
        />
      ) : periodos.length === 0 ? (
        <EmptyState
          title="Sin meses históricos"
          detail="Cargá ventas mensuales para generar la matriz de forecast."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="sticky left-0 z-20 min-w-72 border-b border-white/10 bg-neutral-900 px-4 py-3">
                  Producto
                </th>
                {projectedMonths.map((month) => (
                  <th
                    key={`${month.anio}-${month.mes}`}
                    className="min-w-32 border-b border-white/10 px-4 py-3 text-right"
                  >
                    {formatMonth(month.anio, month.mes)}
                  </th>
                ))}
                <th className="min-w-36 border-b border-white/10 px-4 py-3 text-right">
                  Total {horizon} meses
                </th>
                {showRecommendedModel && (
                  <th className="min-w-44 border-b border-white/10 px-4 py-3">
                    Modelo usado
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.producto.id} className="group">
                  <td className="sticky left-0 z-10 border-b border-white/10 bg-neutral-900 px-4 py-3 text-white group-hover:bg-neutral-800">
                    <div className="font-semibold">{row.producto.sku}</div>
                    <div className="mt-1 max-w-64 truncate text-xs text-neutral-400">
                      {row.producto.nombre}
                    </div>
                  </td>
                  {row.projectedValues.map((value, index) => (
                    <td
                      key={`${row.producto.id}-${index}`}
                      className="border-b border-white/10 px-4 py-3 text-right text-neutral-200 group-hover:bg-white/[0.03]"
                    >
                      {formatDemand(value)}
                    </td>
                  ))}
                  <td className="border-b border-white/10 px-4 py-3 text-right font-semibold text-white group-hover:bg-white/[0.03]">
                    {row.total.toLocaleString("es-AR")}
                  </td>
                  {showRecommendedModel && (
                    <td className="border-b border-white/10 px-4 py-3 text-neutral-300 group-hover:bg-white/[0.03]">
                      {row.modelKey ? forecastMethodLabels[row.modelKey] : "—"}
                    </td>
                  )}
                </tr>
              ))}
              <tr className="bg-emerald-400/10">
                <td className="sticky left-0 z-10 border-t border-emerald-400/30 bg-neutral-900 px-4 py-3 font-semibold text-emerald-200">
                  TOTAL MES
                </td>
                {monthlyTotals.map((total, index) => (
                  <td
                    key={index}
                    className="border-t border-emerald-400/30 px-4 py-3 text-right font-semibold text-emerald-100"
                  >
                    {total.toLocaleString("es-AR")}
                  </td>
                ))}
                <td className="border-t border-emerald-400/30 px-4 py-3 text-right font-semibold text-emerald-100">
                  {grandTotal.toLocaleString("es-AR")}
                </td>
                {showRecommendedModel && (
                  <td className="border-t border-emerald-400/30 px-4 py-3 text-emerald-100">
                    —
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
