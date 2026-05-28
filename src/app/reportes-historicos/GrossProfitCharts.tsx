"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
