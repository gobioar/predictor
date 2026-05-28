import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type EconomicProjectionMethod = "lastKnown" | "movingAverage" | "manualGrowth";

export type EconomicForecastConfig = {
  economicProjectionMethod: string;
  monthlyPriceGrowthRate: Prisma.Decimal | number | string;
  monthlyCostGrowthRate: Prisma.Decimal | number | string;
  movingAverageN: number;
};

export type PriceCostProjectionPoint = {
  anio: number;
  mes: number;
  precioVentaProyectado: number;
  costoUnitarioProyectado: number;
  tieneCostoConocido: boolean;
};

export type EconomicForecastPoint = PriceCostProjectionPoint & {
  unidadesProyectadas: number;
  facturacionProyectada: number;
  costoProyectado: number;
  margenBrutoProyectado: number;
  margenBrutoPorcentaje: number | null;
};

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const round = (value: number, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const normalizeMethod = (method: string): EconomicProjectionMethod =>
  method === "manualGrowth" || method === "movingAverage" ? method : "lastKnown";

export async function getLatestPriceCost(productoId: number) {
  return prisma.precioCostoMensualItem.findFirst({
    where: { productoId },
    orderBy: [{ periodo: { anio: "desc" } }, { periodo: { mes: "desc" } }],
    select: {
      precioVentaPromedio: true,
      costoUnitarioPromedio: true,
      periodo: { select: { anio: true, mes: true } },
    },
  });
}

export async function projectPriceCost(
  productoId: number,
  projectedMonths: Array<{ anio: number; mes: number }>,
  config: EconomicForecastConfig,
): Promise<PriceCostProjectionPoint[]> {
  const history = await prisma.precioCostoMensualItem.findMany({
    where: { productoId },
    orderBy: [{ periodo: { anio: "asc" } }, { periodo: { mes: "asc" } }],
    select: {
      precioVentaPromedio: true,
      costoUnitarioPromedio: true,
    },
  });
  const method = normalizeMethod(config.economicProjectionMethod);
  const priceHistory = history
    .map((item) => toNumber(item.precioVentaPromedio))
    .filter((value) => value > 0);
  const costHistory = history
    .map((item) => toNumber(item.costoUnitarioPromedio))
    .filter((value) => value > 0);
  const window = Math.max(1, config.movingAverageN);
  const basePrice =
    method === "movingAverage"
      ? average(priceHistory.slice(-window))
      : (priceHistory.at(-1) ?? 0);
  const baseCost =
    method === "movingAverage"
      ? average(costHistory.slice(-window))
      : (costHistory.at(-1) ?? 0);
  const monthlyPriceGrowthRate = toNumber(config.monthlyPriceGrowthRate) / 100;
  const monthlyCostGrowthRate = toNumber(config.monthlyCostGrowthRate) / 100;
  const tieneCostoConocido = costHistory.length > 0;

  return projectedMonths.map((month, index) => {
    const step = index + 1;
    const price =
      method === "manualGrowth"
        ? basePrice * Math.pow(1 + monthlyPriceGrowthRate, step)
        : basePrice;
    const cost =
      method === "manualGrowth"
        ? baseCost * Math.pow(1 + monthlyCostGrowthRate, step)
        : baseCost;

    return {
      ...month,
      precioVentaProyectado: round(Math.max(0, price)),
      costoUnitarioProyectado: round(Math.max(0, cost)),
      tieneCostoConocido,
    };
  });
}

export function calculateEconomicForecast(
  productForecast: number[],
  priceCostProjection: PriceCostProjectionPoint[],
): EconomicForecastPoint[] {
  return priceCostProjection.map((projection, index) => {
    const unidadesProyectadas = Math.max(0, Math.round(productForecast[index] ?? 0));
    const facturacionProyectada = round(
      unidadesProyectadas * projection.precioVentaProyectado,
    );
    const costoProyectado = round(
      unidadesProyectadas * projection.costoUnitarioProyectado,
    );
    const margenBrutoProyectado = round(facturacionProyectada - costoProyectado);
    const margenBrutoPorcentaje =
      facturacionProyectada > 0
        ? round((margenBrutoProyectado / facturacionProyectada) * 100)
        : null;

    return {
      ...projection,
      unidadesProyectadas,
      facturacionProyectada,
      costoProyectado,
      margenBrutoProyectado,
      margenBrutoPorcentaje,
    };
  });
}
