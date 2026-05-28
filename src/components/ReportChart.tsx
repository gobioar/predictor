"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartRow = {
  mes: string;
  real: number | null;
  movingAverage: number | null;
  linear: number | null;
  polynomial: number | null;
  holtWinters: number | null;
};

export function ReportChart({
  data,
  forecastStartLabel,
}: {
  data: ChartRow[];
  forecastStartLabel?: string;
}) {
  return (
    <div className="h-[380px] rounded-lg border border-white/10 bg-[#363636] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 18, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="rgba(202,210,221,0.18)" vertical={false} />
          <XAxis dataKey="mes" stroke="#cad2dd" tick={{ fontSize: 12 }} />
          <YAxis stroke="#cad2dd" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#363636",
              border: "1px solid rgba(202,210,221,0.22)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Legend />
          {forecastStartLabel && (
            <ReferenceLine
              x={forecastStartLabel}
              stroke="#32aa93"
              strokeDasharray="4 4"
              label={{
                value: "Forecast",
                fill: "#7cbf81",
                fontSize: 12,
                position: "insideTopRight",
              }}
            />
          )}
          <Line type="monotone" dataKey="real" name="Ventas reales" stroke="#f7f9fb" strokeWidth={3} dot={false} connectNulls />
          <Line type="monotone" dataKey="movingAverage" name="Moving Average" stroke="#32aa93" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="linear" name="Regresión Lineal" stroke="#667387" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="polynomial" name="Regresión Polinómica" stroke="#7cbf81" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="holtWinters" name="Holt-Winters" stroke="#cad2dd" strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
