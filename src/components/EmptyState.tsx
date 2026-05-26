import { Inbox } from "lucide-react";

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[#cad2dd]/25 bg-[#cad2dd]/10 p-8 text-center">
      <Inbox className="mb-3 text-[#7cbf81]" size={34} />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-neutral-400">{detail}</p>
    </div>
  );
}
