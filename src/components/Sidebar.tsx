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
  LogOut,
  Package,
  Settings2,
  Tags,
} from "lucide-react";
import { logoutAction } from "@/app/actions";
import type { CurrentUser } from "@/lib/auth";
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

export function Sidebar({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-white/10 bg-[#363636] px-4 py-5">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#32aa93,#7cbf81)] text-white shadow-lg shadow-[#32aa93]/20">
          <BarChart3 size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cbf81]">
            GoBio
          </div>
          <div className="text-lg font-semibold text-white">Predictor</div>
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
                active && "bg-[#32aa93]/20 text-white shadow-inner shadow-white/5",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="px-2">
          <div className="truncate text-sm font-semibold text-white">
            {user?.name ?? "Usuario"}
          </div>
          <div className="mt-1 truncate text-xs text-neutral-400">{user?.email}</div>
        </div>
        <form action={logoutAction} className="mt-3">
          <button className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
