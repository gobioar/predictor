export const DEFAULT_FORECAST_HORIZON_MONTHS = 18;
export const MIN_FORECAST_HORIZON_MONTHS = 1;
export const MAX_FORECAST_HORIZON_MONTHS = 36;

export function normalizeForecastHorizon(value: number | null | undefined) {
  if (!Number.isFinite(value)) return DEFAULT_FORECAST_HORIZON_MONTHS;

  return Math.min(
    MAX_FORECAST_HORIZON_MONTHS,
    Math.max(MIN_FORECAST_HORIZON_MONTHS, Math.trunc(Number(value))),
  );
}
