"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, FilePlus2, Loader2, RefreshCw } from "lucide-react";
import {
  DOCUMENT_TYPE_LABELS,
  getDocumentsBundle,
  markDocumentDownloaded,
  requestDocument,
  type DocumentType,
  type DocumentsBundle,
} from "@/services/portal/documents";
import { DocumentStatusBadge } from "@/components/portal/StatusBadge";
import { Button } from "@/components/ui/Button";

const TYPES: DocumentType[] = ["testimonial", "recommendation", "admission_letter"];

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DocumentsPage() {
  const [data, setData] = useState<DocumentsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>("testimonial");
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const bundle = await getDocumentsBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => {
      void getDocumentsBundle().then(setData);
    }, 4000);
    return () => clearInterval(id);
  }, [load]);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFlash(null);
    const result = await requestDocument(selectedType);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    setBusy(false);
  }

  async function handleDownload(id: string) {
    setBusy(true);
    setFlash(null);
    const result = await markDocumentDownloaded(id);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    if (result.ok && result.blob && result.fileName) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Registry
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
          Document requests
        </h1>
        <p className="mt-1 text-sm text-muted">
          Request testimonials, recommendation letters, or admission letter copies — track
          Processing → Ready → Download.
        </p>
      </div>

      {flash ? (
        <p
          role="status"
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
        >
          {flash.text}
        </p>
      ) : null}

      <form
        onSubmit={handleRequest}
        className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          New request
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={
                selectedType === type
                  ? "rounded-lg border border-primary bg-accent-cyan-soft px-3 py-3 text-left text-sm font-semibold text-primary"
                  : "rounded-lg border border-border bg-white px-3 py-3 text-left text-sm font-semibold text-muted hover:bg-surface"
              }
            >
              {DOCUMENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
        <Button type="submit" variant="primary" disabled={busy} className="mt-4">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <FilePlus2 className="h-4 w-4" aria-hidden />
          )}
          Submit request
        </Button>
      </form>

      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Your requests
          </h2>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Refresh
          </button>
        </div>

        {loading || !data ? (
          <div className="h-40 animate-pulse bg-surface" />
        ) : data.requests.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">No document requests yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.requests.map((req) => (
              <li
                key={req.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-primary">{DOCUMENT_TYPE_LABELS[req.type]}</p>
                  <p className="mt-1 text-xs text-muted">
                    Requested {formatWhen(req.requestedAt)}
                    {req.readyAt ? ` · Ready ${formatWhen(req.readyAt)}` : ""}
                  </p>
                  <div className="mt-2">
                    <DocumentStatusBadge status={req.status} />
                  </div>
                </div>
                {req.status === "ready" || req.status === "downloaded" ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDownload(req.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-accent-cyan-soft disabled:opacity-50 focus-ring"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {req.status === "downloaded" ? "Download again" : "Download"}
                  </button>
                ) : (
                  <p className="text-xs font-medium text-amber-800">
                    Registry is preparing your document…
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
