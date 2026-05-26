CREATE TYPE "ForecastModel" AS ENUM ('movingAverage', 'linear', 'polynomial', 'holtWinters');

ALTER TABLE "Producto" ADD COLUMN "preferredForecastModel" "ForecastModel";
