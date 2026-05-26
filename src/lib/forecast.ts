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

export type ForecastConfigInput = {
  movingAverageN: number;
  forecastHorizonMonths: number;
  polynomialDegree: 2 | 3;
  maxMonthlyGrowthRate: number;
  holtWintersSeasonLength: number;
  holtWintersMinRequiredMonths: number;
};

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
      forecast: Array.from({ length: horizon }, () => clampDemand(values[0] ?? 0)),
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
      forecast: Array.from({ length: horizon }, () => clampDemand(values.at(-1) ?? 0)),
      mape: null,
      message: `Se requieren al menos ${degree + 1} meses históricos.`,
    };
  }

  const coefficients = polynomialCoefficients(values, degree);
  if (!coefficients) {
    return {
      fitted: values.map(() => null),
      forecast: Array.from({ length: horizon }, () => clampDemand(values.at(-1) ?? 0)),
      mape: null,
      message: "No fue posible ajustar la regresión polinómica.",
    };
  }

  const predict = (x: number) =>
    coefficients.reduce((sum, coefficient, power) => sum + coefficient * Math.pow(x, power), 0);
  const fitted = values.map((_, index) => Math.max(0, predict(index)));
  const growthLimit = Math.max(0, maxMonthlyGrowthRate) / 100;
  const forecast: number[] = [];
  let previous = values.at(-1) ?? 0;

  for (let step = 0; step < horizon; step += 1) {
    const raw = Math.max(0, predict(values.length + step));
    const capped = previous <= 0 ? raw : Math.min(raw, previous * (1 + growthLimit));
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
};

function runHoltWinters(
  values: number[],
  horizon: number,
  seasonLength: number,
  alpha: number,
  beta: number,
  gamma: number,
): HoltState {
  const epsilon = 1e-6;
  const firstSeason = values.slice(0, seasonLength);
  const secondSeason = values.slice(seasonLength, seasonLength * 2);
  let level = Math.max(
    epsilon,
    firstSeason.reduce((sum, value) => sum + value, 0) / seasonLength,
  );
  let trend =
    secondSeason.length === seasonLength
      ? secondSeason.reduce((sum, value, index) => sum + (value - firstSeason[index]), 0) /
        (seasonLength * seasonLength)
      : 0;
  const seasonals = firstSeason.map((value) => Math.max(epsilon, value / level));
  const fitted: Array<number | null> = values.map(() => null);

  for (let index = 0; index < values.length; index += 1) {
    const seasonalIndex = index % seasonLength;
    const seasonal = seasonals[seasonalIndex] ?? 1;
    const prediction = Math.max(0, (level + trend) * seasonal);
    if (index >= seasonLength) fitted[index] = prediction;

    const actual = Math.max(epsilon, values[index]);
    const previousLevel = level;
    level = alpha * (actual / seasonal) + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
    seasonals[seasonalIndex] =
      gamma * (actual / Math.max(epsilon, level)) + (1 - gamma) * seasonal;
  }

  const forecast = Array.from({ length: horizon }, (_, step) => {
    const seasonal = seasonals[(values.length + step) % seasonLength] ?? 1;
    return clampDemand((level + (step + 1) * trend) * seasonal);
  });

  return { fitted, forecast, mape: calculateMAPE(values, fitted) };
}

export function calculateHoltWintersForecast(
  values: number[],
  horizon: number,
  seasonLength = 12,
  minRequiredMonths = 24,
): ModelResult {
  if (values.length < minRequiredMonths || values.length < seasonLength * 2) {
    return {
      fitted: values.map(() => null),
      forecast: [],
      mape: null,
      message: "Datos insuficientes para Holt-Winters",
    };
  }

  let best: HoltState | null = null;
  const candidates = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  for (const alpha of candidates) {
    for (const beta of candidates) {
      for (const gamma of candidates) {
        const result = runHoltWinters(values, horizon, seasonLength, alpha, beta, gamma);
        if (result.mape !== null && (best?.mape === null || best === null || result.mape < best.mape)) {
          best = result;
        }
      }
    }
  }

  return best
    ? { ...best }
    : {
        fitted: values.map(() => null),
        forecast: [],
        mape: null,
        message: "No fue posible calcular Holt-Winters.",
      };
}

export function selectRecommendedModel(
  mapes: Record<string, number | null | undefined>,
) {
  return Object.entries(mapes)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
}
