import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Filter, Plus, Save, Trash2, X } from "lucide-react";
import { Alert } from "@/components/Alert";
import { EmptyState } from "@/components/EmptyState";
import { createProducto, deleteProducto, updateProducto } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    sku?: string;
    nombre?: string;
    familiaId?: string;
    tipoProductoVentaId?: string;
    activo?: string;
  }>;
}) {
  const params = await searchParams;
  const filters = {
    sku: params?.sku?.trim() ?? "",
    nombre: params?.nombre?.trim() ?? "",
    familiaId: params?.familiaId ?? "",
    tipoProductoVentaId: params?.tipoProductoVentaId ?? "",
    activo: params?.activo ?? "all",
  };
  const where: Prisma.ProductoWhereInput = {
    ...(filters.sku ? { sku: { contains: filters.sku } } : {}),
    ...(filters.nombre ? { nombre: { contains: filters.nombre } } : {}),
    ...(filters.familiaId ? { familiaId: Number(filters.familiaId) } : {}),
    ...(filters.tipoProductoVentaId
      ? { tipoProductoVentaId: Number(filters.tipoProductoVentaId) }
      : {}),
    ...(filters.activo === "true" ? { activo: true } : {}),
    ...(filters.activo === "false" ? { activo: false } : {}),
  };

  const [familias, tipos] = await Promise.all([
    prisma.familiaProducto.findMany({ orderBy: { nombre: "asc" } }),
    prisma.tipoProductoVenta.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  const productos = await prisma.producto.findMany({
    where,
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    include: {
      familia: true,
      tipoProductoVenta: true,
    },
  });

  const masterReady = familias.length > 0 && tipos.length > 0;
  const hasFilters =
    Boolean(filters.sku) ||
    Boolean(filters.nombre) ||
    Boolean(filters.familiaId) ||
    Boolean(filters.tipoProductoVentaId) ||
    filters.activo !== "all";
  const currentSearchParams = new URLSearchParams();

  if (filters.sku) currentSearchParams.set("sku", filters.sku);
  if (filters.nombre) currentSearchParams.set("nombre", filters.nombre);
  if (filters.familiaId) currentSearchParams.set("familiaId", filters.familiaId);
  if (filters.tipoProductoVentaId) {
    currentSearchParams.set("tipoProductoVentaId", filters.tipoProductoVentaId);
  }
  if (filters.activo !== "all") currentSearchParams.set("activo", filters.activo);

  const currentPath = `/productos${
    currentSearchParams.toString() ? `?${currentSearchParams.toString()}` : ""
  }`;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Catálogo
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Productos de venta</h1>
      </header>
      <Alert message={params?.error} />

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 lg:grid-cols-[1fr_1.5fr_1.2fr_1.4fr_1fr_auto_auto]">
        <input
          name="sku"
          placeholder="Filtrar SKU"
          defaultValue={filters.sku}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
        />
        <input
          name="nombre"
          placeholder="Filtrar nombre"
          defaultValue={filters.nombre}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
        />
        <select
          name="familiaId"
          defaultValue={filters.familiaId}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="">Todas las familias</option>
          {familias.map((familia) => (
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
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <select
          name="activo"
          defaultValue={filters.activo}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="all">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      <form
        action={createProducto}
        className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 lg:grid-cols-[1fr_2fr_1.4fr_1.4fr_auto_auto]"
      >
        <input
          name="sku"
          placeholder="SKU"
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
          required
        />
        <input
          name="nombre"
          placeholder="Nombre"
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
          required
        />
        <select
          name="familiaId"
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          required
        >
          <option value="">Familia</option>
          {familias.map((familia) => (
            <option key={familia.id} value={familia.id}>
              {familia.nombre}
            </option>
          ))}
        </select>
        <select
          name="tipoProductoVentaId"
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
          required
        >
          <option value="">Tipo</option>
          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-neutral-200">
          <input
            name="activo"
            type="checkbox"
            defaultChecked
            className="size-4 accent-emerald-400"
          />
          Activo
        </label>
        <button
          disabled={!masterReady}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} />
          Crear
        </button>
      </form>

      {!masterReady && (
        <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Creá al menos una familia y un tipo de producto antes de cargar productos.
        </div>
      )}

      {productos.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Sin resultados" : "Sin productos"}
          detail={
            hasFilters
              ? "No hay productos que coincidan con los filtros aplicados."
              : "Agregá productos para empezar a cargar ventas históricas."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Familia</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="px-4 py-3">
                    <form
                      id={`update-producto-${producto.id}`}
                      action={updateProducto}
                      className="contents"
                    >
                      <input type="hidden" name="id" value={producto.id} />
                      <input
                        name="sku"
                        defaultValue={producto.sku}
                        className="min-h-10 w-32 rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                        required
                      />
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={`update-producto-${producto.id}`}
                      name="nombre"
                      defaultValue={producto.nombre}
                      className="min-h-10 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      form={`update-producto-${producto.id}`}
                      name="familiaId"
                      defaultValue={producto.familiaId}
                      className="min-h-10 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                    >
                      {familias.map((familia) => (
                        <option key={familia.id} value={familia.id}>
                          {familia.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      form={`update-producto-${producto.id}`}
                      name="tipoProductoVentaId"
                      defaultValue={producto.tipoProductoVentaId}
                      className="min-h-10 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                    >
                      {tipos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={`update-producto-${producto.id}`}
                      name="activo"
                      type="checkbox"
                      defaultChecked={producto.activo}
                      className="size-4 accent-emerald-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        form={`update-producto-${producto.id}`}
                        className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-neutral-200 hover:bg-white/10"
                        title="Guardar"
                      >
                        <Save size={17} />
                      </button>
                      <form action={deleteProducto}>
                        <input type="hidden" name="id" value={producto.id} />
                        <input type="hidden" name="returnTo" value={currentPath} />
                        <button
                          className="inline-flex size-10 items-center justify-center rounded-md border border-red-400/20 text-red-200 hover:bg-red-500/10"
                          title="Eliminar"
                        >
                          <Trash2 size={17} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
