import Link from "next/link";
import { Filter, Save, X } from "lucide-react";
import { savePrecioCostoPeriodo } from "@/app/actions";
import { Alert } from "@/components/Alert";
import { formatMonth } from "@/lib/utils";

type ProductoRow = {
  id: number;
  sku: string;
  nombre: string;
  tipoProduccion: string;
  familia: { id: number; nombre: string };
  tipoProductoVenta: { id: number; nombre: string };
};

type MasterOption = {
  id: number;
  nombre: string;
};

type PeriodoForm = {
  id?: number;
  nombre: string;
  mes: number;
  anio: number;
  items: Array<{
    productoId: number;
    precioVentaPromedio: string;
    costoUnitarioPromedio: string;
  }>;
};

type Filters = {
  q: string;
  familiaId: string;
  tipoProductoVentaId: string;
  tipoProduccion: string;
};

const months = Array.from({ length: 12 }, (_, index) => index + 1);
const tiposProduccion = ["Propio", "Externo"] as const;

export function PrecioCostoPeriodoForm({
  title,
  eyebrow,
  productos,
  familias,
  tipos,
  periodo,
  error,
  formPath,
  filters,
}: {
  title: string;
  eyebrow: string;
  productos: ProductoRow[];
  familias: MasterOption[];
  tipos: MasterOption[];
  periodo: PeriodoForm;
  error?: string;
  formPath: string;
  filters: Filters;
}) {
  const itemMap = new Map(periodo.items.map((item) => [item.productoId, item]));

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        </div>
        <Link
          href="/precios-costos"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-200 hover:bg-white/10"
        >
          <X size={17} />
          Cancelar
        </Link>
      </header>

      <Alert message={error} />

      <form className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 xl:grid-cols-[1.4fr_1.2fr_1.4fr_1fr_auto_auto]">
        <input
          name="q"
          placeholder="Filtrar SKU o producto"
          defaultValue={filters.q}
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
          name="tipoProduccion"
          defaultValue={filters.tipoProduccion}
          className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          <option value="all">Todos los orígenes</option>
          {tiposProduccion.map((tipoProduccion) => (
            <option key={tipoProduccion} value={tipoProduccion}>
              {tipoProduccion}
            </option>
          ))}
        </select>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/10">
          <Filter size={17} />
          Filtrar
        </button>
        <Link
          href={formPath.split("?")[0]}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-300 hover:bg-white/10"
        >
          <X size={17} />
          Limpiar
        </Link>
      </form>

      <form action={savePrecioCostoPeriodo} className="space-y-5">
        {periodo.id ? <input type="hidden" name="id" value={periodo.id} /> : null}
        <input type="hidden" name="formPath" value={formPath} />

        <section className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            name="nombre"
            placeholder="Nombre del período"
            defaultValue={periodo.nombre}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
            required
          />
          <select
            name="mes"
            defaultValue={periodo.mes}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
            required
          >
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
            max="2100"
            defaultValue={periodo.anio}
            className="min-h-11 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
            required
          />
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300">
            <Save size={17} />
            Guardar
          </button>
        </section>

        {productos.length === 0 ? (
          <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            No hay productos activos que coincidan con los filtros.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Familia</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3">Precio venta promedio</th>
                  <th className="px-4 py-3">Costo unitario promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {productos.map((producto) => {
                  const item = itemMap.get(producto.id);

                  return (
                    <tr key={producto.id}>
                      <td className="px-4 py-3 font-medium text-white">{producto.sku}</td>
                      <td className="px-4 py-3 text-neutral-200">{producto.nombre}</td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.familia.nombre}
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.tipoProductoVenta.nombre}
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {producto.tipoProduccion}
                      </td>
                      <td className="px-4 py-3">
                        <input type="hidden" name="productoId" value={producto.id} />
                        <input
                          name={`precioVentaPromedio_${producto.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={item?.precioVentaPromedio ?? 0}
                          className="min-h-10 w-40 rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name={`costoUnitarioPromedio_${producto.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={item?.costoUnitarioPromedio ?? 0}
                          className="min-h-10 w-40 rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
}
