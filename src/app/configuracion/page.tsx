import { Save } from "lucide-react";
import { updateForecastConfig } from "@/app/actions";
import { Alert } from "@/components/Alert";
import { requireAuth } from "@/lib/auth";
import {
  DEFAULT_FORECAST_HORIZON_MONTHS,
  MAX_FORECAST_HORIZON_MONTHS,
  MIN_FORECAST_HORIZON_MONTHS,
} from "@/lib/forecast-config";
import { prisma } from "@/lib/prisma";

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;

  const config = await prisma.forecastConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, forecastHorizonMonths: DEFAULT_FORECAST_HORIZON_MONTHS },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Parámetros
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-white">
          Configuración de Forecast
        </h1>
      </header>

      <Alert message={params?.error} />

      <form
        action={updateForecastConfig}
        className="grid gap-4 rounded-lg border border-white/10 bg-neutral-900/75 p-5 md:grid-cols-2"
      >
        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Moving Average N
          </span>

          <input
            name="movingAverageN"
            type="number"
            min="1"
            defaultValue={config.movingAverageN}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Horizonte forecast meses
          </span>

          <input
            name="forecastHorizonMonths"
            type="number"
            min={MIN_FORECAST_HORIZON_MONTHS}
            max={MAX_FORECAST_HORIZON_MONTHS}
            defaultValue={config.forecastHorizonMonths}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Grado polinómico
          </span>

          <select
            name="polynomialDegree"
            defaultValue={config.polynomialDegree}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          >
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Crecimiento máximo mensual polinómica (%)
          </span>

          <input
            name="maxMonthlyGrowthRate"
            type="number"
            min="0"
            step="0.1"
            defaultValue={config.maxMonthlyGrowthRate}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Holt-Winters longitud estacional
          </span>

          <input
            name="holtWintersSeasonLength"
            type="number"
            min="2"
            defaultValue={config.holtWintersSeasonLength}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Holt-Winters meses mínimos requeridos
          </span>

          <input
            name="holtWintersMinRequiredMonths"
            type="number"
            min="2"
            defaultValue={config.holtWintersMinRequiredMonths}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Tendencia Holt-Winters
          </span>

          <select
            name="holtWintersTrendType"
            defaultValue={config.holtWintersTrendType}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          >
            <option value="additive">additive</option>
            <option value="multiplicative">multiplicative</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-neutral-300">
            Estacionalidad Holt-Winters
          </span>

          <select
            name="holtWintersSeasonalType"
            defaultValue={config.holtWintersSeasonalType}
            className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
          >
            <option value="additive">additive</option>
            <option value="multiplicative">multiplicative</option>
          </select>
        </label>

        <div className="md:col-span-2">
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300">
            <Save size={17} />

            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  );
}
