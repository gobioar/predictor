"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoricalAnalyticsReport } from "@/lib/historical-analytics";

export type CompanyChartPoint = {
  mes: string;
  gananciaBruta: number;
  margenBrutoPct: number | null;
  ventas: number;
  cmv: number;
};

export type RankingChartPoint = {
  name: string;
  value: number;
};

export type ProductChartPoint = {
  label: string;
  unidades: number;
  ventas: number;
  cmv: number;
  gananciaBruta: number;
  margenBrutoPct: number | null;
  markupPct: number | null;
  precioPromedio: number | null;
  costoUnitario: number | null;
  spreadUnitario: number | null;
  participacionVentasPct: number | null;
};

type AnalyticsFlatPoint = {
  label: string;
  [key: string]: string | number | null;
};

const money = (value: number) =>
  `$ ${value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const percent = (value: number | null | undefined) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "Sin datos";

export function GrossProfitCompanyCharts({ data }: { data: CompanyChartPoint[] }) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <ChartShell title="Margen bruto mensual">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="mes" stroke="#cad2dd" fontSize={11} tickLine={false} />
            <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
              formatter={(value) => percent(Number(value))}
            />
            <Line
              type="monotone"
              dataKey="margenBrutoPct"
              name="Margen bruto %"
              stroke="#7cbf81"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Ganancia bruta mensual">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="mes" stroke="#cad2dd" fontSize={11} tickLine={false} />
            <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip
              contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
              formatter={(value) => money(Number(value))}
            />
            <Bar dataKey="gananciaBruta" name="Ganancia bruta" radius={[3, 3, 0, 0]}>
              {data.map((point) => (
                <Cell
                  key={point.mes}
                  fill={point.gananciaBruta >= 0 ? "#32aa93" : "#f87171"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
      <ChartShell title="Ventas vs CMV">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="mes" stroke="#cad2dd" fontSize={11} tickLine={false} />
            <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
            <Tooltip
              contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
              formatter={(value) => money(Number(value))}
            />
            <Legend />
            <Bar dataKey="ventas" name="Ventas" fill="#32aa93" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cmv" name="CMV" fill="#cad2dd" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </section>
  );
}

export function GrossProfitRankingChart({
  title,
  data,
  valueKind = "money",
}: {
  title: string;
  data: RankingChartPoint[];
  valueKind?: "money" | "percent";
}) {
  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 18, bottom: 8, left: 18 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis
            type="number"
            stroke="#cad2dd"
            fontSize={11}
            tickFormatter={(value) =>
              valueKind === "money" ? `$${Number(value) / 1000}k` : `${value}%`
            }
          />
          <YAxis type="category" dataKey="name" stroke="#cad2dd" fontSize={11} width={92} />
          <Tooltip
            contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
            formatter={(value) =>
              valueKind === "money" ? money(Number(value)) : percent(Number(value))
            }
          />
          <Bar dataKey="value" name={title} radius={[0, 3, 3, 0]}>
            {data.map((point) => (
              <Cell key={point.name} fill={point.value >= 0 ? "#32aa93" : "#f87171"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ProductChartsGrid({ data }: { data: ProductChartPoint[] }) {
  return (
    <div className="space-y-6">
      <section>
        <BlockTitle title="Comercial" />
        <div className="mt-3 grid gap-4 xl:grid-cols-3">
          <ChartShell title="Evolución de unidades vendidas">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => Number(value).toLocaleString("es-AR")}
                />
                <Line type="monotone" dataKey="unidades" name="Unidades" stroke="#7cbf81" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="Ventas vs CMV">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => money(Number(value))}
                />
                <Legend />
                <Bar dataKey="ventas" name="Ventas" fill="#32aa93" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cmv" name="CMV" fill="#cad2dd" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="Participación sobre ventas totales">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => percent(Number(value))}
                />
                <Line type="monotone" dataKey="participacionVentasPct" name="Participación %" stroke="#7cbf81" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
        </div>
      </section>

      <section>
        <BlockTitle title="Rentabilidad" />
        <div className="mt-3 grid gap-4 xl:grid-cols-3">
          <ChartShell title="Ganancia bruta mensual">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => money(Number(value))}
                />
                <Bar dataKey="gananciaBruta" name="Ganancia bruta" radius={[3, 3, 0, 0]}>
                  {data.map((point) => (
                    <Cell key={point.label} fill={point.gananciaBruta >= 0 ? "#32aa93" : "#f87171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="Margen bruto % / Markup %">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => percent(Number(value))}
                />
                <Legend />
                <Line type="monotone" dataKey="margenBrutoPct" name="Margen bruto %" stroke="#7cbf81" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="markupPct" name="Markup %" stroke="#cad2dd" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="Ranking mensual">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} reversed allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }} />
                <Legend />
                <Line type="monotone" dataKey="rankingVentas" name="Ranking ventas" stroke="#7cbf81" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rankingGananciaBruta" name="Ranking ganancia" stroke="#cad2dd" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
        </div>
      </section>

      <section>
        <BlockTitle title="Pricing" />
        <div className="mt-3 grid gap-4 xl:grid-cols-2">
          <ChartShell title="Precio promedio vs costo unitario">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value)}`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => money(Number(value))}
                />
                <Legend />
                <Line type="monotone" dataKey="precioPromedio" name="Precio promedio" stroke="#7cbf81" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="costoUnitario" name="Costo unitario" stroke="#cad2dd" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>
          <ChartShell title="Spread unitario">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
                <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value)}`} />
                <Tooltip
                  contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                  formatter={(value) => money(Number(value))}
                />
                <Bar dataKey="spreadUnitario" name="Spread unitario" radius={[3, 3, 0, 0]}>
                  {data.map((point) => (
                    <Cell key={point.label} fill={(point.spreadUnitario ?? 0) >= 0 ? "#32aa93" : "#f87171"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </div>
      </section>
    </div>
  );
}

export function AnalyticsLinesCharts({ report }: { report: HistoricalAnalyticsReport }) {
  const data = flattenAnalytics(report);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-2">
        <StackedArea title="Evolución de ventas por línea" data={data} groups={report.groups} suffix="ventas" />
        <StackedBar title="Evolución de unidades" data={data} groups={report.groups} suffix="unidades" valueKind="units" />
        <StackedArea title="Participación de líneas" data={data} groups={report.groups} suffix="participacion" valueKind="percent" stacked100 />
        <StackedBar title="Ganancia bruta por línea" data={data} groups={report.groups} suffix="ganancia" />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <AnalyticsRanking title="Top líneas más rentables" rows={report.rankings} value="grossProfit" />
        <AnalyticsRanking title="Margen bruto promedio por línea" rows={report.rankings} value="grossMarginPct" valueKind="percent" />
      </section>
    </div>
  );
}

export function AnalyticsMaterialsCharts({ report }: { report: HistoricalAnalyticsReport }) {
  const data = flattenAnalytics(report);
  const scatterData = report.rankings.map((row) => ({
    name: row.label,
    ventas: row.ventas,
    margen: row.grossMarginPct ?? 0,
    unidades: Math.max(60, Math.sqrt(row.unidades || 1) * 8),
  }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-2">
        <StackedArea title="Mix de ventas por material" data={data} groups={report.groups} suffix="participacion" valueKind="percent" stacked100 />
        <MultiLine title="Evolución de unidades por material" data={data} groups={report.groups} suffix="unidades" valueKind="units" />
        <MultiLine title="Evolución de margen bruto por material" data={data} groups={report.groups} suffix="margen" valueKind="percent" />
        <StackedBar title="Evolución de CMV por material" data={data} groups={report.groups} suffix="cmv" />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <ChartShell title="Rentabilidad comparativa">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="ventas" name="Ventas" stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <YAxis dataKey="margen" name="Margen" stroke="#cad2dd" fontSize={11} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                formatter={(value, name) => (name === "Ventas" ? money(Number(value)) : percent(Number(value)))}
              />
              <Scatter data={scatterData} fill="#32aa93" name="Materiales" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Participación histórica">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }}
                formatter={(value) => money(Number(value))}
              />
              <Pie data={report.participation} dataKey="value" nameKey="label" innerRadius={62} outerRadius={98} paddingAngle={2}>
                {report.participation.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>
      </section>
    </div>
  );
}

export function AnalyticsProductionCharts({ report }: { report: HistoricalAnalyticsReport }) {
  const data = flattenAnalytics(report);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-2">
        <StackedBar title="Evolución ventas Propio vs Externo" data={data} groups={report.groups} suffix="ventas" />
        <MultiLine title="Evolución unidades Propio vs Externo" data={data} groups={report.groups} suffix="unidades" valueKind="units" />
        <MultiLine title="Margen bruto Propio vs Externo" data={data} groups={report.groups} suffix="margen" valueKind="percent" />
        <StackedArea title="Participación histórica" data={data} groups={report.groups} suffix="participacion" valueKind="percent" stacked100 />
        <MultiLine title="Ganancia bruta acumulada" data={data} groups={report.groups} suffix="acumulada" />
      </section>
    </div>
  );
}

function flattenAnalytics(report: HistoricalAnalyticsReport): AnalyticsFlatPoint[] {
  return report.monthlySeries.map((point) => {
    const flat: AnalyticsFlatPoint = { label: point.label };

    report.groups.forEach((group) => {
      const value = point.values[group.key];
      flat[`${group.key}-ventas`] = value?.ventas ?? 0;
      flat[`${group.key}-cmv`] = value?.cmv ?? 0;
      flat[`${group.key}-unidades`] = value?.unidades ?? 0;
      flat[`${group.key}-ganancia`] = value?.grossProfit ?? 0;
      flat[`${group.key}-margen`] = value?.grossMarginPct ?? null;
      flat[`${group.key}-participacion`] = value?.participationPct ?? 0;
      flat[`${group.key}-acumulada`] = value?.cumulativeGrossProfit ?? 0;
    });

    return flat;
  });
}

function StackedArea({
  title,
  data,
  groups,
  suffix,
  valueKind = "money",
  stacked100 = false,
}: {
  title: string;
  data: AnalyticsFlatPoint[];
  groups: HistoricalAnalyticsReport["groups"];
  suffix: string;
  valueKind?: "money" | "percent" | "units";
  stacked100?: boolean;
}) {
  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
          <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => formatAxis(Number(value), valueKind)} domain={stacked100 ? [0, 100] : undefined} />
          <Tooltip contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }} formatter={(value) => formatTooltip(Number(value), valueKind)} />
          <Legend />
          {groups.map((group) => (
            <Area key={group.key} type="monotone" dataKey={`${group.key}-${suffix}`} name={group.label} stackId="1" stroke={group.color} fill={group.color} fillOpacity={0.55} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function StackedBar({
  title,
  data,
  groups,
  suffix,
  valueKind = "money",
}: {
  title: string;
  data: AnalyticsFlatPoint[];
  groups: HistoricalAnalyticsReport["groups"];
  suffix: string;
  valueKind?: "money" | "percent" | "units";
}) {
  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
          <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => formatAxis(Number(value), valueKind)} />
          <Tooltip contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }} formatter={(value) => formatTooltip(Number(value), valueKind)} />
          <Legend />
          {groups.map((group) => (
            <Bar key={group.key} dataKey={`${group.key}-${suffix}`} name={group.label} stackId="1" fill={group.color} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function MultiLine({
  title,
  data,
  groups,
  suffix,
  valueKind = "money",
}: {
  title: string;
  data: AnalyticsFlatPoint[];
  groups: HistoricalAnalyticsReport["groups"];
  suffix: string;
  valueKind?: "money" | "percent" | "units";
}) {
  return (
    <ChartShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 18, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="label" stroke="#cad2dd" fontSize={11} tickLine={false} />
          <YAxis stroke="#cad2dd" fontSize={11} tickFormatter={(value) => formatAxis(Number(value), valueKind)} />
          <Tooltip contentStyle={{ background: "#363636", border: "1px solid rgba(255,255,255,0.12)" }} formatter={(value) => formatTooltip(Number(value), valueKind)} />
          <Legend />
          {groups.map((group) => (
            <Line key={group.key} type="monotone" dataKey={`${group.key}-${suffix}`} name={group.label} stroke={group.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

function AnalyticsRanking({
  title,
  rows,
  value,
  valueKind = "money",
}: {
  title: string;
  rows: HistoricalAnalyticsReport["rankings"];
  value: "grossProfit" | "grossMarginPct";
  valueKind?: "money" | "percent";
}) {
  return (
    <GrossProfitRankingChart
      title={title}
      data={rows.slice(0, 10).map((row) => ({
        name: row.label,
        value: row[value] ?? 0,
      }))}
      valueKind={valueKind}
    />
  );
}

function formatAxis(value: number, kind: "money" | "percent" | "units") {
  if (kind === "percent") return `${value}%`;
  if (kind === "units") return value.toLocaleString("es-AR");
  return `$${value / 1000}k`;
}

function formatTooltip(value: number, kind: "money" | "percent" | "units") {
  if (kind === "percent") return percent(value);
  if (kind === "units") return value.toLocaleString("es-AR");
  return money(value);
}

function BlockTitle({ title }: { title: string }) {
  return <h2 className="text-lg font-semibold text-white">{title}</h2>;
}

function ChartShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-neutral-900/75 p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3 h-64">{children}</div>
    </div>
  );
}
