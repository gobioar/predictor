import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateGrossProfitMetrics, type CategoryFilter, type ProductionFilter } from "@/lib/historical-reports";
import {
  getReportingMaterial,
  reportingMaterialKeys,
  reportingMaterialLabels,
  type ReportingMaterial,
  type ReportingProductInput,
} from "@/lib/reporting-categories";

export type AnalyticsView = "productos" | "lineas" | "materiales" | "produccion";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  material?: CategoryFilter;
  line?: string;
  tipoProduccion?: ProductionFilter;
  productoId?: number;
};

export type AnalyticsGroup = {
  key: string;
  label: string;
  color: string;
};

export type AnalyticsKpis = {
  unidades: number;
  ventas: number;
  cmv: number;
  grossProfit: number;
  grossMarginPct: number | null;
  markupPct: number | null;
  participationPct: number | null;
};

export type AnalyticsRankingRow = AnalyticsKpis & {
  key: string;
  label: string;
};

export type AnalyticsMonthlyPoint = {
  label: string;
  year: number;
  month: number;
  totals: AnalyticsKpis;
  values: Record<
    string,
    AnalyticsKpis & {
      cumulativeGrossProfit: number;
    }
  >;
};

export type HistoricalAnalyticsReport = {
  groups: AnalyticsGroup[];
  kpis: AnalyticsKpis;
  monthlySeries: AnalyticsMonthlyPoint[];
  rankings: AnalyticsRankingRow[];
  participation: Array<{ key: string; label: string; value: number; color: string }>;
  warnings: {
    missingPriceCount: number;
    missingCostCount: number;
  };
};

type PriceCostValue = {
  precioVentaPromedio: Prisma.Decimal;
  costoUnitarioPromedio: Prisma.Decimal;
};

type SourceRow = {
  period: { anio: number; mes: number; value: string };
  productId: number;
  product: ReportingProductInput & {
    id: number;
    tipoProduccion: string;
  };
  line: string;
  material: ReportingMaterial;
  production: "Propio" | "Externo";
  unidades: number;
  ventas: number;
  cmv: number;
  missingPrice: boolean;
  missingCost: boolean;
};

const materialColors: Record<ReportingMaterial, string> = {
  bagazo: "#7cbf81",
  madera: "#c8a477",
  bioplastico: "#32aa93",
  fibra: "#9bc8a5",
  kraft: "#d6bf8d",
  pet: "#9ecae6",
  servicios: "#a8b0ba",
  extras: "#667387",
};

const palette = [
  "#32aa93",
  "#7cbf81",
  "#9ecae6",
  "#d6bf8d",
  "#c8a477",
  "#9bc8a5",
  "#cad2dd",
  "#667387",
  "#b7a4d8",
  "#8eb8c9",
];

const productionGroups: AnalyticsGroup[] = [
  { key: "propio", label: "Propio", color: "#32aa93" },
  { key: "externo", label: "Externo", color: "#9ecae6" },
];

const periodValue = (periodo: { anio: number; mes: number }) =>
  `${periodo.anio}-${String(periodo.mes).padStart(2, "0")}`;

const periodSerial = (periodo: { anio: number; mes: number }) =>
  periodo.anio * 12 + periodo.mes;

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function getProductLine(producto: ReportingProductInput) {
  const text = normalizeText(`${producto.sku} ${producto.nombre} ${producto.tipoProductoVenta?.nombre ?? ""} ${producto.familia?.nombre ?? ""}`);

  if (text.includes("bowl")) return "Bowls";
  if (text.includes("bandeja")) return "Bandejas";
  if (text.includes("plato")) return "Platos";
  if (text.includes("vaso")) return "Vasos";
  if (text.includes("tapa")) return "Tapas";
  if (text.includes("bolsa")) return "Bolsas";
  if (text.includes("cuchara") || text.includes("cuchillo") || text.includes("tenedor") || text.includes("cubierto")) return "Cubiertos";
  if (text.includes("sorbete")) return "Sorbetes";
  if (text.includes("portavaso") || text.includes("collarin")) return "Portavasos";
  if (text.includes("servicio") || text.includes("envio") || text.includes("impresion")) return "Servicios";
  if (text.includes("kraft")) return "Kraft";

  return producto.tipoProductoVenta?.nombre ?? producto.familia?.nombre ?? "Extras";
}

export async function getHistoricalAnalyticsLineOptions() {
  const productos = await prisma.producto.findMany({
    select: {
      sku: true,
      nombre: true,
      familia: { select: { nombre: true } },
      tipoProductoVenta: { select: { nombre: true } },
    },
  });

  return [...new Set(productos.map(getProductLine))].sort((a, b) => a.localeCompare(b, "es-AR"));
}

async function buildSourceRows(filters: AnalyticsFilters): Promise<SourceRow[]> {
  const periodos = await prisma.ventaMensualPeriodo.findMany({
    orderBy: [{ anio: "asc" }, { mes: "asc" }],
    select: { id: true, anio: true, mes: true },
  });
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
  const selectedPeriods = periodos.filter((periodo) => {
    const serial = periodSerial(periodo);
    return serial >= fromSerial && serial <= toSerial;
  });
  const periodIds = selectedPeriods.map((periodo) => periodo.id);

  if (!periodIds.length) return [];

  const salesItems = await prisma.ventaMensualItem.findMany({
    where: {
      periodoId: { in: periodIds },
      ...(filters.productoId ? { productoId: filters.productoId } : {}),
    },
    select: {
      productoId: true,
      unidadesVendidas: true,
      periodo: { select: { anio: true, mes: true } },
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
  const productIds = [...new Set(salesItems.map((item) => item.productoId))];
  const priceCostPeriods = productIds.length
    ? await prisma.precioCostoMensualPeriodo.findMany({
        where: {
          OR: selectedPeriods.map((periodo) => ({ anio: periodo.anio, mes: periodo.mes })),
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

  return salesItems.flatMap((item) => {
    const material = getReportingMaterial(item.producto);
    const production = item.producto.tipoProduccion === "Externo" ? "Externo" : "Propio";
    const line = getProductLine(item.producto);

    if (filters.material && filters.material !== "all" && filters.material !== material) return [];
    if (filters.line && filters.line !== "all" && filters.line !== line) return [];
    if (filters.tipoProduccion && filters.tipoProduccion !== "all" && filters.tipoProduccion !== production) return [];

    const key = `${periodValue(item.periodo)}:${item.productoId}`;
    const priceCost = priceCostMap.get(key);
    const price = toNumber(priceCost?.precioVentaPromedio);
    const cost = toNumber(priceCost?.costoUnitarioPromedio);
    const missingPrice = item.unidadesVendidas > 0 && price <= 0;
    const missingCost = item.unidadesVendidas > 0 && cost <= 0;
    const ventas = missingPrice ? 0 : item.unidadesVendidas * price;
    const cmv = missingCost ? 0 : item.unidadesVendidas * cost;

    return {
      period: {
        ...item.periodo,
        value: periodValue(item.periodo),
      },
      productId: item.productoId,
      product: item.producto,
      line,
      material,
      production,
      unidades: item.unidadesVendidas,
      ventas,
      cmv,
      missingPrice,
      missingCost,
    };
  });
}

const makeKpis = (unidades: number, ventas: number, cmv: number, allSales: number): AnalyticsKpis => ({
  unidades,
  ...calculateGrossProfitMetrics({ ventas, cmv }),
  participationPct: allSales > 0 ? (ventas / allSales) * 100 : null,
});

function aggregateRows(
  rows: SourceRow[],
  groups: AnalyticsGroup[],
  groupForRow: (row: SourceRow) => string,
): HistoricalAnalyticsReport {
  const periodMap = new Map<string, AnalyticsMonthlyPoint>();
  const rankingTotals = new Map<string, { unidades: number; ventas: number; cmv: number }>();
  const cumulativeGross = new Map<string, number>();
  let totalUnits = 0;
  let totalSales = 0;
  let totalCmv = 0;
  let missingPriceCount = 0;
  let missingCostCount = 0;

  rows.forEach((row) => {
    const period = periodMap.get(row.period.value) ?? {
      label: row.period.value,
      year: row.period.anio,
      month: row.period.mes,
      totals: makeKpis(0, 0, 0, 0),
      values: {},
    };
    const groupKey = groupForRow(row);
    const current = period.values[groupKey] ?? {
      ...makeKpis(0, 0, 0, 0),
      cumulativeGrossProfit: 0,
    };
    const total = rankingTotals.get(groupKey) ?? { unidades: 0, ventas: 0, cmv: 0 };

    period.values[groupKey] = {
      ...current,
      unidades: current.unidades + row.unidades,
      ventas: current.ventas + row.ventas,
      cmv: current.cmv + row.cmv,
    };
    rankingTotals.set(groupKey, {
      unidades: total.unidades + row.unidades,
      ventas: total.ventas + row.ventas,
      cmv: total.cmv + row.cmv,
    });
    totalUnits += row.unidades;
    totalSales += row.ventas;
    totalCmv += row.cmv;
    if (row.missingPrice) missingPriceCount += 1;
    if (row.missingCost) missingCostCount += 1;
    periodMap.set(row.period.value, period);
  });

  const monthlySeries = [...periodMap.values()].sort(
    (a, b) => a.year * 12 + a.month - (b.year * 12 + b.month),
  );

  monthlySeries.forEach((point) => {
    const pointSales = Object.values(point.values).reduce((sum, item) => sum + item.ventas, 0);
    const pointCmv = Object.values(point.values).reduce((sum, item) => sum + item.cmv, 0);
    const pointUnits = Object.values(point.values).reduce((sum, item) => sum + item.unidades, 0);

    point.totals = makeKpis(pointUnits, pointSales, pointCmv, pointSales);

    groups.forEach((group) => {
      const value = point.values[group.key] ?? {
        ...makeKpis(0, 0, 0, pointSales),
        cumulativeGrossProfit: 0,
      };
      const metrics = makeKpis(value.unidades, value.ventas, value.cmv, pointSales);
      const nextCumulative = (cumulativeGross.get(group.key) ?? 0) + metrics.grossProfit;

      cumulativeGross.set(group.key, nextCumulative);
      point.values[group.key] = {
        ...metrics,
        cumulativeGrossProfit: nextCumulative,
      };
    });
  });

  const rankings = groups
    .map((group) => {
      const total = rankingTotals.get(group.key) ?? { unidades: 0, ventas: 0, cmv: 0 };
      return {
        key: group.key,
        label: group.label,
        ...makeKpis(total.unidades, total.ventas, total.cmv, totalSales),
      };
    })
    .sort((a, b) => b.grossProfit - a.grossProfit);

  return {
    groups,
    kpis: makeKpis(totalUnits, totalSales, totalCmv, totalSales),
    monthlySeries,
    rankings,
    participation: rankings.map((item) => ({
      key: item.key,
      label: item.label,
      value: item.ventas,
      color: groups.find((group) => group.key === item.key)?.color ?? "#cad2dd",
    })),
    warnings: {
      missingPriceCount,
      missingCostCount,
    },
  };
}

export async function buildLineAnalytics(filters: AnalyticsFilters = {}) {
  const rows = await buildSourceRows(filters);
  const lineLabels = [...new Set(rows.map((row) => row.line))].sort((a, b) =>
    a.localeCompare(b, "es-AR"),
  );
  const groups = lineLabels.map((label, index) => ({
    key: label,
    label,
    color: palette[index % palette.length],
  }));

  return aggregateRows(rows, groups, (row) => row.line);
}

export async function buildMaterialAnalytics(filters: AnalyticsFilters = {}) {
  const rows = await buildSourceRows(filters);
  const groups = reportingMaterialKeys.map((material) => ({
    key: material,
    label: reportingMaterialLabels[material],
    color: materialColors[material],
  }));

  return aggregateRows(rows, groups, (row) => row.material);
}

export async function buildProductionAnalytics(filters: AnalyticsFilters = {}) {
  const rows = await buildSourceRows(filters);

  return aggregateRows(rows, productionGroups, (row) =>
    row.production === "Externo" ? "externo" : "propio",
  );
}
