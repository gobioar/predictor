import { AlertTriangle, Filter, X } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { requireAuth } from "@/lib/auth";
import {
  buildLineAnalytics,
  buildMaterialAnalytics,
  buildProductionAnalytics,
  getHistoricalAnalyticsLineOptions,
  type AnalyticsView,
  type HistoricalAnalyticsReport,
} from "@/lib/historical-analytics";
import {
  buildGrossProfitCategoryReport,
  buildGrossProfitCompanyReport,
  buildGrossProfitProductReport,
  buildHistoricalReportData,
  buildProductChartsReport,
  calculateGrossProfitMetrics,
  getHistoricalReportPeriods,
  type CategoryFilter,
  type GrossProfitCategoryKey,
  type GrossProfitCategoryRow,
  type GrossProfitLevel,
  type GrossProfitMetric,
  type GrossProfitProductReport,
  type GrossProfitProductRow,
  type GrossProfitQuickFilter,
  type HistoricalReportMonthRow,
  type HistoricalReportTab,
  type ProductChartsReport,
  type ProductionFilter,
} from "@/lib/historical-reports";
import { prisma } from "@/lib/prisma";
import {
  getReportingMaterial,
  reportingMaterialKeys,
  reportingMaterialLabels,
  type ReportingMaterial,
} from "@/lib/reporting-categories";
import { formatMonth } from "@/lib/utils";
import {
  GrossProfitCompanyCharts,
  GrossProfitRankingChart,
  AnalyticsLinesCharts,
  AnalyticsMaterialsCharts,
  AnalyticsProductionCharts,
  ProductChartsGrid,
  type CompanyChartPoint,
  type ProductChartPoint,
} from "./GrossProfitCharts";
import { ReportExportButtons } from "./ReportExportButtons";

const tabs: Array<{ value: HistoricalReportTab; label: string }> = [
  { value: "unidades", label: "Unidades" },
  { value: "ventas", label: "Ventas" },
  { value: "cmv", label: "CMV" },
  { value: "ganancia-bruta", label: "Ganancia Bruta" },
  { value: "graficos-producto", label: "Gráficos por Producto" },
];

const grossProfitLevels: Array<{ value: GrossProfitLevel; label: string }> = [
  { value: "empresa", label: "Empresa" },
  { value: "categorias", label: "Categorías" },
  { value: "productos", label: "Productos" },
];

const grossProfitMetrics: Array<{ value: GrossProfitMetric; label: string }> = [
  { value: "grossProfit", label: "Ganancia Bruta" },
  { value: "grossMarginPct", label: "Margen Bruto %" },
  { value: "markupPct", label: "Markup %" },
  { value: "ventas", label: "Ventas" },
  { value: "cmv", label: "CMV" },
];

const quickFilters: Array<{ value: GrossProfitQuickFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "topProfit", label: "Top ganancia" },
  { value: "worstMargin", label: "Peor margen" },
  { value: "negativeMargin", label: "Margen negativo" },
  { value: "missingCost", label: "Sin costo" },
  { value: "missingPrice", label: "Sin precio" },
];

const analyticsViews: Array<{ value: AnalyticsView; label: string }> = [
  { value: "productos", label: "Productos" },
  { value: "lineas", label: "Líneas" },
  { value: "materiales", label: "Materiales" },
  { value: "produccion", label: "Producción" },
];

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "Todas" },
  ...reportingMaterialKeys.map((key) => ({
    value: key,
    label: reportingMaterialLabels[key],
  })),
];

type ReportColumn = {
  key: string;
  label: string;
  kind: "units" | "money" | "percent";
  total?: boolean;
  value: (row: HistoricalReportMonthRow) => number | null;
};

const isTab = (value?: string): value is HistoricalReportTab =>
  tabs.some((tab) => tab.value === value);

const isProductionFilter = (value?: string): value is ProductionFilter =>
  value === "all" || value === "Propio" || value === "Externo";

const isCategoryFilter = (value?: string): value is CategoryFilter =>
  value === "all" || reportingMaterialKeys.includes(value as ReportingMaterial);

const isGrossProfitLevel = (value?: string): value is GrossProfitLevel =>
  grossProfitLevels.some((level) => level.value === value);

const isGrossProfitMetric = (value?: string): value is GrossProfitMetric =>
  grossProfitMetrics.some((metric) => metric.value === value);

const isQuickFilter = (value?: string): value is GrossProfitQuickFilter =>
  quickFilters.some((filter) => filter.value === value);

const isAnalyticsView = (value?: string): value is AnalyticsView =>
  analyticsViews.some((view) => view.value === value);

const numberFormat = (value: number) => Math.round(value).toLocaleString("es-AR");
const moneyFormat = (value: number) =>
  `$ ${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
const percentFormat = (value: number | null) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "Sin datos";
const monthLabel = (anio: number, mes: number) => {
  const label = formatMonth(anio, mes);
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const formatCell = (value: number | null, kind: ReportColumn["kind"]) => {
  if (kind === "percent") return percentFormat(value);
  if (typeof value !== "number") return "Sin datos";
  if (kind === "money") return moneyFormat(value);

  return numberFormat(value);
};

const formatGrossMetric = (value: number | null, metric: GrossProfitMetric) => {
  if (metric === "grossMarginPct" || metric === "markupPct") return percentFormat(value);
  if (typeof value !== "number") return "Sin datos";

  return moneyFormat(value);
};

const metricValue = (
  metrics: ReturnType<typeof calculateGrossProfitMetrics>,
  metric: GrossProfitMetric,
) => metrics[metric];

const signedClass = (value: number | null) => {
  if (typeof value !== "number") return "text-neutral-400";
  if (value < 0) return "text-red-300";
  if (value > 0) return "text-emerald-100";
  return "text-neutral-200";
};

const categoryKeyLabel = (key: GrossProfitCategoryKey) => {
  if (key === "empresa:total") return "Empresa Total";
  const [material, production] = key.split(":") as [ReportingMaterial, string];
  const productionLabel =
    production === "propio" ? "Propio" : production === "externo" ? "Externo" : "Total";

  return `${reportingMaterialLabels[material]} ${productionLabel}`;
};

const categoryKeys: GrossProfitCategoryKey[] = [
  ...reportingMaterialKeys.flatMap((material) => [
    `${material}:propio` as GrossProfitCategoryKey,
    `${material}:externo` as GrossProfitCategoryKey,
    `${material}:total` as GrossProfitCategoryKey,
  ]),
  "empresa:total",
];

const metricColumns = (
  prefix: "Unidades" | "Ventas" | "CMV",
  metric: "unidades" | "ventas" | "cmv",
  kind: "units" | "money",
): ReportColumn[] => [
  ...reportingMaterialKeys.flatMap((material) => {
    const label = reportingMaterialLabels[material];

    return [
      {
        key: `${metric}-${material}-propias`,
        label: `${prefix} ${label} Propias`,
        kind,
        value: (row) => row[metric][material].propio,
      },
      {
        key: `${metric}-${material}-externas`,
        label: `${prefix} ${label} Externas`,
        kind,
        value: (row) => row[metric][material].externo,
      },
      {
        key: `${metric}-${material}-totales`,
        label: `${prefix} ${label} Totales`,
        kind,
        total: true,
        value: (row) => row[metric][material].total,
      },
    ] satisfies ReportColumn[];
  }),
  {
    key: `${metric}-total`,
    label: `${prefix} Totales`,
    kind,
    total: true,
    value: (row) => row[metric].total,
  },
];

const unitsColumns: ReportColumn[] = [
  ...metricColumns("Unidades", "unidades", "units"),
  {
    key: "share-bagazo",
    label: "Unidades Media Bagazo Sobre Total",
    kind: "percent",
    value: (row) => row.shares.bagazo,
  },
  {
    key: "share-cubiertos",
    label: "Unidades Media Cubiertos Sobre Total",
    kind: "percent",
    value: (row) => row.shares.cubiertos,
  },
  {
    key: "share-bolsas",
    label: "Unidades Media Bolsas Sobre Total",
    kind: "percent",
    value: (row) => row.shares.bolsas,
  },
  {
    key: "share-fibra",
    label: "Unidades Media Fibra Sobre Total",
    kind: "percent",
    value: (row) => row.shares.fibra,
  },
  {
    key: "share-kraft",
    label: "Unidades Media Kraft Sobre Total",
    kind: "percent",
    value: (row) => row.shares.kraft,
  },
  {
    key: "share-servicios",
    label: "Unidades Media Servicios Sobre Total",
    kind: "percent",
    value: (row) => row.shares.servicios,
  },
];

const columnsByTab: Record<
  Exclude<HistoricalReportTab, "ganancia-bruta" | "graficos-producto">,
  ReportColumn[]
> = {
  unidades: unitsColumns,
  ventas: metricColumns("Ventas", "ventas", "money"),
  cmv: metricColumns("CMV", "cmv", "money"),
};

const kpiForTab = (
  tab: HistoricalReportTab,
  data: Awaited<ReturnType<typeof buildHistoricalReportData>>,
) => {
  if (tab === "unidades") {
    const total = data.totals.unidades.total;
    const share = (material: ReportingMaterial) =>
      total > 0 ? (data.totals.unidades[material] / total) * 100 : null;

    return [
      { label: "Unidades totales", value: numberFormat(total) },
      { label: "% Bagazo", value: percentFormat(share("bagazo")) },
      { label: "% Madera/Cubiertos", value: percentFormat(share("madera")) },
      { label: "% Bolsas/Bioplástico", value: percentFormat(share("bioplastico")) },
      { label: "% Fibra", value: percentFormat(share("fibra")) },
      { label: "% Kraft", value: percentFormat(share("kraft")) },
    ];
  }

  if (tab === "ventas") {
    return [
      { label: "Ventas totales", value: moneyFormat(data.totals.ventas.total) },
      { label: "Ventas Bagazo", value: moneyFormat(data.totals.ventas.bagazo) },
      { label: "Ventas Madera", value: moneyFormat(data.totals.ventas.madera) },
      { label: "Ventas Bioplástico", value: moneyFormat(data.totals.ventas.bioplastico) },
      { label: "Ventas Fibra", value: moneyFormat(data.totals.ventas.fibra) },
      { label: "Ventas Kraft", value: moneyFormat(data.totals.ventas.kraft) },
    ];
  }

  return [
    { label: "CMV total", value: moneyFormat(data.totals.cmv.total) },
    { label: "CMV Bagazo", value: moneyFormat(data.totals.cmv.bagazo) },
    { label: "CMV Madera", value: moneyFormat(data.totals.cmv.madera) },
    { label: "CMV Bioplástico", value: moneyFormat(data.totals.cmv.bioplastico) },
    { label: "CMV Fibra", value: moneyFormat(data.totals.cmv.fibra) },
    { label: "CMV Kraft", value: moneyFormat(data.totals.cmv.kraft) },
  ];
};

export default async function ReportesHistoricosPage({
  searchParams,
}: {
  searchParams?: Promise<{
    tab?: string;
    from?: string;
    to?: string;
    tipoProduccion?: string;
    categoria?: string;
    nivel?: string;
    metrica?: string;
    productoId?: string;
    q?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
    filtroRapido?: string;
    vista?: string;
    linea?: string;
  }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const selectedTab: HistoricalReportTab = isTab(params?.tab) ? params.tab : "unidades";
  const grossProfitLevel: GrossProfitLevel = isGrossProfitLevel(params?.nivel)
    ? params.nivel
    : "empresa";
  const grossProfitMetric: GrossProfitMetric = isGrossProfitMetric(params?.metrica)
    ? params.metrica
    : "grossProfit";
  const quickFilter: GrossProfitQuickFilter = isQuickFilter(params?.filtroRapido)
    ? params.filtroRapido
    : "all";
  const analyticsView: AnalyticsView = isAnalyticsView(params?.vista)
    ? params.vista
    : "productos";
  const filters = {
    from: params?.from ?? "",
    to: params?.to ?? "",
    tipoProduccion: isProductionFilter(params?.tipoProduccion)
      ? params.tipoProduccion
      : "all",
    categoria: isCategoryFilter(params?.categoria) ? params.categoria : "all",
    productoId: params?.productoId ?? "",
    q: params?.q?.trim() ?? "",
    familiaId: params?.familiaId ?? "",
    tipoProductoVentaId: params?.tipoProductoVentaId ?? "",
    filtroRapido: quickFilter,
    linea: params?.linea ?? "all",
  };
  const reportFilters = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    tipoProduccion: filters.tipoProduccion,
    categoria: filters.categoria,
    productoId: filters.productoId ? Number(filters.productoId) : undefined,
    q: filters.q || undefined,
    familiaId: filters.familiaId ? Number(filters.familiaId) : undefined,
    tipoProductoVentaId: filters.tipoProductoVentaId
      ? Number(filters.tipoProductoVentaId)
      : undefined,
    quickFilter,
  };
  const analyticsFilters = {
    from: reportFilters.from,
    to: reportFilters.to,
    material: reportFilters.categoria,
    line: filters.linea,
    tipoProduccion: reportFilters.tipoProduccion,
    productoId: reportFilters.productoId,
  };
  const [
    allPeriods,
    data,
    grossCompanyRows,
    grossCategoryRows,
    grossProductReport,
    productChartsReport,
    lineAnalytics,
    materialAnalytics,
    productionAnalytics,
    lineOptions,
    productOptions,
    familyOptions,
    typeOptions,
  ] = await Promise.all([
    getHistoricalReportPeriods(),
    buildHistoricalReportData(reportFilters),
    buildGrossProfitCompanyReport(reportFilters),
    buildGrossProfitCategoryReport(reportFilters),
    buildGrossProfitProductReport(reportFilters),
    buildProductChartsReport(reportFilters.productoId, reportFilters),
    buildLineAnalytics(analyticsFilters),
    buildMaterialAnalytics(analyticsFilters),
    buildProductionAnalytics(analyticsFilters),
    getHistoricalAnalyticsLineOptions(),
    prisma.producto.findMany({
      orderBy: { nombre: "asc" },
      include: { familia: true, tipoProductoVenta: true },
    }),
    prisma.familiaProducto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.tipoProductoVenta.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  const columns =
    selectedTab === "ganancia-bruta" || selectedTab === "graficos-producto"
      ? []
      : columnsByTab[selectedTab];
  const kpis = kpiForTab(selectedTab, data);
  const queryFor = (overrides: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const next = {
      ...filters,
      tab: selectedTab,
      nivel: grossProfitLevel,
      metrica: grossProfitMetric,
      vista: analyticsView,
      ...overrides,
    };

    Object.entries(next).forEach(([key, value]) => {
      if (value && value !== "all") search.set(key, value);
    });

    return `/reportes-historicos?${search.toString()}`;
  };
  const exportRows = data.rows.map((row) => ({
    Mes: monthLabel(row.period.anio, row.period.mes),
    ...Object.fromEntries(
      columns.map((column) => [
        column.label,
        formatCell(column.value(row), column.kind),
      ]),
    ),
  }));
  const grossTotals = calculateGrossProfitMetrics({
    ventas: data.totals.ventas.total,
    cmv: data.totals.cmv.total,
  });
  const grossWarnings = {
    missingPriceCount:
      grossProfitLevel === "productos"
        ? grossProductReport.missingPriceCount
        : data.missingPriceCount,
    missingCostCount:
      grossProfitLevel === "productos"
        ? grossProductReport.missingCostCount
        : data.missingCostCount,
    zeroCmvWithSalesCount: grossProductReport.zeroCmvWithSalesCount,
    negativeMarginCount:
      grossProfitLevel === "productos"
        ? grossProductReport.negativeMarginCount
        : grossCompanyRows.filter((row) => row.metrics.grossProfit < 0).length,
    extremeMarkupCount: grossProductReport.extremeMarkupCount,
  };
  const companyChartData: CompanyChartPoint[] = grossCompanyRows.map((row) => ({
    mes: monthLabel(row.period.anio, row.period.mes),
    gananciaBruta: row.metrics.grossProfit,
    margenBrutoPct: row.metrics.grossMarginPct,
    ventas: row.metrics.ventas,
    cmv: row.metrics.cmv,
  }));
  const categoryRanking = categoryKeys
    .filter((key) => key.endsWith(":total") && key !== "empresa:total")
    .map((key) => ({
      name: categoryKeyLabel(key),
      value: grossCategoryRows.reduce(
        (sum, row) => sum + row.categories[key].grossProfit,
        0,
      ),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const topProducts = [...grossProductReport.rows]
    .sort((a, b) => b.metrics.grossProfit - a.metrics.grossProfit)
    .slice(0, 10);
  const bottomMarginProducts = grossProductReport.rows
    .filter((row) => row.metrics.grossMarginPct !== null)
    .sort((a, b) => (a.metrics.grossMarginPct ?? 0) - (b.metrics.grossMarginPct ?? 0))
    .slice(0, 10);
  const filteredProductOptions = productOptions.filter((producto) => {
    const query = filters.q.toLowerCase();
    const matchesQuery =
      !query ||
      producto.sku.toLowerCase().includes(query) ||
      producto.nombre.toLowerCase().includes(query);
    const matchesFamily =
      !filters.familiaId || producto.familiaId === Number(filters.familiaId);
    const matchesType =
      !filters.tipoProductoVentaId ||
      producto.tipoProductoVentaId === Number(filters.tipoProductoVentaId);
    const matchesProduction =
      filters.tipoProduccion === "all" ||
      producto.tipoProduccion === filters.tipoProduccion;
    const matchesCategory =
      filters.categoria === "all" ||
      getReportingMaterial(producto) === filters.categoria;

    return (
      matchesQuery &&
      matchesFamily &&
      matchesType &&
      matchesProduction &&
      matchesCategory
    );
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Control de gestion
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Reportes Historicos
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-300">
          Reportes históricos mensuales calculados sobre ventas reales, precios
          promedio y costos sin impuestos.
        </p>
      </header>

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
        <input type="hidden" name="tab" value={selectedTab} />
        <select
          name="from"
          defaultValue={filters.from}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Desde el inicio</option>
          {allPeriods.map((periodo) => (
            <option key={`from-${periodo.value}`} value={periodo.value}>
              {monthLabel(periodo.anio, periodo.mes)}
            </option>
          ))}
        </select>
        <select
          name="to"
          defaultValue={filters.to}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Hasta el último mes</option>
          {allPeriods.map((periodo) => (
            <option key={`to-${periodo.value}`} value={periodo.value}>
              {monthLabel(periodo.anio, periodo.mes)}
            </option>
          ))}
        </select>
        <select
          name="tipoProduccion"
          defaultValue={filters.tipoProduccion}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="all">Todos los orígenes</option>
          <option value="Propio">Propio</option>
          <option value="Externo">Externo</option>
        </select>
        <select
          name="categoria"
          defaultValue={filters.categoria}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href="/reportes-historicos"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      <nav className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-neutral-900/75 p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={queryFor({ tab: tab.value })}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              selectedTab === tab.value
                ? "bg-emerald-400 text-neutral-950"
                : "text-neutral-300 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {selectedTab === "ganancia-bruta" && (
        <nav className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-neutral-900/75 p-2">
          {grossProfitLevels.map((level) => (
            <Link
              key={level.value}
              href={queryFor({ nivel: level.value })}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                grossProfitLevel === level.value
                  ? "bg-emerald-400 text-neutral-950"
                  : "text-neutral-300 hover:bg-white/10"
              }`}
            >
              {level.label}
            </Link>
          ))}
        </nav>
      )}

      {selectedTab === "graficos-producto" && (
        <nav className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-neutral-900/75 p-2">
          {analyticsViews.map((view) => (
            <Link
              key={view.value}
              href={queryFor({ vista: view.value })}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                analyticsView === view.value
                  ? "bg-emerald-400 text-neutral-950"
                  : "text-neutral-300 hover:bg-white/10"
              }`}
            >
              {view.label}
            </Link>
          ))}
        </nav>
      )}

      {selectedTab === "graficos-producto" && (
        <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1.3fr_1.5fr_1fr_1fr_auto]">
          <input type="hidden" name="tab" value="graficos-producto" />
          <input type="hidden" name="vista" value={analyticsView} />
          {filters.from && <input type="hidden" name="from" value={filters.from} />}
          {filters.to && <input type="hidden" name="to" value={filters.to} />}
          {analyticsView === "productos" ? (
            <select
              name="productoId"
              defaultValue={filters.productoId}
              className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
            >
              <option value="">Seleccionar producto</option>
              {filteredProductOptions.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.sku} - {producto.nombre}
                </option>
              ))}
            </select>
          ) : (
            <select
              name="linea"
              defaultValue={filters.linea}
              className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
            >
              <option value="all">Todas las líneas</option>
              {lineOptions.map((line) => (
                <option key={line} value={line}>
                  {line}
                </option>
              ))}
            </select>
          )}
          <input
            name="q"
            placeholder="Buscar SKU o producto"
            defaultValue={filters.q}
            disabled={analyticsView !== "productos"}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
          />
          <select
            name="familiaId"
            defaultValue={filters.familiaId}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="">Todas las familias</option>
            {familyOptions.map((familia) => (
              <option key={familia.id} value={familia.id}>
                {familia.nombre}
              </option>
            ))}
          </select>
          <select
            name="tipoProductoVentaId"
            defaultValue={filters.tipoProductoVentaId}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="">Todos los tipos</option>
            {typeOptions.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <select
            name="tipoProduccion"
            defaultValue={filters.tipoProduccion}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="all">Todos los orígenes</option>
            <option value="Propio">Propio</option>
            <option value="Externo">Externo</option>
          </select>
          <select
            name="categoria"
            defaultValue={filters.categoria}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
            <Filter size={17} />
            Analizar
          </button>
        </form>
      )}

      {selectedTab === "ganancia-bruta" && grossProfitLevel === "categorias" && (
        <form className="flex flex-wrap gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4">
          <input type="hidden" name="tab" value="ganancia-bruta" />
          <input type="hidden" name="nivel" value="categorias" />
          {filters.from && <input type="hidden" name="from" value={filters.from} />}
          {filters.to && <input type="hidden" name="to" value={filters.to} />}
          {filters.tipoProduccion !== "all" && (
            <input type="hidden" name="tipoProduccion" value={filters.tipoProduccion} />
          )}
          {filters.categoria !== "all" && (
            <input type="hidden" name="categoria" value={filters.categoria} />
          )}
          <select
            name="metrica"
            defaultValue={grossProfitMetric}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            {grossProfitMetrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
            <Filter size={17} />
            Ver metrica
          </button>
        </form>
      )}

      {selectedTab === "ganancia-bruta" && grossProfitLevel === "productos" && (
        <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1.2fr_1.4fr_1fr_1fr_1fr_auto]">
          <input type="hidden" name="tab" value="ganancia-bruta" />
          <input type="hidden" name="nivel" value="productos" />
          {filters.from && <input type="hidden" name="from" value={filters.from} />}
          {filters.to && <input type="hidden" name="to" value={filters.to} />}
          {filters.tipoProduccion !== "all" && (
            <input type="hidden" name="tipoProduccion" value={filters.tipoProduccion} />
          )}
          {filters.categoria !== "all" && (
            <input type="hidden" name="categoria" value={filters.categoria} />
          )}
          <select
            name="productoId"
            defaultValue={filters.productoId}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="">Todos los productos</option>
            {productOptions.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.sku} - {producto.nombre}
              </option>
            ))}
          </select>
          <input
            name="q"
            placeholder="Buscar SKU o producto"
            defaultValue={filters.q}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
          />
          <select
            name="familiaId"
            defaultValue={filters.familiaId}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="">Todas las familias</option>
            {familyOptions.map((familia) => (
              <option key={familia.id} value={familia.id}>
                {familia.nombre}
              </option>
            ))}
          </select>
          <select
            name="tipoProductoVentaId"
            defaultValue={filters.tipoProductoVentaId}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            <option value="">Todos los tipos</option>
            {typeOptions.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          <select
            name="filtroRapido"
            defaultValue={filters.filtroRapido}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          >
            {quickFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
            <Filter size={17} />
            Aplicar
          </button>
        </form>
      )}

      {selectedTab === "ventas" && data.missingPriceCount > 0 && (
        <Warning>
          {data.missingPriceCount} productos/mes sin precio promedio cargado. Se
          usa 0 para el cálculo de ventas de esos casos.
        </Warning>
      )}
      {selectedTab === "cmv" && data.missingCostCount > 0 && (
        <Warning>
          {data.missingCostCount} productos/mes sin costo cargado. Se usa 0 para
          el cálculo de CMV de esos casos.
        </Warning>
      )}

      {selectedTab === "ganancia-bruta" &&
        (grossWarnings.missingCostCount > 0 ||
          grossWarnings.missingPriceCount > 0 ||
          grossWarnings.negativeMarginCount > 0 ||
          grossWarnings.extremeMarkupCount > 0) && (
          <Warning>
            Hay {grossWarnings.missingCostCount} registros sin costo y{" "}
            {grossWarnings.missingPriceCount} registros sin precio. Tambien se
            detectaron {grossWarnings.negativeMarginCount} registros con margen
            negativo y {grossWarnings.extremeMarkupCount} con markup extremo.
            Estos valores afectan el calculo de ganancia bruta.
          </Warning>
        )}
      {selectedTab === "graficos-producto" &&
        productChartsReport.product &&
        (productChartsReport.warnings.missingPriceMonths > 0 ||
          productChartsReport.warnings.missingCostMonths > 0) && (
          <Warning>
            Este producto tiene {productChartsReport.warnings.missingPriceMonths} meses sin
            precio y {productChartsReport.warnings.missingCostMonths} meses sin costo. Los
            gráficos económicos pueden estar incompletos.
          </Warning>
        )}

      {allPeriods.length === 0 ? (
        <EmptyState
          title="Sin meses historicos"
          detail="Carga ventas mensuales reales para generar reportes historicos."
        />
      ) : selectedTab === "graficos-producto" ? (
        <AnalyticsVisualSection
          view={analyticsView}
          productReport={productChartsReport}
          lineReport={lineAnalytics}
          materialReport={materialAnalytics}
          productionReport={productionAnalytics}
        />
      ) : selectedTab === "ganancia-bruta" ? (
        <GrossProfitSection
          level={grossProfitLevel}
          metric={grossProfitMetric}
          companyRows={grossCompanyRows}
          categoryRows={grossCategoryRows}
          productReport={grossProductReport}
          totals={grossTotals}
          companyChartData={companyChartData}
          categoryRanking={categoryRanking}
          topProducts={topProducts}
          bottomMarginProducts={bottomMarginProducts}
        />
      ) : data.rows.length === 0 ? (
        <EmptyState
          title="Sin datos para el rango"
          detail="Ajusta los filtros de mes, origen o categoria para ver informacion historica."
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </section>

          <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {tabs.find((tab) => tab.value === selectedTab)?.label}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Filas por mes historico y columnas por metrica real calculada.
              </p>
            </div>
            <ReportExportButtons
              filename={`reportes-historicos-${selectedTab}.csv`}
              rows={exportRows}
            />
          </div>

          <div className="max-h-[70vh] overflow-auto rounded-lg border border-white/10 bg-neutral-900/75">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="sticky left-0 z-30 min-w-36 border-b border-white/10 bg-neutral-900 px-4 py-3">
                    Mes
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`min-w-44 border-b border-white/10 px-4 py-3 text-right ${
                        column.total ? "text-emerald-200" : ""
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.period.value} className="group">
                    <td className="sticky left-0 z-10 border-b border-white/10 bg-neutral-900 px-4 py-3 font-semibold text-white group-hover:bg-neutral-800">
                      {monthLabel(row.period.anio, row.period.mes)}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={`${row.period.value}-${column.key}`}
                        className={`border-b border-white/10 px-4 py-3 text-right group-hover:bg-white/[0.03] ${
                          column.total
                            ? "font-semibold text-emerald-100"
                            : "text-neutral-200"
                        }`}
                      >
                        {formatCell(column.value(row), column.kind)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function GrossProfitSection({
  level,
  metric,
  companyRows,
  categoryRows,
  productReport,
  totals,
  companyChartData,
  categoryRanking,
  topProducts,
  bottomMarginProducts,
}: {
  level: GrossProfitLevel;
  metric: GrossProfitMetric;
  companyRows: Awaited<ReturnType<typeof buildGrossProfitCompanyReport>>;
  categoryRows: GrossProfitCategoryRow[];
  productReport: GrossProfitProductReport;
  totals: ReturnType<typeof calculateGrossProfitMetrics>;
  companyChartData: CompanyChartPoint[];
  categoryRanking: Array<{ name: string; value: number }>;
  topProducts: GrossProfitProductRow[];
  bottomMarginProducts: GrossProfitProductRow[];
}) {
  if (level === "categorias") {
    return (
      <GrossProfitCategorySection
        rows={categoryRows}
        metric={metric}
        categoryRanking={categoryRanking}
      />
    );
  }

  if (level === "productos") {
    return (
      <GrossProfitProductSection
        report={productReport}
        topProducts={topProducts}
        bottomMarginProducts={bottomMarginProducts}
      />
    );
  }

  const exportRows = companyRows.map((row) => ({
    Mes: monthLabel(row.period.anio, row.period.mes),
    "Ventas Totales": moneyFormat(row.metrics.ventas),
    "CMV Total": moneyFormat(row.metrics.cmv),
    "Ganancia Bruta": moneyFormat(row.metrics.grossProfit),
    "Margen Bruto %": percentFormat(row.metrics.grossMarginPct),
    "Markup %": percentFormat(row.metrics.markupPct),
  }));

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Ventas totales" value={moneyFormat(totals.ventas)} />
        <KpiCard label="CMV total" value={moneyFormat(totals.cmv)} />
        <KpiCard label="Ganancia bruta total" value={moneyFormat(totals.grossProfit)} />
        <KpiCard label="Margen bruto ponderado" value={percentFormat(totals.grossMarginPct)} />
        <KpiCard label="Markup ponderado" value={percentFormat(totals.markupPct)} />
      </section>

      <GrossProfitCompanyCharts data={companyChartData} />

      <TableShell
        title="Ganancia bruta por empresa"
        detail="Vista mensual general de ventas, CMV, ganancia bruta, margen y markup."
        filename="ganancia-bruta-empresa.csv"
        rows={exportRows}
      >
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              {["Mes", "Ventas Totales", "CMV Total", "Ganancia Bruta", "Margen Bruto %", "Markup %"].map(
                (column, index) => (
                  <th
                    key={column}
                    className={`border-b border-white/10 px-4 py-3 ${
                      index === 0 ? "sticky left-0 z-30 bg-neutral-900" : "text-right"
                    }`}
                  >
                    {column}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {companyRows.map((row) => (
              <tr key={row.period.value} className="group">
                <td className="sticky left-0 z-10 border-b border-white/10 bg-neutral-900 px-4 py-3 font-semibold text-white group-hover:bg-neutral-800">
                  {monthLabel(row.period.anio, row.period.mes)}
                </td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">
                  {moneyFormat(row.metrics.ventas)}
                </td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">
                  {moneyFormat(row.metrics.cmv)}
                </td>
                <td className={`border-b border-white/10 px-4 py-3 text-right font-semibold ${signedClass(row.metrics.grossProfit)}`}>
                  {moneyFormat(row.metrics.grossProfit)}
                </td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.metrics.grossMarginPct)}`}>
                  {percentFormat(row.metrics.grossMarginPct)}
                </td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.metrics.markupPct)}`}>
                  {percentFormat(row.metrics.markupPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}

function GrossProfitCategorySection({
  rows,
  metric,
  categoryRanking,
}: {
  rows: GrossProfitCategoryRow[];
  metric: GrossProfitMetric;
  categoryRanking: Array<{ name: string; value: number }>;
}) {
  const metricLabel = grossProfitMetrics.find((item) => item.value === metric)?.label ?? "";
  const exportRows = rows.map((row) => ({
    Mes: monthLabel(row.period.anio, row.period.mes),
    ...Object.fromEntries(
      categoryKeys.map((key) => [
        categoryKeyLabel(key),
        formatGrossMetric(metricValue(row.categories[key], metric), metric),
      ]),
    ),
  }));

  return (
    <>
      <GrossProfitRankingChart
        title="Ranking de categorías por ganancia bruta"
        data={categoryRanking}
      />
      <TableShell
        title={`Categorías por ${metricLabel}`}
        detail="Tabla pivot mensual: filas por mes, columnas por categoría comercial y origen."
        filename="ganancia-bruta-categorias.csv"
        rows={exportRows}
      >
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="sticky left-0 z-30 min-w-36 border-b border-white/10 bg-neutral-900 px-4 py-3">
                Mes
              </th>
              {categoryKeys.map((key) => (
                <th key={key} className="min-w-44 border-b border-white/10 px-4 py-3 text-right">
                  {categoryKeyLabel(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period.value} className="group">
                <td className="sticky left-0 z-10 border-b border-white/10 bg-neutral-900 px-4 py-3 font-semibold text-white group-hover:bg-neutral-800">
                  {monthLabel(row.period.anio, row.period.mes)}
                </td>
                {categoryKeys.map((key) => {
                  const value = metricValue(row.categories[key], metric);
                  return (
                    <td
                      key={`${row.period.value}-${key}`}
                      className={`border-b border-white/10 px-4 py-3 text-right group-hover:bg-white/[0.03] ${signedClass(value)}`}
                    >
                      {formatGrossMetric(value, metric)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}

function GrossProfitProductSection({
  report,
  topProducts,
  bottomMarginProducts,
}: {
  report: GrossProfitProductReport;
  topProducts: GrossProfitProductRow[];
  bottomMarginProducts: GrossProfitProductRow[];
}) {
  const exportRows = report.rows.map((row) => ({
    Mes: monthLabel(row.period.anio, row.period.mes),
    SKU: row.sku,
    Producto: row.producto,
    Familia: row.familia,
    Tipo: row.tipoProductoVenta,
    Origen: row.tipoProduccion,
    Unidades: numberFormat(row.unidades),
    Ventas: moneyFormat(row.metrics.ventas),
    CMV: moneyFormat(row.metrics.cmv),
    "Ganancia Bruta": moneyFormat(row.metrics.grossProfit),
    "Margen Bruto %": percentFormat(row.metrics.grossMarginPct),
    "Markup %": percentFormat(row.metrics.markupPct),
  }));

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Ventas filtradas" value={moneyFormat(report.totals.ventas)} />
        <KpiCard label="CMV filtrado" value={moneyFormat(report.totals.cmv)} />
        <KpiCard label="Ganancia bruta" value={moneyFormat(report.totals.grossProfit)} />
        <KpiCard label="Margen ponderado" value={percentFormat(report.totals.grossMarginPct)} />
        <KpiCard label="Markup ponderado" value={percentFormat(report.totals.markupPct)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <GrossProfitRankingChart
          title="Top 10 productos por ganancia bruta"
          data={topProducts.map((row) => ({ name: row.sku, value: row.metrics.grossProfit }))}
        />
        <GrossProfitRankingChart
          title="Bottom 10 productos por margen"
          data={bottomMarginProducts.map((row) => ({
            name: row.sku,
            value: row.metrics.grossMarginPct ?? 0,
          }))}
          valueKind="percent"
        />
      </section>

      <TableShell
        title="Ganancia bruta por producto"
        detail="Orden default por mes descendente y ganancia bruta descendente."
        filename="ganancia-bruta-productos.csv"
        rows={exportRows}
      >
        <table className="min-w-[1380px] border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              {[
                "Mes",
                "SKU",
                "Producto",
                "Familia",
                "Tipo",
                "Origen",
                "Unidades",
                "Ventas",
                "CMV",
                "Ganancia Bruta",
                "Margen Bruto %",
                "Markup %",
              ].map((column, index) => (
                <th
                  key={column}
                  className={`border-b border-white/10 px-4 py-3 ${
                    index >= 6 ? "text-right" : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={`${row.period.value}-${row.productoId}`} className="group">
                <td className="border-b border-white/10 px-4 py-3 font-semibold text-white">
                  {monthLabel(row.period.anio, row.period.mes)}
                </td>
                <td className="border-b border-white/10 px-4 py-3 text-neutral-200">{row.sku}</td>
                <td className="border-b border-white/10 px-4 py-3 text-neutral-200">
                  <div className="max-w-72 truncate">{row.producto}</div>
                  {(row.missingCost || row.missingPrice) && (
                    <div className="mt-1 text-xs text-amber-100">
                      {row.missingPrice ? "Sin precio" : ""}
                      {row.missingPrice && row.missingCost ? " · " : ""}
                      {row.missingCost ? "Sin costo" : ""}
                    </div>
                  )}
                </td>
                <td className="border-b border-white/10 px-4 py-3 text-neutral-300">{row.familia}</td>
                <td className="border-b border-white/10 px-4 py-3 text-neutral-300">{row.tipoProductoVenta}</td>
                <td className="border-b border-white/10 px-4 py-3 text-neutral-300">{row.tipoProduccion}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{numberFormat(row.unidades)}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{moneyFormat(row.metrics.ventas)}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{moneyFormat(row.metrics.cmv)}</td>
                <td className={`border-b border-white/10 px-4 py-3 text-right font-semibold ${signedClass(row.metrics.grossProfit)}`}>
                  {moneyFormat(row.metrics.grossProfit)}
                </td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.metrics.grossMarginPct)}`}>
                  {percentFormat(row.metrics.grossMarginPct)}
                </td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.metrics.markupPct)}`}>
                  {percentFormat(row.metrics.markupPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}

function TableShell({
  title,
  detail,
  filename,
  rows,
  children,
}: {
  title: string;
  detail: string;
  filename: string;
  rows: Record<string, string>[];
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-neutral-400">{detail}</p>
        </div>
        <ReportExportButtons filename={filename} rows={rows} />
      </div>
      <div className="max-h-[70vh] overflow-auto rounded-lg border border-white/10 bg-neutral-900/75">
        {children}
      </div>
    </>
  );
}

function AnalyticsVisualSection({
  view,
  productReport,
  lineReport,
  materialReport,
  productionReport,
}: {
  view: AnalyticsView;
  productReport: ProductChartsReport;
  lineReport: HistoricalAnalyticsReport;
  materialReport: HistoricalAnalyticsReport;
  productionReport: HistoricalAnalyticsReport;
}) {
  if (view === "lineas") {
    return (
      <AggregatedAnalyticsSection
        title="Gráficos por línea de producto"
        report={lineReport}
        filename="graficos-lineas.csv"
        charts={<AnalyticsLinesCharts report={lineReport} />}
      />
    );
  }

  if (view === "materiales") {
    return (
      <AggregatedAnalyticsSection
        title="Gráficos por material"
        report={materialReport}
        filename="graficos-materiales.csv"
        charts={<AnalyticsMaterialsCharts report={materialReport} />}
      />
    );
  }

  if (view === "produccion") {
    return (
      <AggregatedAnalyticsSection
        title="Gráficos por tipo de producción"
        report={productionReport}
        filename="graficos-produccion.csv"
        charts={<AnalyticsProductionCharts report={productionReport} />}
      />
    );
  }

  return <ProductChartsSection report={productReport} />;
}

function AggregatedAnalyticsSection({
  title,
  report,
  filename,
  charts,
}: {
  title: string;
  report: HistoricalAnalyticsReport;
  filename: string;
  charts: React.ReactNode;
}) {
  const exportRows = report.monthlySeries.map((point) => ({
    Mes: point.label,
    ...Object.fromEntries(
      report.groups.flatMap((group) => {
        const value = point.values[group.key];
        return [
          [`${group.label} Unidades`, numberFormat(value?.unidades ?? 0)],
          [`${group.label} Ventas`, moneyFormat(value?.ventas ?? 0)],
          [`${group.label} CMV`, moneyFormat(value?.cmv ?? 0)],
          [`${group.label} Ganancia Bruta`, moneyFormat(value?.grossProfit ?? 0)],
          [`${group.label} Margen %`, percentFormat(value?.grossMarginPct ?? null)],
          [`${group.label} Markup %`, percentFormat(value?.markupPct ?? null)],
          [`${group.label} Participación %`, percentFormat(value?.participationPct ?? null)],
        ];
      }),
    ),
  }));

  if (report.monthlySeries.length === 0) {
    return (
      <EmptyState
        title="Sin datos para analizar"
        detail="Ajusta los filtros para ver información histórica agregada."
      />
    );
  }

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Unidades" value={numberFormat(report.kpis.unidades)} />
        <KpiCard label="Ventas" value={moneyFormat(report.kpis.ventas)} />
        <KpiCard label="CMV" value={moneyFormat(report.kpis.cmv)} />
        <KpiCard label="Ganancia bruta" value={moneyFormat(report.kpis.grossProfit)} />
        <KpiCard label="Margen bruto %" value={percentFormat(report.kpis.grossMarginPct)} />
        <KpiCard label="Markup %" value={percentFormat(report.kpis.markupPct)} />
      </section>

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Datasets agregados server-side para análisis ejecutivo del negocio.
          </p>
        </div>
        <ReportExportButtons filename={filename} rows={exportRows} />
      </div>

      {charts}

      <TableShell
        title="Ranking del período"
        detail="Resumen agregado por grupo para el rango seleccionado."
        filename={`ranking-${filename}`}
        rows={report.rankings.map((row) => ({
          Grupo: row.label,
          Unidades: numberFormat(row.unidades),
          Ventas: moneyFormat(row.ventas),
          CMV: moneyFormat(row.cmv),
          "Ganancia Bruta": moneyFormat(row.grossProfit),
          "Margen %": percentFormat(row.grossMarginPct),
          "Markup %": percentFormat(row.markupPct),
          "Participación %": percentFormat(row.participationPct),
        }))}
      >
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              {["Grupo", "Unidades", "Ventas", "CMV", "Ganancia Bruta", "Margen %", "Markup %", "Participación %"].map((column, index) => (
                <th key={column} className={`border-b border-white/10 px-4 py-3 ${index > 0 ? "text-right" : ""}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.rankings.map((row) => (
              <tr key={row.key}>
                <td className="border-b border-white/10 px-4 py-3 font-semibold text-white">{row.label}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{numberFormat(row.unidades)}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{moneyFormat(row.ventas)}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{moneyFormat(row.cmv)}</td>
                <td className={`border-b border-white/10 px-4 py-3 text-right font-semibold ${signedClass(row.grossProfit)}`}>{moneyFormat(row.grossProfit)}</td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.grossMarginPct)}`}>{percentFormat(row.grossMarginPct)}</td>
                <td className={`border-b border-white/10 px-4 py-3 text-right ${signedClass(row.markupPct)}`}>{percentFormat(row.markupPct)}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{percentFormat(row.participationPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}

function ProductChartsSection({ report }: { report: ProductChartsReport }) {
  if (!report.product) {
    return (
      <EmptyState
        title="Seleccioná un producto"
        detail="Seleccioná un producto para analizar su evolución histórica."
      />
    );
  }

  if (report.monthlySeries.length === 0) {
    return (
      <EmptyState
        title="Sin datos para el producto"
        detail="No hay ventas historicas para el producto y rango seleccionados."
      />
    );
  }

  const chartData: ProductChartPoint[] = report.monthlySeries.map((point) => ({
    label: point.label,
    unidades: point.unidades,
    ventas: point.ventas,
    cmv: point.cmv,
    gananciaBruta: point.gananciaBruta,
    margenBrutoPct: point.margenBrutoPct,
    markupPct: point.markupPct,
    precioPromedio: point.precioPromedio,
    costoUnitario: point.costoUnitario,
    spreadUnitario: point.spreadUnitario,
    participacionVentasPct: point.participacionVentasPct,
    rankingVentas: point.rankingVentas,
    rankingGananciaBruta: point.rankingGananciaBruta,
  }));
  const exportRows = report.monthlySeries.map((point) => ({
    Mes: point.label,
    Unidades: numberFormat(point.unidades),
    "Precio promedio": point.precioPromedio === null ? "Sin datos" : moneyFormat(point.precioPromedio),
    "Costo unitario": point.costoUnitario === null ? "Sin datos" : moneyFormat(point.costoUnitario),
    Ventas: moneyFormat(point.ventas),
    CMV: moneyFormat(point.cmv),
    "Ganancia Bruta": moneyFormat(point.gananciaBruta),
    "Margen Bruto %": percentFormat(point.margenBrutoPct),
    "Markup %": percentFormat(point.markupPct),
    "Spread unitario": point.spreadUnitario === null ? "Sin datos" : moneyFormat(point.spreadUnitario),
    "Participación ventas %": percentFormat(point.participacionVentasPct),
    "Ranking ventas": point.rankingVentas?.toString() ?? "Sin datos",
    "Ranking ganancia bruta": point.rankingGananciaBruta?.toString() ?? "Sin datos",
  }));

  return (
    <>
      <section className="rounded-lg border border-white/10 bg-neutral-900/75 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
              Producto seleccionado
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {report.product.sku} - {report.product.nombre}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-300">
              <span className="rounded-md bg-white/[0.06] px-2 py-1">{report.product.familia}</span>
              <span className="rounded-md bg-white/[0.06] px-2 py-1">{report.product.tipoProductoVenta}</span>
              <span className="rounded-md bg-white/[0.06] px-2 py-1">{report.product.tipoProduccion}</span>
              <span className="rounded-md bg-white/[0.06] px-2 py-1">{reportingMaterialLabels[report.product.categoria]}</span>
            </div>
          </div>
          <ReportExportButtons
            filename={`graficos-producto-${report.product.sku}.csv`}
            rows={exportRows}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Unidades totales" value={numberFormat(report.kpis.unidades)} />
        <KpiCard label="Ventas totales" value={moneyFormat(report.kpis.ventas)} />
        <KpiCard label="CMV total" value={moneyFormat(report.kpis.cmv)} />
        <KpiCard label="Ganancia bruta total" value={moneyFormat(report.kpis.grossProfit)} />
        <KpiCard label="Margen bruto ponderado" value={percentFormat(report.kpis.grossMarginPct)} />
        <KpiCard label="Markup ponderado" value={percentFormat(report.kpis.markupPct)} />
        <KpiCard
          label="Precio promedio ponderado"
          value={
            report.kpis.precioPromedioPonderado === null
              ? "Sin datos"
              : moneyFormat(report.kpis.precioPromedioPonderado)
          }
        />
        <KpiCard
          label="Costo promedio ponderado"
          value={
            report.kpis.costoPromedioPonderado === null
              ? "Sin datos"
              : moneyFormat(report.kpis.costoPromedioPonderado)
          }
        />
      </section>

      <ProductChartsGrid data={chartData} />

      <TableShell
        title="Ranking mensual"
        detail="Ranking 1 indica el producto mejor posicionado del mes."
        filename={`ranking-producto-${report.product.sku}.csv`}
        rows={exportRows}
      >
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="border-b border-white/10 px-4 py-3">Mes</th>
              <th className="border-b border-white/10 px-4 py-3 text-right">Ranking por ventas</th>
              <th className="border-b border-white/10 px-4 py-3 text-right">Ranking por ganancia bruta</th>
              <th className="border-b border-white/10 px-4 py-3 text-right">Participación ventas</th>
            </tr>
          </thead>
          <tbody>
            {report.monthlySeries.map((point) => (
              <tr key={point.label}>
                <td className="border-b border-white/10 px-4 py-3 font-semibold text-white">{point.label}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{point.rankingVentas ?? "Sin datos"}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{point.rankingGananciaBruta ?? "Sin datos"}</td>
                <td className="border-b border-white/10 px-4 py-3 text-right text-neutral-200">{percentFormat(point.participacionVentasPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      <div>{children}</div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#cad2dd]/10 p-4">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="mt-3 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
