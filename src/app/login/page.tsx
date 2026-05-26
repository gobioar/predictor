import { BarChart3, LogIn } from "lucide-react";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { Alert } from "@/components/Alert";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (user) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-900/80 p-6 shadow-2xl shadow-black/25">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-400 text-neutral-950">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Predictor GoBio
            </p>
            <h1 className="text-2xl font-semibold text-white">Iniciar sesión</h1>
          </div>
        </div>

        <Alert message={params?.error} />

        <form action={loginAction} className="mt-5 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-300">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
              placeholder="admin@gobio.ar"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-neutral-300">Contraseña</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white placeholder:text-neutral-500"
              placeholder="Tu contraseña"
            />
          </label>

          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300">
            <LogIn size={17} />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
