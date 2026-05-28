import { AlertTriangle, Filter, X } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { requireAuth } from "@/lib/auth";
import {
  buildHistoricalReportData,
  getHistoricalReportPeriods,
  type CategoryFilter,
  type HistoricalReportMonthRow,
  type HistoricalReportTab,
  type ProductionFilter,
} from "@/lib/historical-reports";
import {
  reportingMaterialKeys,
  reportingMaterialLabels,
  type ReportingMaterial,
} from "@/lib/reporting-categories";
import { formatMonth } from "@/lib/utils";
import { ReportExportButtons } from "./ReportExportButtons";

const tabs: Array<{ value: HistoricalReportTab; label: string }> = [
  { value: "unidades", label: "Unidades" },
  { value: "ventas", label: "Ventas" },
  { value: "cmv", label: "CMV" },
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

const columnsByTab: Record<HistoricalReportTab, ReportColumn[]> = {
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
  }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const selectedTab: HistoricalReportTab = isTab(params?.tab) ? params.tab : "unidades";
  const filters = {
    from: params?.from ?? "",
    to: params?.to ?? "",
    tipoProduccion: isProductionFilter(params?.tipoProduccion)
      ? params.tipoProduccion
      : "all",
    categoria: isCategoryFilter(params?.categoria) ? params.categoria : "all",
  };
  const reportFilters = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    tipoProduccion: filters.tipoProduccion,
    categoria: filters.categoria,
  };
  const [allPeriods, data] = await Promise.all([
    getHistoricalReportPeriods(),
    buildHistoricalReportData(reportFilters),
  ]);
  const columns = columnsByTab[selectedTab];
  const kpis = kpiForTab(selectedTab, data);
  const queryFor = (overrides: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    const next = { ...filters, tab: selectedTab, ...overrides };

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

      {allPeriods.length === 0 ? (
        <EmptyState
          title="Sin meses historicos"
          detail="Carga ventas mensuales reales para generar reportes historicos."
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
