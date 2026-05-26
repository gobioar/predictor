"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export function ReportChart({ data }: { data: ChartRow[] }) {
  return (
    <div className="h-[380px] rounded-lg border border-white/10 bg-neutral-950 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 18, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#262626" vertical={false} />
          <XAxis dataKey="mes" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
          <YAxis stroke="#a3a3a3" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="real" name="Ventas reales" stroke="#f9fafb" strokeWidth={3} dot={false} connectNulls />
          <Line type="monotone" dataKey="movingAverage" name="Moving Average" stroke="#34d399" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="linear" name="Regresión Lineal" stroke="#60a5fa" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="polynomial" name="Regresión Polinómica" stroke="#fbbf24" strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="holtWinters" name="Holt-Winters" stroke="#f472b6" strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
