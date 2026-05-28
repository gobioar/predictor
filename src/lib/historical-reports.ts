import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getReportingMaterial,
  reportingMaterialKeys,
  type ReportingMaterial,
} from "@/lib/reporting-categories";

export type HistoricalReportTab = "unidades" | "ventas" | "cmv";
export type ProductionFilter = "all" | "Propio" | "Externo";
export type CategoryFilter = "all" | ReportingMaterial;

export type HistoricalReportFilters = {
  from?: string;
  to?: string;
  tipoProduccion?: ProductionFilter;
  categoria?: CategoryFilter;
};

export type HistoricalReportPeriod = {
  id: number;
  anio: number;
  mes: number;
  value: string;
};

export type HistoricalMetricBucket = {
  propio: number;
  externo: number;
  total: number;
};

export type HistoricalReportMonthRow = {
  period: HistoricalReportPeriod;
  unidades: Record<ReportingMaterial, HistoricalMetricBucket> & {
    total: number;
  };
  ventas: Record<ReportingMaterial, HistoricalMetricBucket> & {
    total: number;
  };
  cmv: Record<ReportingMaterial, HistoricalMetricBucket> & {
    total: number;
  };
  shares: {
    bagazo: number | null;
    cubiertos: number | null;
    bolsas: number | null;
    fibra: number | null;
    kraft: number | null;
    servicios: number | null;
  };
  missingPriceCount: number;
  missingCostCount: number;
};

export type HistoricalReportData = {
  periods: HistoricalReportPeriod[];
  rows: HistoricalReportMonthRow[];
  totals: {
    unidades: Record<ReportingMaterial, number> & { total: number };
    ventas: Record<ReportingMaterial, number> & { total: number };
    cmv: Record<ReportingMaterial, number> & { total: number };
  };
  missingPriceCount: number;
  missingCostCount: number;
};

type PriceCostValue = {
  precioVentaPromedio: Prisma.Decimal;
  costoUnitarioPromedio: Prisma.Decimal;
};

const periodValue = (periodo: { anio: number; mes: number }) =>
  `${periodo.anio}-${String(periodo.mes).padStart(2, "0")}`;

const periodSerial = (periodo: { anio: number; mes: number }) =>
  periodo.anio * 12 + periodo.mes;

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const normalizeProduction = (value: string | null | undefined): "propio" | "externo" =>
  value === "Externo" ? "externo" : "propio";

const emptyBuckets = () =>
  Object.fromEntries(
    reportingMaterialKeys.map((key) => [
      key,
      { propio: 0, externo: 0, total: 0 } satisfies HistoricalMetricBucket,
    ]),
  ) as Record<ReportingMaterial, HistoricalMetricBucket>;

const emptyMetric = () => ({
  ...emptyBuckets(),
  total: 0,
});

const emptyTotals = () =>
  Object.fromEntries(reportingMaterialKeys.map((key) => [key, 0])) as Record<
    ReportingMaterial,
    number
  >;

const addMetric = (
  metric: Record<ReportingMaterial, HistoricalMetricBucket> & { total: number },
  material: ReportingMaterial,
  production: "propio" | "externo",
  value: number,
) => {
  metric[material][production] += value;
  metric[material].total += value;
  metric.total += value;
};

const buildShares = (
  unidades: Record<ReportingMaterial, HistoricalMetricBucket> & { total: number },
) => {
  const share = (value: number) =>
    unidades.total > 0 ? (value / unidades.total) * 100 : null;

  return {
    bagazo: share(unidades.bagazo.total),
    cubiertos: share(unidades.madera.total),
    bolsas: share(unidades.bioplastico.total),
    fibra: share(unidades.fibra.total),
    kraft: share(unidades.kraft.total),
    servicios: share(unidades.servicios.total),
  };
};

export async function getHistoricalReportPeriods(): Promise<HistoricalReportPeriod[]> {
  const periodos = await prisma.ventaMensualPeriodo.findMany({
    orderBy: [{ anio: "asc" }, { mes: "asc" }],
    select: { id: true, anio: true, mes: true },
  });

  return periodos.map((periodo) => ({ ...periodo, value: periodValue(periodo) }));
}

export async function buildHistoricalReportData(
  filters: HistoricalReportFilters,
): Promise<HistoricalReportData> {
  const allPeriods = await getHistoricalReportPeriods();
  const fromSerial = filters.from
    ? periodSerial({
        anio: Number(filters.from.slice(0, 4)),
        mes: Number(filters.from.slice(5, 7)),
      })
    : Number.NEGATIVE_INFINITY;
  const toSerial = filters.to
    ? periodSerial({
        anio: Number(filters.to.slice(0, 4)),
        mes: Number(filters.to.slice(5, 7)),
      })
    : Number.POSITIVE_INFINITY;
  const periods = allPeriods.filter((periodo) => {
    const serial = periodSerial(periodo);
    return serial >= fromSerial && serial <= toSerial;
  });
  const periodIds = periods.map((periodo) => periodo.id);

  if (!periodIds.length) {
    return {
      periods,
      rows: [],
      totals: {
        unidades: { ...emptyTotals(), total: 0 },
        ventas: { ...emptyTotals(), total: 0 },
        cmv: { ...emptyTotals(), total: 0 },
      },
      missingPriceCount: 0,
      missingCostCount: 0,
    };
  }

  const ventas = await prisma.ventaMensualItem.findMany({
    where: { periodoId: { in: periodIds } },
    select: {
      unidadesVendidas: true,
      periodo: { select: { id: true, anio: true, mes: true } },
      producto: {
        select: {
          id: true,
          sku: true,
          nombre: true,
          tipoProduccion: true,
          familia: { select: { nombre: true } },
          tipoProductoVenta: { select: { nombre: true } },
        },
      },
    },
  });
  const productIds = [...new Set(ventas.map((item) => item.producto.id))];
  const priceCostPeriods = productIds.length
    ? await prisma.precioCostoMensualPeriodo.findMany({
        where: {
          OR: periods.map((periodo) => ({ anio: periodo.anio, mes: periodo.mes })),
        },
        select: {
          anio: true,
          mes: true,
          items: {
            where: { productoId: { in: productIds } },
            select: {
              productoId: true,
              precioVentaPromedio: true,
              costoUnitarioPromedio: true,
            },
          },
        },
      })
    : [];
  const priceCostMap = new Map<string, PriceCostValue>();

  priceCostPeriods.forEach((periodo) => {
    periodo.items.forEach((item) => {
      priceCostMap.set(`${periodValue(periodo)}:${item.productoId}`, {
        precioVentaPromedio: item.precioVentaPromedio,
        costoUnitarioPromedio: item.costoUnitarioPromedio,
      });
    });
  });

  const rows = new Map<string, HistoricalReportMonthRow>();
  const totals = {
    unidades: { ...emptyTotals(), total: 0 },
    ventas: { ...emptyTotals(), total: 0 },
    cmv: { ...emptyTotals(), total: 0 },
  };
  let missingPriceCount = 0;
  let missingCostCount = 0;

  periods.forEach((periodo) => {
    rows.set(periodo.value, {
      period: periodo,
      unidades: emptyMetric(),
      ventas: emptyMetric(),
      cmv: emptyMetric(),
      shares: {
        bagazo: null,
        cubiertos: null,
        bolsas: null,
        fibra: null,
        kraft: null,
        servicios: null,
      },
      missingPriceCount: 0,
      missingCostCount: 0,
    });
  });

  ventas.forEach((item) => {
    const material = getReportingMaterial(item.producto);
    const tipoProduccion = item.producto.tipoProduccion === "Externo" ? "Externo" : "Propio";

    if (filters.tipoProduccion !== "all" && filters.tipoProduccion !== tipoProduccion) {
      return;
    }

    if (filters.categoria !== "all" && filters.categoria !== material) {
      return;
    }

    const row = rows.get(periodValue(item.periodo));
    if (!row) return;

    const units = item.unidadesVendidas;
    const production = normalizeProduction(item.producto.tipoProduccion);
    const priceCost = priceCostMap.get(`${periodValue(item.periodo)}:${item.producto.id}`);
    const price = toNumber(priceCost?.precioVentaPromedio);
    const cost = toNumber(priceCost?.costoUnitarioPromedio);
    const missingPrice = units > 0 && price <= 0;
    const missingCost = units > 0 && cost <= 0;
    const sales = missingPrice ? 0 : units * price;
    const cmv = missingCost ? 0 : units * cost;

    addMetric(row.unidades, material, production, units);
    addMetric(row.ventas, material, production, sales);
    addMetric(row.cmv, material, production, cmv);

    totals.unidades[material] += units;
    totals.unidades.total += units;
    totals.ventas[material] += sales;
    totals.ventas.total += sales;
    totals.cmv[material] += cmv;
    totals.cmv.total += cmv;

    if (missingPrice) {
      row.missingPriceCount += 1;
      missingPriceCount += 1;
    }

    if (missingCost) {
      row.missingCostCount += 1;
      missingCostCount += 1;
    }
  });

  const reportRows = periods.map((periodo) => {
    const row = rows.get(periodo.value);

    if (!row) {
      throw new Error(`No se pudo construir el reporte para ${periodo.value}.`);
    }

    return {
      ...row,
      shares: buildShares(row.unidades),
    };
  });

  return {
    periods,
    rows: reportRows,
    totals,
    missingPriceCount,
    missingCostCount,
  };
}

export async function buildHistoricalUnitsReport(filters: HistoricalReportFilters) {
  return buildHistoricalReportData(filters);
}

export async function buildHistoricalSalesReport(filters: HistoricalReportFilters) {
  return buildHistoricalReportData(filters);
}

export async function buildHistoricalCmvReport(filters: HistoricalReportFilters) {
  return buildHistoricalReportData(filters);
}
