ALTER TABLE "ForecastConfig" ALTER COLUMN "forecastHorizonMonths" SET DEFAULT 18;

UPDATE "ForecastConfig"
SET "forecastHorizonMonths" = 18
WHERE "forecastHorizonMonths" = 12;
