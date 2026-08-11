"use client";

import { Download, FileText, FileType } from "lucide-react";
import type { MaterialRow } from "@/services/portal/lms";
import { downloadMaterial } from "@/services/portal/lms";
import { StatusBadge } from "@/components/portal/StatusBadge";

type MaterialsListProps = {
  materials: MaterialRow[];
};

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function MaterialsList({ materials }: MaterialsListProps) {
  async function handleDownload(id: string) {
    const result = await downloadMaterial(id);
    if (result.ok && result.blob && result.fileName) {
      triggerBrowserDownload(result.blob, result.fileName);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Course materials
        </h2>
        <p className="mt-1 text-sm text-muted">
          Lecture notes and templates available for download (PDF / DOCX).
        </p>
      </div>

      <ul className="divide-y divide-border">
        {materials.map((m) => (
          <li
            key={m.id}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-cyan-soft text-primary">
                {m.fileType === "pdf" ? (
                  <FileText className="h-5 w-5" aria-hidden />
                ) : (
                  <FileType className="h-5 w-5" aria-hidden />
                )}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground">{m.title}</p>
                  <StatusBadge tone="neutral">{m.fileType.toUpperCase()}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {m.courseCode} · {m.courseTitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleDownload(m.id)}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-primary transition hover:bg-accent-cyan-soft focus-ring"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
