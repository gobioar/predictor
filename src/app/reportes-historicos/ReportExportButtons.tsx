"use client";

import { Check, ClipboardCopy, Download } from "lucide-react";
import { useMemo, useState } from "react";

type ExportRow = Record<string, string>;

export function ReportExportButtons({
  filename,
  rows,
}: {
  filename: string;
  rows: ExportRow[];
}) {
  const [copied, setCopied] = useState(false);
  const columns = useMemo(() => Object.keys(rows[0] ?? {}), [rows]);
  const tabText = useMemo(
    () =>
      [
        columns.join("\t"),
        ...rows.map((row) => columns.map((column) => row[column] ?? "").join("\t")),
      ].join("\n"),
    [columns, rows],
  );
  const csvText = useMemo(() => {
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

    return [
      columns.map(escapeCell).join(","),
      ...rows.map((row) => columns.map((column) => escapeCell(row[column] ?? "")).join(",")),
    ].join("\n");
  }, [columns, rows]);

  const copyTable = async () => {
    await navigator.clipboard.writeText(tabText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const exportCsv = () => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copyTable}
        disabled={!rows.length}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm font-semibold text-neutral-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
        {copied ? "Copiado" : "Copiar tabla"}
      </button>
      <button
        type="button"
        onClick={exportCsv}
        disabled={!rows.length}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 px-3 text-sm font-semibold text-neutral-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Download size={16} />
        Exportar CSV
      </button>
    </div>
  );
}
