"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updatePreferredForecastModel } from "@/app/actions";
import {
  forecastMethodLabels,
  type ForecastModelKey,
} from "@/lib/forecast-report";

type SaveState = {
  ok: boolean;
  message: string;
} | null;

const options: Array<{ value: ForecastModelKey | "automatic"; label: string }> = [
  { value: "automatic", label: "Automático" },
  { value: "movingAverage", label: forecastMethodLabels.movingAverage },
  { value: "linear", label: forecastMethodLabels.linear },
  { value: "polynomial", label: forecastMethodLabels.polynomial },
  { value: "holtWinters", label: forecastMethodLabels.holtWinters },
];

export function PreferredForecastModelForm({
  productoId,
  preferredModel,
}: {
  productoId: number;
  preferredModel: ForecastModelKey | null;
}) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<ForecastModelKey | "automatic">(
    preferredModel ?? "automatic",
  );
  const [state, setState] = useState<SaveState>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-4 flex flex-col gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3 md:flex-row md:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await updatePreferredForecastModel(formData);
          setState(result);
          if (result.ok) router.refresh();
        });
      }}
    >
      <input type="hidden" name="productoId" value={productoId} />

      <label className="flex-1 space-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Modelo recomendado
        </span>
        <select
          name="model"
          value={selectedModel}
          onChange={(event) =>
            setSelectedModel(event.target.value as ForecastModelKey | "automatic")
          }
          className="min-h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-sm text-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={17} />
        {isPending ? "Guardando" : "Guardar"}
      </button>

      {state ? (
        <div
          className={
            state.ok
              ? "text-sm font-medium text-emerald-200"
              : "text-sm font-medium text-red-200"
          }
          role="status"
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
