import Link from "next/link";
import { Save, X } from "lucide-react";
import { saveVentaPeriodo } from "@/app/actions";
import { Alert } from "@/components/Alert";
import { formatMonth } from "@/lib/utils";

type ProductoRow = {
  id: number;
  sku: string;
  nombre: string;
  familia: { nombre: string };
  tipoProductoVenta: { nombre: string };
};

type PeriodoForm = {
  id?: number;
  nombre: string;
  mes: number;
  anio: number;
  items: Array<{ productoId: number; unidadesVendidas: number }>;
};

const months = Array.from({ length: 12 }, (_, index) => index + 1);

export function VentaPeriodoForm({
  title,
  eyebrow,
  productos,
  periodo,
  error,
  formPath,
}: {
  title: string;
  eyebrow: string;
  productos: ProductoRow[];
  periodo: PeriodoForm;
  error?: string;
  formPath: string;
}) {
  const itemMap = new Map(
    periodo.items.map((item) => [item.productoId, item.unidadesVendidas]),
  );

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
          href="/ventas"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-neutral-200 hover:bg-white/10"
        >
          <X size={17} />
          Cancelar
        </Link>
      </header>
      <Alert message={error} />

      <form action={saveVentaPeriodo} className="space-y-5">
        {periodo.id ? <input type="hidden" name="id" value={periodo.id} /> : null}
        <input type="hidden" name="formPath" value={formPath} />

        <section className="grid gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            name="nombre"
            placeholder="Nombre del mes de ventas"
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
            Creá productos activos antes de cargar un mes de ventas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-neutral-900/75">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Familia</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Unidades vendidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="px-4 py-3 font-medium text-white">{producto.sku}</td>
                    <td className="px-4 py-3 text-neutral-200">{producto.nombre}</td>
                    <td className="px-4 py-3 text-neutral-300">
                      {producto.familia.nombre}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {producto.tipoProductoVenta.nombre}
                    </td>
                    <td className="px-4 py-3">
                      <input type="hidden" name="productoId" value={producto.id} />
                      <input
                        name={`unidades_${producto.id}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={itemMap.get(producto.id) ?? 0}
                        className="min-h-10 w-40 rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </div>
  );
}
