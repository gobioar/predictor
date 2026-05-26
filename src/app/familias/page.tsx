import { Plus, Save, Trash2 } from "lucide-react";
import { Alert } from "@/components/Alert";
import { EmptyState } from "@/components/EmptyState";
import { createFamilia, deleteFamilia, updateFamilia } from "@/app/actions";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function FamiliasPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const familias = await prisma.familiaProducto.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { productos: true } } },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Maestro
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Familias de productos</h1>
      </header>
      <Alert message={params?.error} />

      <form action={createFamilia} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-900/75 p-4 md:flex-row">
        <input
          name="nombre"
          placeholder="Nueva familia"
          className="min-h-11 flex-1 rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
          required
        />
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300">
          <Plus size={17} />
          Crear
        </button>
      </form>

      {familias.length === 0 ? (
        <EmptyState title="Sin familias" detail="Creá la primera familia para poder clasificar productos." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900/75">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {familias.map((familia) => (
                <tr key={familia.id}>
                  <td className="px-4 py-3">
                    <form id={`update-familia-${familia.id}`} action={updateFamilia}>
                      <input type="hidden" name="id" value={familia.id} />
                      <input
                        name="nombre"
                        defaultValue={familia.nombre}
                        className="min-h-10 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-white"
                        required
                      />
                    </form>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{familia._count.productos}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button form={`update-familia-${familia.id}`} className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 text-neutral-200 hover:bg-white/10" title="Guardar">
                        <Save size={17} />
                      </button>
                      <form action={deleteFamilia}>
                        <input type="hidden" name="id" value={familia.id} />
                        <button className="inline-flex size-10 items-center justify-center rounded-md border border-red-400/20 text-red-200 hover:bg-red-500/10" title="Eliminar">
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
