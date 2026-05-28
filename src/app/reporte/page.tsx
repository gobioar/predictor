import { BadgeCheck, Calculator } from "lucide-react";
import { PreferredForecastModelForm } from "@/components/PreferredForecastModelForm";
import { EmptyState } from "@/components/EmptyState";
import { ReportChart } from "@/components/ReportChart";
import {
  calculateHoltWintersForecast,
  calculateLinearRegressionForecast,
  calculateMovingAverage,
  calculatePolynomialRegressionForecast,
} from "@/lib/forecast";
import { requireAuth } from "@/lib/auth";
import {
  forecastMethodLabels,
  resolveForecastModel,
  type ProductForecastModels,
} from "@/lib/forecast-report";
import {
  calculateEconomicForecast,
  projectPriceCost,
} from "@/lib/economic-forecast";
import {
  DEFAULT_FORECAST_HORIZON_MONTHS,
  normalizeForecastHorizon,
} from "@/lib/forecast-config";
import { prisma } from "@/lib/prisma";
import { formatMonth, generateForecastMonths } from "@/lib/utils";

const formatValue = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString("es-AR") : "Sin datos";

const formatMape = (value: number | null | undefined) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "No disponible";
const formatMoney = (value: number | null | undefined) =>
  typeof value === "number"
    ? `$ ${value.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "Sin datos";
const formatPercent = (value: number | null | undefined) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "Sin datos";

export default async function ReportePage({
  searchParams,
}: {
  searchParams?: Promise<{ productoId?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const [productos, config] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      include: { familia: true, tipoProductoVenta: true },
    }),
    prisma.forecastConfig.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, forecastHorizonMonths: DEFAULT_FORECAST_HORIZON_MONTHS },
    }),
  ]);

  const selectedProductId = Number(params?.productoId ?? productos[0]?.id);
  const selectedProduct = productos.find((producto) => producto.id === selectedProductId);
  const periodos = selectedProduct
    ? await prisma.ventaMensualPeriodo.findMany({
        orderBy: [{ anio: "asc" }, { mes: "asc" }],
        include: {
          items: {
            where: { productoId: selectedProduct.id },
            select: { unidadesVendidas: true },
          },
        },
      })
    : [];

  const values = periodos.map((periodo) => periodo.items[0]?.unidadesVendidas ?? 0);
  const horizon = normalizeForecastHorizon(config.forecastHorizonMonths);
  const movingAverage = values.length
    ? calculateMovingAverage(values, horizon, config.movingAverageN)
    : null;
  const linear = values.length ? calculateLinearRegressionForecast(values, horizon) : null;
  const polynomial = values.length
    ? calculatePolynomialRegressionForecast(
        values,
        horizon,
        config.polynomialDegree as 2 | 3,
        config.maxMonthlyGrowthRate,
      )
    : null;
  const holtWinters = values.length
    ? calculateHoltWintersForecast(
        values,
        horizon,
        config.holtWintersSeasonLength,
        config.holtWintersMinRequiredMonths,
      )
    : null;
  const models: ProductForecastModels | null =
    movingAverage && linear && polynomial && holtWinters
      ? { movingAverage, linear, polynomial, holtWinters }
      : null;
  const { automaticModelKey, usedModelKey, isManual } = resolveForecastModel(
    models,
    selectedProduct?.preferredForecastModel,
  );

  const futureMonths = generateForecastMonths(periodos.at(-1), horizon);

  const chartData = [
    ...periodos.map((periodo, index) => ({
      mes: formatMonth(periodo.anio, periodo.mes),
      real: values[index],
      movingAverage: movingAverage?.fitted[index] ?? null,
      linear: linear?.fitted[index] ?? null,
      polynomial: polynomial?.fitted[index] ?? null,
      holtWinters: holtWinters?.fitted[index] ?? null,
    })),
    ...futureMonths.map((date, index) => ({
      mes: formatMonth(date.anio, date.mes),
      real: null,
      movingAverage: movingAverage?.forecast[index] ?? null,
      linear: linear?.forecast[index] ?? null,
      polynomial: polynomial?.forecast[index] ?? null,
      holtWinters: holtWinters?.forecast[index] ?? null,
    })),
  ];

  const rows = futureMonths.map((date, index) => ({
    date,
    movingAverage: movingAverage?.forecast[index] ?? null,
    linear: linear?.forecast[index] ?? null,
    polynomial: polynomial?.forecast[index] ?? null,
    holtWinters: holtWinters?.forecast[index] ?? null,
  }));
  const usedForecast =
    usedModelKey && models ? models[usedModelKey].forecast : [];
  const economicForecast =
    selectedProduct && futureMonths.length
      ? calculateEconomicForecast(
          usedForecast,
          await projectPriceCost(selectedProduct.id, futureMonths, config),
        )
      : [];

  const mapes = [
    { key: "movingAverage", label: forecastMethodLabels.movingAverage, value: movingAverage?.mape },
    { key: "linear", label: forecastMethodLabels.linear, value: linear?.mape },
    { key: "polynomial", label: forecastMethodLabels.polynomial, value: polynomial?.mape },
    { key: "holtWinters", label: forecastMethodLabels.holtWinters, value: holtWinters?.mape },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Forecast
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Reporte Predictivo</h1>
        </div>
        <form className="flex min-w-80 gap-2">
          <select
            name="productoId"
            defaultValue={selectedProduct?.id}
            className="min-h-11 flex-1 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.sku} - {producto.nombre}
              </option>
            ))}
          </select>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300">
            <Calculator size={17} />
            Calcular
          </button>
        </form>
      </header>

      {productos.length === 0 ? (
        <EmptyState title="No hay productos activos" detail="Crea productos activos y ventas historicas para generar un forecast." />
      ) : !selectedProduct ? (
        <EmptyState title="Producto no encontrado" detail="Selecciona un producto activo para recalcular el reporte." />
      ) : periodos.length === 0 ? (
        <EmptyState title="Sin historico para este producto" detail="Carga ventas mensuales para que los modelos puedan calcular proyecciones." />
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-lg border border-white/10 bg-neutral-900/75 p-5 lg:col-span-2">
              <div className="text-sm text-neutral-400">Producto seleccionado</div>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {selectedProduct.sku} - {selectedProduct.nombre}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-300">
                <span className="rounded-md bg-white/[0.06] px-2 py-1">{selectedProduct.familia.nombre}</span>
                <span className="rounded-md bg-white/[0.06] px-2 py-1">{selectedProduct.tipoProductoVenta.nombre}</span>
                <span className="rounded-md bg-white/[0.06] px-2 py-1">{periodos.length} meses historicos</span>
              </div>

              {automaticModelKey && (
                <div className="mt-5 grid gap-3 text-sm text-neutral-300 md:grid-cols-2">
                  <div className="rounded-md bg-[#cad2dd]/10 px-3 py-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-400">
                      Modelo automatico
                    </div>
                    <div className="mt-1 font-semibold text-white">
                      {forecastMethodLabels[automaticModelKey]}
                    </div>
                  </div>
                  <div className="rounded-md bg-[#cad2dd]/10 px-3 py-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-400">
                      Modelo utilizado
                    </div>
                    <div className="mt-1 font-semibold text-white">
                      {usedModelKey
                        ? `${forecastMethodLabels[usedModelKey]} ${isManual ? "(manual)" : "(automatico)"}`
                        : "Sin datos"}
                    </div>
                  </div>
                </div>
              )}

              {usedModelKey && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                  <BadgeCheck size={17} />
                  Modelo utilizado: {forecastMethodLabels[usedModelKey]}
                </div>
              )}

              <PreferredForecastModelForm
                productoId={selectedProduct.id}
                preferredModel={selectedProduct.preferredForecastModel}
              />

              {holtWinters?.message && (
                <p className="mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                  {holtWinters.message}
                </p>
              )}
            </div>

            {mapes.map((mape) => (
              <div key={mape.key} className="rounded-lg border border-white/10 bg-[#cad2dd]/10 p-5">
                <div className="text-sm text-neutral-400">MAPE {mape.label}</div>
                <div className="mt-3 text-2xl font-semibold text-white">{formatMape(mape.value)}</div>
              </div>
            ))}
          </section>

          <ReportChart data={chartData} forecastStartLabel={futureMonths[0] ? formatMonth(futureMonths[0].anio, futureMonths[0].mes) : undefined} />

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Proyección económica</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Calculada con el modelo de unidades actualmente utilizado.
              </p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Mes</th>
                    <th className="px-4 py-3 text-right">Unidades</th>
                    <th className="px-4 py-3 text-right">Precio venta</th>
                    <th className="px-4 py-3 text-right">Facturación</th>
                    <th className="px-4 py-3 text-right">Costo unitario</th>
                    <th className="px-4 py-3 text-right">Costo</th>
                    <th className="px-4 py-3 text-right">Margen</th>
                    <th className="px-4 py-3 text-right">% margen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {economicForecast.map((row) => (
                    <tr key={`${row.anio}-${row.mes}`}>
                      <td className="px-4 py-3 text-neutral-300">
                        {formatMonth(row.anio, row.mes)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {row.unidadesProyectadas.toLocaleString("es-AR")}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatMoney(row.precioVentaProyectado)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatMoney(row.facturacionProyectada)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatMoney(row.costoUnitarioProyectado)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatMoney(row.costoProyectado)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatMoney(row.margenBrutoProyectado)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-200">
                        {formatPercent(row.margenBrutoPorcentaje)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Mes proyectado</th>
                  <th className="px-4 py-3">Moving Average</th>
                  <th className="px-4 py-3">Regresion Lineal</th>
                  <th className="px-4 py-3">Regresion Polinomica</th>
                  <th className="px-4 py-3">Holt-Winters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((row) => (
                  <tr key={`${row.date.anio}-${row.date.mes}`}>
                    <td className="px-4 py-3 text-white">{selectedProduct.nombre}</td>
                    <td className="px-4 py-3 text-neutral-300">{formatMonth(row.date.anio, row.date.mes)}</td>
                    <td className="px-4 py-3 text-neutral-200">{formatValue(row.movingAverage)}</td>
                    <td className="px-4 py-3 text-neutral-200">{formatValue(row.linear)}</td>
                    <td className="px-4 py-3 text-neutral-200">{formatValue(row.polynomial)}</td>
                    <td className="px-4 py-3 text-neutral-200">{formatValue(row.holtWinters)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
