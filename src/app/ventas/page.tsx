import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Copy, Edit, Filter, Plus, Trash2, X } from "lucide-react";
import { deleteVentaPeriodo } from "@/app/actions";
import { Alert } from "@/components/Alert";
import { EmptyState } from "@/components/EmptyState";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMonth } from "@/lib/utils";

const months = Array.from({ length: 12 }, (_, index) => index + 1);
const pageSize = 12;

export default async function VentasPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    nombre?: string;
    mes?: string;
    anio?: string;
    page?: string;
  }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const filters = {
    nombre: params?.nombre?.trim() ?? "",
    mes: params?.mes ?? "",
    anio: params?.anio?.trim() ?? "",
  };
  const page = Math.max(1, Number(params?.page ?? 1) || 1);
  const where: Prisma.VentaMensualPeriodoWhereInput = {
    ...(filters.nombre ? { nombre: { contains: filters.nombre } } : {}),
    ...(filters.mes ? { mes: Number(filters.mes) } : {}),
    ...(filters.anio ? { anio: Number(filters.anio) } : {}),
  };

  const [periodos, totalPeriodos] = await Promise.all([
    prisma.ventaMensualPeriodo.findMany({
      where,
      orderBy: [{ anio: "desc" }, { mes: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        items: { select: { unidadesVendidas: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.ventaMensualPeriodo.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalPeriodos / pageSize));
  const currentSearchParams = new URLSearchParams();

  if (filters.nombre) currentSearchParams.set("nombre", filters.nombre);
  if (filters.mes) currentSearchParams.set("mes", filters.mes);
  if (filters.anio) currentSearchParams.set("anio", filters.anio);

  const currentPath = `/ventas${
    currentSearchParams.toString() ? `?${currentSearchParams.toString()}` : ""
  }`;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            Histórico
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Ventas mensuales</h1>
        </div>
        <Link
          href="/ventas/nuevo"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300"
        >
          <Plus size={17} />
          Nuevo
        </Link>
      </header>
      <Alert message={params?.error} />

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
        <input
          name="nombre"
          placeholder="Buscar por nombre"
          defaultValue={filters.nombre}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
        />
        <select
          name="mes"
          defaultValue={filters.mes}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Todos los meses</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonth(2024, month).split(" ")[0]}
            </option>
          ))}
        </select>
        <input
          name="anio"
          type="number"
          min="2000"
          placeholder="Año"
          defaultValue={filters.anio}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
        />
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href="/ventas"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      {periodos.length === 0 ? (
        <EmptyState
          title="Sin meses de ventas"
          detail="Creá un mes de ventas para cargar unidades de todos los productos en una sola tabla."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Mes</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Productos cargados</th>
                <th className="px-4 py-3">Total unidades vendidas</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {periodos.map((periodo) => {
                const totalUnidades = periodo.items.reduce(
                  (sum, item) => sum + item.unidadesVendidas,
                  0,
                );

                return (
                  <tr key={periodo.id}>
                    <td className="px-4 py-3 font-medium text-white">{periodo.nombre}</td>
                    <td className="px-4 py-3 text-neutral-300">
                      {formatMonth(2024, periodo.mes).split(" ")[0]}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{periodo.anio}</td>
                    <td className="px-4 py-3 text-neutral-300">{periodo._count.items}</td>
                    <td className="px-4 py-3 text-neutral-300">
                      {totalUnidades.toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/ventas/${periodo.id}`}
                          className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-neutral-200 hover:bg-white/10"
                          title="Editar"
                        >
                          <Edit size={17} />
                        </Link>
                        <Link
                          href={`/ventas/nuevo?duplicar=${periodo.id}`}
                          className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-neutral-200 hover:bg-white/10"
                          title="Duplicar"
                        >
                          <Copy size={17} />
                        </Link>
                        <form action={deleteVentaPeriodo}>
                          <input type="hidden" name="id" value={periodo.id} />
                          <input type="hidden" name="returnTo" value={currentPath} />
                          <button
                            className="inline-flex size-10 items-center justify-center rounded-md border border-red-400/20 text-red-200 hover:bg-red-500/10"
                            title="Borrar"
                          >
                            <Trash2 size={17} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-900/75 px-4 py-3 text-sm text-neutral-300">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/ventas?${new URLSearchParams({
                ...Object.fromEntries(currentSearchParams),
                page: String(Math.max(1, page - 1)),
              }).toString()}`}
              className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10"
            >
              Anterior
            </Link>
            <Link
              href={`/ventas?${new URLSearchParams({
                ...Object.fromEntries(currentSearchParams),
                page: String(Math.min(totalPages, page + 1)),
              }).toString()}`}
              className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/10"
            >
              Siguiente
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
