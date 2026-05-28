import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import {
  calculateProductForecastModels,
  forecastMethodLabels,
  getForecastForMethod,
  type ForecastModelKey,
} from "@/lib/forecast-report";
import {
  calculateEconomicForecast,
  projectPriceCost,
  type EconomicForecastPoint,
} from "@/lib/economic-forecast";
import { normalizeForecastHorizon } from "@/lib/forecast-config";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMonth, generateForecastMonths } from "@/lib/utils";

const tiposProduccion = ["Propio", "Externo"] as const;
const tabs = ["resumen", "detalle"] as const;

type Tab = (typeof tabs)[number];

type ProductMonthRow = {
  producto: {
    id: number;
    sku: string;
    nombre: string;
    tipoProduccion: string;
    familia: { nombre: string };
    tipoProductoVenta: { nombre: string };
  };
  modelKey: ForecastModelKey | null;
  point: EconomicForecastPoint;
};

type MonthlyTotals = {
  unidades: number;
  facturacion: number;
  facturacionConCosto: number;
  costo: number;
  margen: number;
  margenPct: number | null;
  productosSinCosto: number;
};

const isTab = (value?: string): value is Tab => tabs.includes(value as Tab);

const numberFormat = (value: number) => value.toLocaleString("es-AR");
const moneyFormat = (value: number) =>
  value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const percentFormat = (value: number | null) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "Sin datos";
const monthLabel = (anio: number, mes: number) => {
  const label = formatMonth(anio, mes);
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const variationLabel = (current: number | null, previous: number | null) => {
  if (current === null || previous === null || previous === 0) return "Sin base anterior";
  const variation = ((current - previous) / Math.abs(previous)) * 100;
  const sign = variation > 0 ? "+" : "";
  return `${sign}${variation.toFixed(1)}% vs mes anterior`;
};

const calculateTotals = (rows: ProductMonthRow[]): MonthlyTotals => {
  const totals = rows.reduce(
    (acc, row) => {
      acc.unidades += row.point.unidadesProyectadas;
      acc.facturacion += row.point.facturacionProyectada;

      if (row.point.tieneCostoConocido) {
        acc.facturacionConCosto += row.point.facturacionProyectada;
        acc.costo += row.point.costoProyectado;
        acc.margen += row.point.margenBrutoProyectado;
      } else {
        acc.productosSinCosto += 1;
      }

      return acc;
    },
    {
      unidades: 0,
      facturacion: 0,
      facturacionConCosto: 0,
      costo: 0,
      margen: 0,
      productosSinCosto: 0,
    },
  );

  return {
    ...totals,
    margenPct:
      totals.facturacionConCosto > 0
        ? (totals.margen / totals.facturacionConCosto) * 100
        : null,
  };
};

export default async function ProyeccionEconomicaPage({
  searchParams,
}: {
  searchParams?: Promise<{
    productoId?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
    tipoProduccion?: string;
    q?: string;
    month?: string;
    tab?: string;
  }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const selectedTab: Tab = isTab(params?.tab) ? params.tab : "resumen";
  const filters = {
    productoId: params?.productoId ?? "",
    familiaId: params?.familiaId ?? "",
    tipoProductoVentaId: params?.tipoProductoVentaId ?? "",
    tipoProduccion: params?.tipoProduccion ?? "all",
    q: params?.q?.trim() ?? "",
  };
  const productWhere: Prisma.ProductoWhereInput = {
    activo: true,
    ...(filters.productoId ? { id: Number(filters.productoId) } : {}),
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

  const [productos, allProductos, familias, tipos, periodos, config] =
    await Promise.all([
      prisma.producto.findMany({
        where: productWhere,
        orderBy: [{ familia: { nombre: "asc" } }, { nombre: "asc" }],
        include: { familia: true, tipoProductoVenta: true },
      }),
      prisma.producto.findMany({
        where: { activo: true },
        orderBy: { nombre: "asc" },
        select: { id: true, sku: true, nombre: true },
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
        create: { id: 1, forecastHorizonMonths: 18 },
      }),
    ]);

  const horizon = normalizeForecastHorizon(config.forecastHorizonMonths);
  const projectedMonths = generateForecastMonths(periodos.at(-1), horizon);
  const selectedMonthIndex = Math.min(
    Math.max(0, Number(params?.month ?? 0) || 0),
    Math.max(projectedMonths.length - 1, 0),
  );
  const selectedMonth = projectedMonths[selectedMonthIndex];
  const allItems =
    periodos.length && productos.length
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

  const rowsByMonth = new Map<number, ProductMonthRow[]>();
  for (const producto of productos) {
    const values = periodos.map(
      (periodo) => itemMap.get(`${periodo.id}:${producto.id}`) ?? 0,
    );
    const models = calculateProductForecastModels(values, config);
    const { forecast, modelKey } = getForecastForMethod(
      models,
      "recommended",
      producto.preferredForecastModel,
    );
    const priceCostProjection = await projectPriceCost(
      producto.id,
      projectedMonths,
      config,
    );
    const economicForecast = calculateEconomicForecast(forecast, priceCostProjection);

    economicForecast.forEach((point, index) => {
      const monthRows = rowsByMonth.get(index) ?? [];
      monthRows.push({ producto, modelKey, point });
      rowsByMonth.set(index, monthRows);
    });
  }

  const selectedRows = rowsByMonth.get(selectedMonthIndex) ?? [];
  const previousRows = rowsByMonth.get(selectedMonthIndex - 1) ?? [];
  const selectedTotals = calculateTotals(selectedRows);
  const previousTotals = previousRows.length ? calculateTotals(previousRows) : null;
  const timeline = projectedMonths.map((month, index) => ({
    month,
    totals: calculateTotals(rowsByMonth.get(index) ?? []),
  }));

  const groupedRows = Array.from(
    selectedRows
      .reduce((map, row) => {
        const key = `${row.producto.familia.nombre} / ${row.producto.tipoProductoVenta.nombre}`;
        const current =
          map.get(key) ??
          ({
            label: key,
            unidades: 0,
            facturacion: 0,
            facturacionConCosto: 0,
            costo: 0,
            margen: 0,
            productosSinCosto: 0,
          } satisfies Omit<MonthlyTotals, "margenPct"> & { label: string });

        current.unidades += row.point.unidadesProyectadas;
        current.facturacion += row.point.facturacionProyectada;

        if (row.point.tieneCostoConocido) {
          current.facturacionConCosto += row.point.facturacionProyectada;
          current.costo += row.point.costoProyectado;
          current.margen += row.point.margenBrutoProyectado;
        } else {
          current.productosSinCosto += 1;
        }

        map.set(key, current);
        return map;
      }, new Map<string, Omit<MonthlyTotals, "margenPct"> & { label: string }>())
      .values(),
  )
    .map((row) => ({
      ...row,
      margenPct:
        row.facturacionConCosto > 0 ? (row.margen / row.facturacionConCosto) * 100 : null,
    }))
    .sort((a, b) => b.facturacion - a.facturacion);

  const topByRevenue = [...selectedRows]
    .sort((a, b) => b.point.facturacionProyectada - a.point.facturacionProyectada)
    .slice(0, 10);
  const topByMargin = selectedRows
    .filter((row) => row.point.tieneCostoConocido)
    .sort((a, b) => b.point.margenBrutoProyectado - a.point.margenBrutoProyectado)
    .slice(0, 10);

  const baseQuery = {
    ...(filters.productoId ? { productoId: filters.productoId } : {}),
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.familiaId ? { familiaId: filters.familiaId } : {}),
    ...(filters.tipoProductoVentaId
      ? { tipoProductoVentaId: filters.tipoProductoVentaId }
      : {}),
    ...(filters.tipoProduccion !== "all" ? { tipoProduccion: filters.tipoProduccion } : {}),
  };
  const hrefFor = (overrides: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams();
    Object.entries({ ...baseQuery, tab: selectedTab, month: selectedMonthIndex, ...overrides })
      .filter(([, value]) => value !== undefined && value !== "")
      .forEach(([key, value]) => search.set(key, String(value)));

    return `/proyeccion-economica?${search.toString()}`;
  };

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Economia
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Proyeccion Economica
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-300">
          Vista mensual de cashflow proyectado: facturacion, costos y margen bruto
          sobre el forecast recomendado de unidades para cada producto.
        </p>
      </header>

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1.2fr_1.4fr_1.2fr_1.2fr_1fr_auto_auto]">
        <input type="hidden" name="month" value={selectedMonthIndex} />
        <input type="hidden" name="tab" value={selectedTab} />
        <select
          name="productoId"
          defaultValue={filters.productoId}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Todos los productos</option>
          {allProductos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.sku} - {producto.nombre}
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
        <select
          name="tipoProduccion"
          defaultValue={filters.tipoProduccion}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="all">Todos</option>
          {tiposProduccion.map((tipoProduccion) => (
            <option key={tipoProduccion} value={tipoProduccion}>
              {tipoProduccion}
            </option>
          ))}
        </select>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href="/proyeccion-economica"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      {productos.length === 0 || !selectedMonth ? (
        <EmptyState
          title="Sin datos para proyectar"
          detail="Carga productos activos, ventas historicas y precios/costos para generar la proyeccion economica."
        />
      ) : (
        <>
          <section className="rounded-xl border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(50,170,147,0.16),rgba(124,191,129,0.06),rgba(54,54,54,0.35))] p-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Link
                href={hrefFor({ month: Math.max(0, selectedMonthIndex - 1) })}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-200 hover:bg-white/10 ${
                  selectedMonthIndex === 0 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <ChevronLeft size={17} />
                Mes anterior
              </Link>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-200">
                  Mes seleccionado
                </p>
                <h2 className="mt-1 text-3xl font-semibold text-white">
                  {monthLabel(selectedMonth.anio, selectedMonth.mes)}
                </h2>
              </div>
              <Link
                href={hrefFor({
                  month: Math.min(projectedMonths.length - 1, selectedMonthIndex + 1),
                })}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-200 hover:bg-white/10 ${
                  selectedMonthIndex === projectedMonths.length - 1
                    ? "pointer-events-none opacity-40"
                    : ""
                }`}
              >
                Mes siguiente
                <ChevronRight size={17} />
              </Link>
            </div>
            <form className="mx-auto mt-4 flex max-w-md gap-2">
              {Object.entries(baseQuery).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={String(value)} />
              ))}
              <input type="hidden" name="tab" value={selectedTab} />
              <select
                name="month"
                defaultValue={selectedMonthIndex}
                className="min-h-11 flex-1 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
              >
                {projectedMonths.map((month, index) => (
                  <option key={`${month.anio}-${month.mes}`} value={index}>
                    {monthLabel(month.anio, month.mes)}
                  </option>
                ))}
              </select>
              <button className="rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300">
                Ver
              </button>
            </form>
          </section>

          <section className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900/75 p-3">
            <div className="flex min-w-max gap-3">
              {timeline.map(({ month, totals }, index) => (
                <Link
                  key={`${month.anio}-${month.mes}`}
                  href={hrefFor({ month: index })}
                  className={`w-44 shrink-0 rounded-lg border p-3 transition ${
                    index === selectedMonthIndex
                      ? "border-emerald-300/60 bg-emerald-300/10"
                      : "border-white/10 bg-neutral-950/70 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-sm font-semibold text-white">
                    {monthLabel(month.anio, month.mes)}
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">Facturacion</div>
                  <div className="text-sm font-semibold text-emerald-200">
                    $ {moneyFormat(totals.facturacion)}
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">Margen</div>
                  <div className="text-sm font-semibold text-white">
                    $ {moneyFormat(totals.margen)}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {selectedTotals.productosSinCosto > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 shrink-0" size={18} />
              <div>
                <div className="font-semibold">
                  {selectedTotals.productosSinCosto} productos sin costo cargado
                </div>
                <p className="mt-1 text-amber-100/80">
                  La facturacion incluye todos los productos. Costo, margen y porcentaje de
                  margen se calculan solo sobre productos con costo conocido para no asumir
                  costo cero.
                </p>
              </div>
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              label="Facturacion proyectada del mes"
              value={`$ ${moneyFormat(selectedTotals.facturacion)}`}
              comparison={variationLabel(
                selectedTotals.facturacion,
                previousTotals?.facturacion ?? null,
              )}
            />
            <KpiCard
              label="Costo proyectado del mes"
              value={`$ ${moneyFormat(selectedTotals.costo)}`}
              comparison={variationLabel(selectedTotals.costo, previousTotals?.costo ?? null)}
            />
            <KpiCard
              label="Margen bruto del mes"
              value={`$ ${moneyFormat(selectedTotals.margen)}`}
              comparison={variationLabel(selectedTotals.margen, previousTotals?.margen ?? null)}
            />
            <KpiCard
              label="% margen bruto del mes"
              value={percentFormat(selectedTotals.margenPct)}
              comparison={variationLabel(
                selectedTotals.margenPct,
                previousTotals?.margenPct ?? null,
              )}
            />
            <KpiCard
              label="Unidades proyectadas del mes"
              value={numberFormat(selectedTotals.unidades)}
              comparison={variationLabel(
                selectedTotals.unidades,
                previousTotals?.unidades ?? null,
              )}
            />
          </section>

          <nav className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-neutral-900/75 p-2">
            <Link
              href={hrefFor({ tab: "resumen" })}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                selectedTab === "resumen"
                  ? "bg-emerald-400 text-neutral-950"
                  : "text-neutral-300 hover:bg-white/10"
              }`}
            >
              Resumen mensual
            </Link>
            <Link
              href={hrefFor({ tab: "detalle" })}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                selectedTab === "detalle"
                  ? "bg-emerald-400 text-neutral-950"
                  : "text-neutral-300 hover:bg-white/10"
              }`}
            >
              Detalle por producto
            </Link>
          </nav>

          {selectedTab === "resumen" ? (
            <div className="space-y-6">
              <section className="rounded-xl border border-white/10 bg-neutral-900/75">
                <div className="border-b border-white/10 px-5 py-4">
                  <h3 className="text-lg font-semibold text-white">
                    Resumen por familia y tipo
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                      <tr>
                        <th className="px-4 py-3">Familia / Tipo</th>
                        <th className="px-4 py-3 text-right">Unidades</th>
                        <th className="px-4 py-3 text-right">Facturacion</th>
                        <th className="px-4 py-3 text-right">Costo</th>
                        <th className="px-4 py-3 text-right">Margen</th>
                        <th className="px-4 py-3 text-right">% margen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {groupedRows.map((row) => (
                        <tr key={row.label}>
                          <td className="px-4 py-3 font-medium text-white">
                            {row.label}
                            {row.productosSinCosto > 0 && (
                              <span className="ml-2 rounded-full border border-amber-300/30 px-2 py-0.5 text-xs text-amber-100">
                                {row.productosSinCosto} sin costo
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-200">
                            {numberFormat(row.unidades)}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-200">
                            $ {moneyFormat(row.facturacion)}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-200">
                            $ {moneyFormat(row.costo)}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-200">
                            $ {moneyFormat(row.margen)}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-200">
                            {percentFormat(row.margenPct)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <TopProductsCard
                  title="Top 10 por facturacion"
                  rows={topByRevenue}
                  value={(row) => `$ ${moneyFormat(row.point.facturacionProyectada)}`}
                />
                <TopProductsCard
                  title="Top 10 por margen"
                  rows={topByMargin}
                  value={(row) => `$ ${moneyFormat(row.point.margenBrutoProyectado)}`}
                />
              </section>
            </div>
          ) : (
            <section className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900/75">
              <table className="w-full min-w-[1420px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Familia</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Origen</th>
                    <th className="px-4 py-3">Modelo usado</th>
                    <th className="px-4 py-3 text-right">Unidades</th>
                    <th className="px-4 py-3 text-right">Precio venta</th>
                    <th className="px-4 py-3 text-right">Facturacion</th>
                    <th className="px-4 py-3 text-right">Costo unitario</th>
                    <th className="px-4 py-3 text-right">Costo</th>
                    <th className="px-4 py-3 text-right">Margen</th>
                    <th className="px-4 py-3 text-right">% margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {selectedRows.map(({ producto, modelKey, point }) => (
                    <tr key={`${producto.id}-${point.anio}-${point.mes}`}>
                      <td className="px-4 py-3 font-semibold text-white">{producto.sku}</td>
                      <td className="px-4 py-3 text-neutral-200">{producto.nombre}</td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.familia.nombre}
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.tipoProductoVenta.nombre}
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.tipoProduccion}
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {modelKey ? forecastMethodLabels[modelKey] : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {numberFormat(point.unidadesProyectadas)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        $ {moneyFormat(point.precioVentaProyectado)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        $ {moneyFormat(point.facturacionProyectada)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {point.tieneCostoConocido ? (
                          `$ ${moneyFormat(point.costoUnitarioProyectado)}`
                        ) : (
                          <span className="rounded-full border border-amber-300/30 px-2 py-1 text-xs text-amber-100">
                            sin costo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {point.tieneCostoConocido ? `$ ${moneyFormat(point.costoProyectado)}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {point.tieneCostoConocido
                          ? `$ ${moneyFormat(point.margenBrutoProyectado)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {point.tieneCostoConocido
                          ? percentFormat(point.margenBrutoPorcentaje)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  comparison,
}: {
  label: string;
  value: string;
  comparison: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#cad2dd]/10 p-5">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-xs text-emerald-200">{comparison}</div>
    </div>
  );
}

function TopProductsCard({
  title,
  rows,
  value,
}: {
  title: string;
  rows: ProductMonthRow[];
  value: (row: ProductMonthRow) => string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/75">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-white/10">
        {rows.length === 0 ? (
          <div className="px-5 py-6 text-sm text-neutral-400">Sin datos disponibles.</div>
        ) : (
          rows.map((row, index) => (
            <div
              key={`${title}-${row.producto.id}`}
              className="grid grid-cols-[2rem_1fr_auto] gap-3 px-5 py-3 text-sm"
            >
              <div className="text-neutral-500">{index + 1}</div>
              <div className="min-w-0">
                <div className="truncate font-medium text-white">{row.producto.nombre}</div>
                <div className="mt-1 text-xs text-neutral-400">
                  {row.producto.sku}
                  {!row.point.tieneCostoConocido && (
                    <span className="ml-2 text-amber-100">sin costo</span>
                  )}
                </div>
              </div>
              <div className="font-semibold text-emerald-200">{value(row)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
