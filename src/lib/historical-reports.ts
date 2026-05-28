import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getReportingMaterial,
  reportingMaterialKeys,
  type ReportingMaterial,
} from "@/lib/reporting-categories";

export type HistoricalReportTab =
  | "unidades"
  | "ventas"
  | "cmv"
  | "ganancia-bruta"
  | "graficos-producto";
export type ProductionFilter = "all" | "Propio" | "Externo";
export type CategoryFilter = "all" | ReportingMaterial;
export type GrossProfitLevel = "empresa" | "categorias" | "productos";
export type GrossProfitMetric = "grossProfit" | "grossMarginPct" | "markupPct" | "ventas" | "cmv";
export type GrossProfitQuickFilter =
  | "all"
  | "topProfit"
  | "worstMargin"
  | "negativeMargin"
  | "missingCost"
  | "missingPrice";

export type HistoricalReportFilters = {
  from?: string;
  to?: string;
  tipoProduccion?: ProductionFilter;
  categoria?: CategoryFilter;
  productoId?: number;
  q?: string;
  familiaId?: number;
  tipoProductoVentaId?: number;
  quickFilter?: GrossProfitQuickFilter;
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

export type GrossProfitMetrics = {
  ventas: number;
  cmv: number;
  grossProfit: number;
  grossMarginPct: number | null;
  markupPct: number | null;
};

export type GrossProfitCompanyRow = {
  period: HistoricalReportPeriod;
  metrics: GrossProfitMetrics;
  missingPriceCount: number;
  missingCostCount: number;
};

export type GrossProfitCategoryKey =
  | `${ReportingMaterial}:propio`
  | `${ReportingMaterial}:externo`
  | `${ReportingMaterial}:total`
  | "empresa:total";

export type GrossProfitCategoryRow = {
  period: HistoricalReportPeriod;
  categories: Record<GrossProfitCategoryKey, GrossProfitMetrics>;
  missingPriceCount: number;
  missingCostCount: number;
};

export type GrossProfitProductRow = {
  period: HistoricalReportPeriod;
  productoId: number;
  sku: string;
  producto: string;
  familia: string;
  tipoProductoVenta: string;
  tipoProduccion: "Propio" | "Externo";
  categoria: ReportingMaterial;
  unidades: number;
  metrics: GrossProfitMetrics;
  missingPrice: boolean;
  missingCost: boolean;
};

export type GrossProfitProductReport = {
  rows: GrossProfitProductRow[];
  totals: GrossProfitMetrics;
  missingPriceCount: number;
  missingCostCount: number;
  zeroCmvWithSalesCount: number;
  negativeMarginCount: number;
  extremeMarkupCount: number;
};

export type ProductChartsMonthlyPoint = {
  month: number;
  year: number;
  label: string;
  unidades: number;
  precioPromedio: number | null;
  costoUnitario: number | null;
  ventas: number;
  cmv: number;
  gananciaBruta: number;
  margenBrutoPct: number | null;
  markupPct: number | null;
  spreadUnitario: number | null;
  participacionVentasPct: number | null;
  rankingVentas: number | null;
  rankingGananciaBruta: number | null;
  missingPrice: boolean;
  missingCost: boolean;
};

export type ProductChartsReport = {
  product: {
    id: number;
    sku: string;
    nombre: string;
    familia: string;
    tipoProductoVenta: string;
    tipoProduccion: "Propio" | "Externo";
    categoria: ReportingMaterial;
  } | null;
  kpis: GrossProfitMetrics & {
    unidades: number;
    precioPromedioPonderado: number | null;
    costoPromedioPonderado: number | null;
  };
  monthlySeries: ProductChartsMonthlyPoint[];
  warnings: {
    missingPriceMonths: number;
    missingCostMonths: number;
  };
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

const normalizeProductionLabel = (value: string | null | undefined): "Propio" | "Externo" =>
  value === "Externo" ? "Externo" : "Propio";

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

export function calculateGrossProfitMetrics({
  ventas,
  cmv,
}: {
  ventas: number;
  cmv: number;
}): GrossProfitMetrics {
  const grossProfit = ventas - cmv;

  return {
    ventas,
    cmv,
    grossProfit,
    grossMarginPct: ventas > 0 ? (grossProfit / ventas) * 100 : null,
    markupPct: cmv > 0 ? (grossProfit / cmv) * 100 : null,
  };
}

const grossProfitCategoryKeys = () => [
  ...reportingMaterialKeys.flatMap((material) => [
    `${material}:propio`,
    `${material}:externo`,
    `${material}:total`,
  ]),
  "empresa:total",
] as GrossProfitCategoryKey[];

const emptyGrossProfitCategories = () =>
  Object.fromEntries(
    grossProfitCategoryKeys().map((key) => [
      key,
      calculateGrossProfitMetrics({ ventas: 0, cmv: 0 }),
    ]),
  ) as Record<GrossProfitCategoryKey, GrossProfitMetrics>;

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

export async function buildGrossProfitCompanyReport(
  filters: HistoricalReportFilters,
): Promise<GrossProfitCompanyRow[]> {
  const data = await buildHistoricalReportData(filters);

  return data.rows.map((row) => ({
    period: row.period,
    metrics: calculateGrossProfitMetrics({
      ventas: row.ventas.total,
      cmv: row.cmv.total,
    }),
    missingPriceCount: row.missingPriceCount,
    missingCostCount: row.missingCostCount,
  }));
}

export async function buildGrossProfitCategoryReport(
  filters: HistoricalReportFilters,
): Promise<GrossProfitCategoryRow[]> {
  const data = await buildHistoricalReportData(filters);

  return data.rows.map((row) => {
    const categories = emptyGrossProfitCategories();

    reportingMaterialKeys.forEach((material) => {
      const propioKey = `${material}:propio` as GrossProfitCategoryKey;
      const externoKey = `${material}:externo` as GrossProfitCategoryKey;
      const totalKey = `${material}:total` as GrossProfitCategoryKey;

      categories[propioKey] = calculateGrossProfitMetrics({
        ventas: row.ventas[material].propio,
        cmv: row.cmv[material].propio,
      });
      categories[externoKey] = calculateGrossProfitMetrics({
        ventas: row.ventas[material].externo,
        cmv: row.cmv[material].externo,
      });
      categories[totalKey] = calculateGrossProfitMetrics({
        ventas: row.ventas[material].total,
        cmv: row.cmv[material].total,
      });
    });

    categories["empresa:total"] = calculateGrossProfitMetrics({
      ventas: row.ventas.total,
      cmv: row.cmv.total,
    });

    return {
      period: row.period,
      categories,
      missingPriceCount: row.missingPriceCount,
      missingCostCount: row.missingCostCount,
    };
  });
}

export async function buildGrossProfitProductReport(
  filters: HistoricalReportFilters,
): Promise<GrossProfitProductReport> {
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
      rows: [],
      totals: calculateGrossProfitMetrics({ ventas: 0, cmv: 0 }),
      missingPriceCount: 0,
      missingCostCount: 0,
      zeroCmvWithSalesCount: 0,
      negativeMarginCount: 0,
      extremeMarkupCount: 0,
    };
  }

  const ventas = await prisma.ventaMensualItem.findMany({
    where: {
      periodoId: { in: periodIds },
      ...(filters.productoId ? { productoId: filters.productoId } : {}),
      producto: {
        ...(filters.q
          ? {
              OR: [
                { sku: { contains: filters.q } },
                { nombre: { contains: filters.q } },
              ],
            }
          : {}),
        ...(filters.familiaId ? { familiaId: filters.familiaId } : {}),
        ...(filters.tipoProductoVentaId
          ? { tipoProductoVentaId: filters.tipoProductoVentaId }
          : {}),
      },
    },
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

  const rows: GrossProfitProductRow[] = [];
  let totalVentas = 0;
  let totalCmv = 0;
  let missingPriceCount = 0;
  let missingCostCount = 0;
  let zeroCmvWithSalesCount = 0;
  let negativeMarginCount = 0;
  let extremeMarkupCount = 0;

  ventas.forEach((item) => {
    const categoria = getReportingMaterial(item.producto);
    const tipoProduccion = normalizeProductionLabel(item.producto.tipoProduccion);

    if (filters.tipoProduccion !== "all" && filters.tipoProduccion !== tipoProduccion) {
      return;
    }

    if (filters.categoria !== "all" && filters.categoria !== categoria) {
      return;
    }

    const priceCost = priceCostMap.get(`${periodValue(item.periodo)}:${item.producto.id}`);
    const price = toNumber(priceCost?.precioVentaPromedio);
    const cost = toNumber(priceCost?.costoUnitarioPromedio);
    const missingPrice = item.unidadesVendidas > 0 && price <= 0;
    const missingCost = item.unidadesVendidas > 0 && cost <= 0;
    const ventasValue = missingPrice ? 0 : item.unidadesVendidas * price;
    const cmvValue = missingCost ? 0 : item.unidadesVendidas * cost;
    const metrics = calculateGrossProfitMetrics({
      ventas: ventasValue,
      cmv: cmvValue,
    });

    if (filters.quickFilter === "negativeMargin" && metrics.grossProfit >= 0) return;
    if (filters.quickFilter === "missingCost" && !missingCost) return;
    if (filters.quickFilter === "missingPrice" && !missingPrice) return;

    totalVentas += ventasValue;
    totalCmv += cmvValue;

    if (missingPrice) missingPriceCount += 1;
    if (missingCost) missingCostCount += 1;
    if (ventasValue > 0 && cmvValue === 0) zeroCmvWithSalesCount += 1;
    if (metrics.grossProfit < 0) negativeMarginCount += 1;
    if (metrics.markupPct !== null && Math.abs(metrics.markupPct) > 500) {
      extremeMarkupCount += 1;
    }

    rows.push({
      period: { ...item.periodo, value: periodValue(item.periodo) },
      productoId: item.producto.id,
      sku: item.producto.sku,
      producto: item.producto.nombre,
      familia: item.producto.familia.nombre,
      tipoProductoVenta: item.producto.tipoProductoVenta.nombre,
      tipoProduccion,
      categoria,
      unidades: item.unidadesVendidas,
      metrics,
      missingPrice,
      missingCost,
    });
  });

  rows.sort((a, b) => {
    if (filters.quickFilter === "worstMargin") {
      return (a.metrics.grossMarginPct ?? Number.POSITIVE_INFINITY) -
        (b.metrics.grossMarginPct ?? Number.POSITIVE_INFINITY);
    }

    const periodDiff = periodSerial(b.period) - periodSerial(a.period);
    if (periodDiff !== 0) return periodDiff;

    return b.metrics.grossProfit - a.metrics.grossProfit;
  });

  if (filters.quickFilter === "topProfit") {
    rows.sort((a, b) => b.metrics.grossProfit - a.metrics.grossProfit);
  }

  return {
    rows,
    totals: calculateGrossProfitMetrics({ ventas: totalVentas, cmv: totalCmv }),
    missingPriceCount,
    missingCostCount,
    zeroCmvWithSalesCount,
    negativeMarginCount,
    extremeMarkupCount,
  };
}

export async function buildProductChartsReport(
  productId: number | null | undefined,
  filters: Pick<HistoricalReportFilters, "from" | "to">,
): Promise<ProductChartsReport> {
  const emptyReport = (product: ProductChartsReport["product"] = null): ProductChartsReport => ({
    product,
    kpis: {
      ...calculateGrossProfitMetrics({ ventas: 0, cmv: 0 }),
      unidades: 0,
      precioPromedioPonderado: null,
      costoPromedioPonderado: null,
    },
    monthlySeries: [],
    warnings: {
      missingPriceMonths: 0,
      missingCostMonths: 0,
    },
  });

  if (!productId) return emptyReport();

  const product = await prisma.producto.findUnique({
    where: { id: productId },
    select: {
      id: true,
      sku: true,
      nombre: true,
      tipoProduccion: true,
      familia: { select: { nombre: true } },
      tipoProductoVenta: { select: { nombre: true } },
    },
  });

  if (!product) return emptyReport();

  const productSummary: NonNullable<ProductChartsReport["product"]> = {
    id: product.id,
    sku: product.sku,
    nombre: product.nombre,
    familia: product.familia.nombre,
    tipoProductoVenta: product.tipoProductoVenta.nombre,
    tipoProduccion: normalizeProductionLabel(product.tipoProduccion),
    categoria: getReportingMaterial(product),
  };
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

  if (!periodIds.length) return emptyReport(productSummary);

  const salesItems = await prisma.ventaMensualItem.findMany({
    where: { periodoId: { in: periodIds } },
    select: {
      productoId: true,
      unidadesVendidas: true,
      periodo: { select: { id: true, anio: true, mes: true } },
    },
  });
  const productIds = [...new Set(salesItems.map((item) => item.productoId))];
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

  const monthlyProductMetrics = new Map<
    string,
    Map<number, { ventas: number; cmv: number; gananciaBruta: number }>
  >();
  const selectedUnits = new Map<string, number>();
  let totalUnits = 0;
  let totalSales = 0;
  let totalCmv = 0;
  let missingPriceMonths = 0;
  let missingCostMonths = 0;

  salesItems.forEach((item) => {
    const key = periodValue(item.periodo);
    const priceCost = priceCostMap.get(`${key}:${item.productoId}`);
    const price = toNumber(priceCost?.precioVentaPromedio);
    const cost = toNumber(priceCost?.costoUnitarioPromedio);
    const missingPrice = item.unidadesVendidas > 0 && price <= 0;
    const missingCost = item.unidadesVendidas > 0 && cost <= 0;
    const ventas = missingPrice ? 0 : item.unidadesVendidas * price;
    const cmv = missingCost ? 0 : item.unidadesVendidas * cost;
    const byProduct = monthlyProductMetrics.get(key) ?? new Map();

    byProduct.set(item.productoId, {
      ventas: (byProduct.get(item.productoId)?.ventas ?? 0) + ventas,
      cmv: (byProduct.get(item.productoId)?.cmv ?? 0) + cmv,
      gananciaBruta:
        (byProduct.get(item.productoId)?.gananciaBruta ?? 0) + ventas - cmv,
    });
    monthlyProductMetrics.set(key, byProduct);

    if (item.productoId === productId) {
      selectedUnits.set(key, (selectedUnits.get(key) ?? 0) + item.unidadesVendidas);
      totalUnits += item.unidadesVendidas;
      totalSales += ventas;
      totalCmv += cmv;
      if (missingPrice) missingPriceMonths += 1;
      if (missingCost) missingCostMonths += 1;
    }
  });

  const monthlySeries = periods.map((periodo) => {
    const key = periodValue(periodo);
    const units = selectedUnits.get(key) ?? 0;
    const priceCost = priceCostMap.get(`${key}:${productId}`);
    const price = toNumber(priceCost?.precioVentaPromedio);
    const cost = toNumber(priceCost?.costoUnitarioPromedio);
    const missingPrice = units > 0 && price <= 0;
    const missingCost = units > 0 && cost <= 0;
    const ventas = missingPrice ? 0 : units * price;
    const cmv = missingCost ? 0 : units * cost;
    const metrics = calculateGrossProfitMetrics({ ventas, cmv });
    const byProduct = monthlyProductMetrics.get(key) ?? new Map();
    const monthlyTotalSales = [...byProduct.values()].reduce(
      (sum, item) => sum + item.ventas,
      0,
    );
    const salesRanking = [...byProduct.entries()]
      .sort((a, b) => b[1].ventas - a[1].ventas)
      .findIndex(([id]) => id === productId);
    const grossRanking = [...byProduct.entries()]
      .sort((a, b) => b[1].gananciaBruta - a[1].gananciaBruta)
      .findIndex(([id]) => id === productId);

    return {
      month: periodo.mes,
      year: periodo.anio,
      label: periodValue(periodo),
      unidades: units,
      precioPromedio: missingPrice || units === 0 ? null : price,
      costoUnitario: missingCost || units === 0 ? null : cost,
      ventas,
      cmv,
      gananciaBruta: metrics.grossProfit,
      margenBrutoPct: metrics.grossMarginPct,
      markupPct: metrics.markupPct,
      spreadUnitario:
        missingPrice || missingCost || units === 0 ? null : price - cost,
      participacionVentasPct:
        monthlyTotalSales > 0 ? (ventas / monthlyTotalSales) * 100 : null,
      rankingVentas: salesRanking >= 0 ? salesRanking + 1 : null,
      rankingGananciaBruta: grossRanking >= 0 ? grossRanking + 1 : null,
      missingPrice,
      missingCost,
    } satisfies ProductChartsMonthlyPoint;
  });

  return {
    product: productSummary,
    kpis: {
      ...calculateGrossProfitMetrics({ ventas: totalSales, cmv: totalCmv }),
      unidades: totalUnits,
      precioPromedioPonderado: totalUnits > 0 ? totalSales / totalUnits : null,
      costoPromedioPonderado: totalUnits > 0 ? totalCmv / totalUnits : null,
    },
    monthlySeries,
    warnings: {
      missingPriceMonths,
      missingCostMonths,
    },
  };
}
