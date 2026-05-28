export type ForecastPoint = {
  index: number;
  value: number;
};

export type ModelResult = {
  fitted: Array<number | null>;
  forecast: number[];
  mape: number | null;
  message?: string;
};

export type HoltWintersMode = "additive" | "multiplicative";

export type ForecastConfigInput = {
  movingAverageN: number;
  forecastHorizonMonths: number;
  polynomialDegree: 2 | 3;
  maxMonthlyGrowthRate: number;
  holtWintersSeasonLength: number;
  holtWintersMinRequiredMonths: number;
  holtWintersTrendType: HoltWintersMode;
  holtWintersSeasonalType: HoltWintersMode;
};

const EPSILON = 1e-6;

const clampDemand = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

export function calculateMAPE(
  actual: number[],
  predicted: Array<number | null | undefined>,
) {
  const errors: number[] = [];

  actual.forEach((value, index) => {
    const prediction = predicted[index];
    if (value > 0 && prediction !== null && prediction !== undefined) {
      errors.push(Math.abs((value - prediction) / value) * 100);
    }
  });

  if (!errors.length) return null;
  return errors.reduce((sum, value) => sum + value, 0) / errors.length;
}

export function calculateMovingAverage(
  values: number[],
  horizon: number,
  window: number,
): ModelResult {
  const n = Math.max(1, window);
  const fitted = values.map((_, index) => {
    if (index < n) return null;
    const slice = values.slice(index - n, index);
    return slice.reduce((sum, value) => sum + value, 0) / n;
  });

  const rolling = [...values];
  const forecast: number[] = [];

  for (let step = 0; step < horizon; step += 1) {
    const slice = rolling.slice(-n);
    const prediction =
      slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
    const demand = clampDemand(prediction);
    forecast.push(demand);
    rolling.push(demand);
  }

  return { fitted, forecast, mape: calculateMAPE(values, fitted) };
}

function linearCoefficients(values: number[]) {
  const n = values.length;
  const xs = values.map((_, index) => index);
  const sumX = xs.reduce((sum, value) => sum + value, 0);
  const sumY = values.reduce((sum, value) => sum + value, 0);
  const sumXY = xs.reduce((sum, value, index) => sum + value * values[index], 0);
  const sumXX = xs.reduce((sum, value) => sum + value * value, 0);
  const denominator = n * sumXX - sumX * sumX;

  if (denominator === 0) return { slope: 0, intercept: sumY / Math.max(1, n) };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function calculateLinearRegressionForecast(
  values: number[],
  horizon: number,
): ModelResult {
  if (values.length < 2) {
    return {
      fitted: values.map(() => null),
      forecast: Array.from({ length: horizon }, () =>
        clampDemand(values[0] ?? 0),
      ),
      mape: null,
      message: "Se requieren al menos 2 meses históricos.",
    };
  }

  const { slope, intercept } = linearCoefficients(values);
  const predict = (x: number) => Math.max(0, intercept + slope * x);

  const fitted = values.map((_, index) => predict(index));
  const forecast = Array.from({ length: horizon }, (_, step) =>
    clampDemand(predict(values.length + step)),
  );

  return { fitted, forecast, mape: calculateMAPE(values, fitted) };
}

function solveLinearSystem(matrix: number[][], vector: number[]) {
  const n = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);

  for (let col = 0; col < n; col += 1) {
    let pivot = col;

    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivot][col])) {
        pivot = row;
      }
    }

    [augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];

    const divisor = augmented[col][col];
    if (Math.abs(divisor) < 1e-10) return null;

    for (let item = col; item <= n; item += 1) {
      augmented[col][item] /= divisor;
    }

    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;

      const factor = augmented[row][col];

      for (let item = col; item <= n; item += 1) {
        augmented[row][item] -= factor * augmented[col][item];
      }
    }
  }

  return augmented.map((row) => row[n]);
}

function polynomialCoefficients(values: number[], degree: 2 | 3) {
  const size = degree + 1;

  const matrix = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) =>
      values.reduce((sum, _, index) => sum + Math.pow(index, row + col), 0),
    ),
  );

  const vector = Array.from({ length: size }, (_, row) =>
    values.reduce((sum, value, index) => sum + value * Math.pow(index, row), 0),
  );

  return solveLinearSystem(matrix, vector);
}

export function calculatePolynomialRegressionForecast(
  values: number[],
  horizon: number,
  degree: 2 | 3,
  maxMonthlyGrowthRate: number,
): ModelResult {
  if (values.length < degree + 1) {
    return {
      fitted: values.map(() => null),
      forecast: Array.from({ length: horizon }, () =>
        clampDemand(values.at(-1) ?? 0),
      ),
      mape: null,
      message: `Se requieren al menos ${degree + 1} meses históricos.`,
    };
  }

  const coefficients = polynomialCoefficients(values, degree);

  if (!coefficients) {
    return {
      fitted: values.map(() => null),
      forecast: Array.from({ length: horizon }, () =>
        clampDemand(values.at(-1) ?? 0),
      ),
      mape: null,
      message: "No fue posible ajustar la regresión polinómica.",
    };
  }

  const predict = (x: number) =>
    coefficients.reduce(
      (sum, coefficient, power) => sum + coefficient * Math.pow(x, power),
      0,
    );

  const fitted = values.map((_, index) => Math.max(0, predict(index)));
  const growthLimit = Math.max(0, maxMonthlyGrowthRate) / 100;
  const forecast: number[] = [];
  let previous = values.at(-1) ?? 0;

  for (let step = 0; step < horizon; step += 1) {
    const raw = Math.max(0, predict(values.length + step));
    const capped =
      previous <= 0 ? raw : Math.min(raw, previous * (1 + growthLimit));
    const demand = clampDemand(capped);
    forecast.push(demand);
    previous = demand;
  }

  return { fitted, forecast, mape: calculateMAPE(values, fitted) };
}

type HoltState = {
  fitted: Array<number | null>;
  forecast: number[];
  mape: number | null;
  message?: string;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hasUnsafeMultiplicativeData(values: number[]) {
  const zeroOrTinyCount = values.filter((value) => value <= EPSILON).length;
  const max = Math.max(...values);
  const positiveValues = values.filter((value) => value > 0);
  const minPositive = Math.min(...positiveValues);

  return (
    zeroOrTinyCount > 0 ||
    !Number.isFinite(minPositive) ||
    max / Math.max(minPositive, EPSILON) > 100
  );
}

function capForecastByHistory(value: number, values: number[], lookbackMonths: number) {
  const recent = values.slice(-Math.max(1, lookbackMonths));
  const avgRecent = average(recent);
  const maxRecent = Math.max(...recent, 0);

  const cap = Math.max(
    avgRecent > 0 ? avgRecent * 5 : 0,
    maxRecent > 0 ? maxRecent * 3 : 0,
    1,
  );

  return Math.min(Math.max(0, value), cap);
}

function computePrediction(
  level: number,
  trend: number,
  seasonal: number,
  step: number,
  trendType: HoltWintersMode,
  seasonalType: HoltWintersMode,
) {
  const base =
    trendType === "multiplicative"
      ? level * Math.pow(Math.max(trend, EPSILON), step)
      : level + step * trend;

  return seasonalType === "multiplicative" ? base * seasonal : base + seasonal;
}

function initializeTrend(
  firstSeason: number[],
  secondSeason: number[],
  seasonLength: number,
  trendType: HoltWintersMode,
) {
  if (secondSeason.length !== seasonLength) {
    return trendType === "multiplicative" ? 1 : 0;
  }

  const firstAvg = Math.max(EPSILON, average(firstSeason));
  const secondAvg = Math.max(EPSILON, average(secondSeason));

  if (trendType === "multiplicative") {
    return Math.max(EPSILON, Math.pow(secondAvg / firstAvg, 1 / seasonLength));
  }

  return (secondAvg - firstAvg) / seasonLength;
}

function initializeSeasonals(
  firstSeason: number[],
  level: number,
  seasonalType: HoltWintersMode,
) {
  if (seasonalType === "multiplicative") {
    return firstSeason.map((value) => Math.max(EPSILON, value / Math.max(level, EPSILON)));
  }

  return firstSeason.map((value) => value - level);
}

function runHoltWinters(
  values: number[],
  horizon: number,
  seasonLength: number,
  alpha: number,
  beta: number,
  gamma: number,
  trendType: HoltWintersMode,
  seasonalType: HoltWintersMode,
): HoltState {
  const firstSeason = values.slice(0, seasonLength);
  const secondSeason = values.slice(seasonLength, seasonLength * 2);

  let level = Math.max(EPSILON, average(firstSeason));
  let trend = initializeTrend(firstSeason, secondSeason, seasonLength, trendType);
  const seasonals = initializeSeasonals(firstSeason, level, seasonalType);

  const fitted: Array<number | null> = values.map(() => null);

  for (let index = 0; index < values.length; index += 1) {
    const seasonalIndex = index % seasonLength;
    const seasonal =
      seasonals[seasonalIndex] ?? (seasonalType === "multiplicative" ? 1 : 0);

    const prediction = computePrediction(
      level,
      trend,
      seasonal,
      1,
      trendType,
      seasonalType,
    );

    if (index >= seasonLength) {
      fitted[index] = Math.max(0, prediction);
    }

    const actual = Math.max(0, values[index]);
    const previousLevel = Math.max(level, EPSILON);

    const deseasonalized =
      seasonalType === "multiplicative"
        ? actual / Math.max(seasonal, EPSILON)
        : actual - seasonal;

    const projectedBase =
      trendType === "multiplicative"
        ? level * Math.max(trend, EPSILON)
        : level + trend;

    level = alpha * deseasonalized + (1 - alpha) * projectedBase;
    level = Math.max(EPSILON, level);

    if (trendType === "multiplicative") {
      const levelRatio = level / previousLevel;
      trend = beta * levelRatio + (1 - beta) * Math.max(trend, EPSILON);
      trend = Math.max(EPSILON, trend);
    } else {
      trend = beta * (level - previousLevel) + (1 - beta) * trend;
    }

    const newSeasonal =
      seasonalType === "multiplicative"
        ? actual / Math.max(level, EPSILON)
        : actual - level;

    seasonals[seasonalIndex] =
      gamma * newSeasonal + (1 - gamma) * seasonal;

    if (seasonalType === "multiplicative") {
      seasonals[seasonalIndex] = Math.max(EPSILON, seasonals[seasonalIndex]);
    }
  }

  const forecast = Array.from({ length: horizon }, (_, step) => {
    const seasonal =
      seasonals[(values.length + step) % seasonLength] ??
      (seasonalType === "multiplicative" ? 1 : 0);

    const raw = computePrediction(
      level,
      trend,
      seasonal,
      step + 1,
      trendType,
      seasonalType,
    );

    const capped = capForecastByHistory(raw, values, seasonLength);

    return clampDemand(capped);
  });

  const hasBadForecast = forecast.some(
    (value) => !Number.isFinite(value) || value < 0,
  );

  if (hasBadForecast) {
    return {
      fitted,
      forecast: [],
      mape: null,
      message: "Holt-Winters generó valores inválidos.",
    };
  }

  return { fitted, forecast, mape: calculateMAPE(values, fitted) };
}

export function calculateHoltWintersForecast(
  values: number[],
  horizon: number,
  seasonLength = 12,
  minRequiredMonths = 24,
  trendType: HoltWintersMode = "additive",
  seasonalType: HoltWintersMode = "additive",
): ModelResult {
  if (values.length < minRequiredMonths || values.length < seasonLength * 2) {
    return {
      fitted: values.map(() => null),
      forecast: [],
      mape: null,
      message: "Datos insuficientes para Holt-Winters",
    };
  }

  let effectiveTrendType = trendType;
  let effectiveSeasonalType = seasonalType;

  if (
    (effectiveTrendType === "multiplicative" ||
      effectiveSeasonalType === "multiplicative") &&
    hasUnsafeMultiplicativeData(values)
  ) {
    effectiveTrendType = "additive";
    effectiveSeasonalType = "additive";
  }

  let best: HoltState | null = null;
  const candidates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  for (const alpha of candidates) {
    for (const beta of candidates) {
      for (const gamma of candidates) {
        const result = runHoltWinters(
          values,
          horizon,
          seasonLength,
          alpha,
          beta,
          gamma,
          effectiveTrendType,
          effectiveSeasonalType,
        );

        if (
          result.mape !== null &&
          Number.isFinite(result.mape) &&
          (best === null || best.mape === null || result.mape < best.mape)
        ) {
          best = result;
        }
      }
    }
  }

  if (!best) {
    return {
      fitted: values.map(() => null),
      forecast: [],
      mape: null,
      message: "No fue posible calcular Holt-Winters.",
    };
  }

  return {
    ...best,
    message:
      effectiveTrendType !== trendType || effectiveSeasonalType !== seasonalType
        ? "Se usó Holt-Winters additive por seguridad: la serie contiene ceros, valores muy bajos o picos extremos."
        : undefined,
  };
}

export function selectRecommendedModel(
  mapes: Record<string, number | null | undefined>,
) {
  return Object.entries(mapes)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
}
