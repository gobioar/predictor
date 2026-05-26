import {
  calculateHoltWintersForecast,
  calculateLinearRegressionForecast,
  calculateMovingAverage,
  calculatePolynomialRegressionForecast,
  selectRecommendedModel,
  type ModelResult,
} from "@/lib/forecast";

export type ForecastMethod =
  | "movingAverage"
  | "linear"
  | "polynomial"
  | "holtWinters"
  | "recommended";

export const forecastMethodLabels: Record<ForecastMethod, string> = {
  movingAverage: "Moving Average",
  linear: "Regresión Lineal",
  polynomial: "Regresión Polinómica",
  holtWinters: "Holt-Winters",
  recommended: "Modelo Recomendado",
};

export type ForecastConfigForModels = {
  movingAverageN: number;
  forecastHorizonMonths: number;
  polynomialDegree: number;
  maxMonthlyGrowthRate: number;
  holtWintersSeasonLength: number;
  holtWintersMinRequiredMonths: number;
  holtWintersTrendType: string;
holtWintersSeasonalType: string;
};

export type ForecastModelKey = Exclude<ForecastMethod, "recommended">;

export type ProductForecastModels = Record<ForecastModelKey, ModelResult>;

export function buildProductSeries(
  periodos: Array<{
    items: Array<{ unidadesVendidas: number }>;
  }>,
) {
  return periodos.map((periodo) => periodo.items[0]?.unidadesVendidas ?? 0);
}

export function calculateProductForecastModels(
  values: number[],
  config: ForecastConfigForModels,
): ProductForecastModels | null {
  if (!values.length) return null;

  const horizon = config.forecastHorizonMonths || 12;

  return {
    movingAverage: calculateMovingAverage(
      values,
      horizon,
      config.movingAverageN,
    ),

    linear: calculateLinearRegressionForecast(values, horizon),

    polynomial: calculatePolynomialRegressionForecast(
      values,
      horizon,
      config.polynomialDegree as 2 | 3,
      config.maxMonthlyGrowthRate,
    ),

    holtWinters: calculateHoltWintersForecast(
  values,
  horizon,
  config.holtWintersSeasonLength,
  config.holtWintersMinRequiredMonths,
  config.holtWintersTrendType === "multiplicative" ? "multiplicative" : "additive",
  config.holtWintersSeasonalType === "multiplicative" ? "multiplicative" : "additive",
),
  };
}

export function getRecommendedForecastModel(models: ProductForecastModels) {
  return selectRecommendedModel({
    movingAverage: models.movingAverage.mape,
    linear: models.linear.mape,
    polynomial: models.polynomial.mape,
    holtWinters: models.holtWinters.mape,
  }) as ForecastModelKey | null;
}

export function getForecastForMethod(
  models: ProductForecastModels | null,
  method: ForecastMethod,
) {
  if (!models) return { forecast: [], modelKey: null as ForecastModelKey | null };

  if (method === "recommended") {
    const modelKey = getRecommendedForecastModel(models);

    return {
      forecast: modelKey ? models[modelKey].forecast : [],
      modelKey,
    };
  }

  return {
    forecast: models[method].forecast,
    modelKey: method,
  };
}