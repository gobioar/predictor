"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ChartNoAxesCombined,
  Database,
  Gauge,
  Grid3X3,
  Package,
  Settings2,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/familias", label: "Familias", icon: Boxes },
  { href: "/tipos-producto", label: "Tipos de Producto", icon: Tags },
  { href: "/productos", label: "Productos", icon: Package },
  { href: "/ventas", label: "Ventas Mensuales", icon: Database },
  { href: "/configuracion", label: "Configuración Forecast", icon: Settings2 },
  { href: "/reporte", label: "Reporte Predictivo", icon: ChartNoAxesCombined },
  { href: "/matriz-forecast", label: "Matriz Forecast", icon: Grid3X3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-white/10 bg-neutral-950 px-4 py-5">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-400 text-neutral-950">
          <BarChart3 size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Predictor
          </div>
          <div className="text-lg font-semibold text-white">Demand SaaS</div>
        </div>
      </Link>

      <nav className="space-y-1">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white",
                active && "bg-white/10 text-white shadow-inner shadow-white/5",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
