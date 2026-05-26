import Link from "next/link";
import { ArrowRight, Boxes, Database, Package, Settings2 } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [familias, tipos, productos, ventas, config] = await Promise.all([
    prisma.familiaProducto.count(),
    prisma.tipoProductoVenta.count(),
    prisma.producto.count(),
    prisma.ventaMensualPeriodo.count(),
    prisma.forecastConfig.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    }),
  ]);

  const cards = [
    { label: "Familias", value: familias, icon: Boxes },
    { label: "Tipos", value: tipos, icon: Settings2 },
    { label: "Productos", value: productos, icon: Package },
    { label: "Meses cargados", value: ventas, icon: Database },
  ];

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-5 rounded-lg border border-white/10 bg-neutral-900/75 p-6 shadow-2xl shadow-black/30 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Forecast estadístico
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Demanda proyectada para productos de venta
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300">
            Cargá productos, ventas mensuales y generá proyecciones con Moving Average,
            regresiones y Holt-Winters sin APIs externas ni inteligencia artificial.
          </p>
        </div>
        <Link
          href="/reporte"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
        >
          Abrir reporte
          <ArrowRight size={18} />
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-sm">{card.label}</span>
                <Icon size={18} />
              </div>
              <div className="mt-4 text-3xl font-semibold text-white">{card.value}</div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-neutral-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Configuración activa</h2>
          <dl className="mt-4 space-y-3 text-sm text-neutral-300">
            <div className="flex justify-between gap-4">
              <dt>Moving Average</dt>
              <dd className="font-medium text-white">{config.movingAverageN} meses</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Horizonte</dt>
              <dd className="font-medium text-white">{config.forecastHorizonMonths} meses</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Polinómica</dt>
              <dd className="font-medium text-white">grado {config.polynomialDegree}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Holt-Winters</dt>
              <dd className="font-medium text-white">{config.holtWintersSeasonLength} meses</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-white/10 bg-neutral-900/70 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Flujo recomendado</h2>
          <div className="mt-4 grid gap-3 text-sm text-neutral-300 md:grid-cols-3">
            <div className="rounded-md bg-white/[0.04] p-4">
              <div className="font-semibold text-white">1. Maestro</div>
              <p className="mt-2">Definí familias, tipos y productos activos.</p>
            </div>
            <div className="rounded-md bg-white/[0.04] p-4">
              <div className="font-semibold text-white">2. Histórico</div>
              <p className="mt-2">Cargá unidades vendidas por producto, año y mes.</p>
            </div>
            <div className="rounded-md bg-white/[0.04] p-4">
              <div className="font-semibold text-white">3. Reporte</div>
              <p className="mt-2">Compará MAPE y usá el modelo recomendado.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
