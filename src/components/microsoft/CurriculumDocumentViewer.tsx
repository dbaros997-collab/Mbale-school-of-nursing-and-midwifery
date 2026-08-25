"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { refreshMicrosoftTokenIfNeeded } from "@/lib/microsoft/client-token-sync";
import type { GraphDriveItem } from "@/lib/microsoft/types";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdfItem(item: GraphDriveItem) {
  return item.mimeType === "application/pdf" || item.name.toLowerCase().endsWith(".pdf");
}

export function CurriculumDocumentViewer() {
  const [items, setItems] = useState<GraphDriveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshMicrosoftTokenIfNeeded();
    const response = await fetch("/api/microsoft/graph/dashboard", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load curriculum documents.");
    const bundle = (await response.json()) as { curriculumItems: GraphDriveItem[]; error?: string };
    if (bundle.error && bundle.curriculumItems.length === 0) {
      throw new Error(bundle.error);
    }
    return bundle.curriculumItems.filter((item) => !item.isFolder);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load()
      .then((files) => {
        if (!cancelled) {
          setItems(files);
          setSelectedId(files[0]?.id ?? null);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load documents.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const files = await load();
      setItems(files);
      if (!files.some((f) => f.id === selectedId)) {
        setSelectedId(files[0]?.id ?? null);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  const selected = items.find((item) => item.id === selectedId) ?? null;
  const previewUrl = selected && isPdfItem(selected) ? `/api/microsoft/graph/files/${selected.id}` : null;

  return (
    <section className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-primary" aria-hidden />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Curriculum notes (OneDrive / SharePoint)
            </h2>
            <p className="text-xs text-muted">Shared nursing &amp; midwifery resources from MBSNM</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 px-5 py-10 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading shared curriculum documents…
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mx-5 my-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      ) : items.length === 0 ? (
        <p className="px-5 py-10 text-sm text-muted">
          No curriculum files found. Configure{" "}
          <code className="text-xs">MICROSOFT_SHAREPOINT_DRIVE_ID</code> and{" "}
          <code className="text-xs">MICROSOFT_CURRICULUM_FOLDER_PATH</code> in your environment.
        </p>
      ) : (
        <div className="grid gap-0 lg:grid-cols-[minmax(220px,280px)_1fr]">
          <ul className="divide-y divide-border border-b border-border lg:border-b-0 lg:border-r">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={
                    selectedId === item.id
                      ? "flex w-full items-start gap-2 bg-accent-cyan-soft px-4 py-3 text-left text-sm"
                      : "flex w-full items-start gap-2 px-4 py-3 text-left text-sm hover:bg-surface"
                  }
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block font-semibold text-primary">{item.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {formatFileSize(item.size)} ·{" "}
                      {new Date(item.lastModified).toLocaleDateString("en-UG")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="min-h-[420px] p-4">
            {selected ? (
              <>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-primary">{selected.name}</p>
                  {selected.webUrl ? (
                    <a
                      href={selected.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Open in Microsoft 365
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : null}
                </div>

                {previewUrl ? (
                  <iframe
                    title={selected.name}
                    src={previewUrl}
                    className="h-[min(70vh,560px)] w-full rounded-lg border border-border bg-surface"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="flex h-[min(70vh,560px)] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 text-center">
                    <FileText className="h-10 w-10 text-muted" aria-hidden />
                    <p className="mt-3 text-sm text-muted">
                      Inline preview is available for PDF files. Open this document in Microsoft 365
                      to view Word, PowerPoint, or Excel files securely.
                    </p>
                    {selected.webUrl ? (
                      <a
                        href={selected.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                      >
                        Open document
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </a>
                    ) : null}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted">Select a document to preview.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
