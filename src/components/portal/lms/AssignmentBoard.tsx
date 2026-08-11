"use client";

import { useRef, useState } from "react";
import { Clock, Loader2, Upload, X } from "lucide-react";
import type { AssignmentRow } from "@/services/portal/lms";
import { SubmissionStatusBadge } from "@/components/portal/StatusBadge";
import { cn } from "@/lib/utils";

type AssignmentBoardProps = {
  assignments: AssignmentRow[];
  busyId: string | null;
  onSubmit: (assignmentId: string, fileName: string) => Promise<void>;
};

function formatDue(iso: string) {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AssignmentBoard({ assignments, busyId, onSubmit }: AssignmentBoardProps) {
  const [active, setActive] = useState<AssignmentRow | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function openSubmit(row: AssignmentRow) {
    setActive(row);
    setFileName(row.submission.fileName ?? "");
  }

  async function handleConfirm() {
    if (!active || !fileName) return;
    await onSubmit(active.assignment.id, fileName);
    setActive(null);
    setFileName("");
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Assignments
        </h2>
        <p className="mt-1 text-sm text-muted">
          Track deadlines, upload submissions, and view grading status.
        </p>
      </div>

      <ul className="divide-y divide-border">
        {assignments.map((row) => {
          const busy = busyId === row.assignment.id;
          return (
            <li key={row.assignment.id} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-primary">{row.assignment.title}</p>
                    <SubmissionStatusBadge status={row.submission.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {row.courseCode} · {row.courseTitle} · Max {row.assignment.maxScore} pts
                  </p>
                  <p className="mt-1 text-xs text-muted">Due {formatDue(row.assignment.dueAt)}</p>
                  {row.submission.fileName ? (
                    <p className="mt-1 text-xs font-medium text-foreground">
                      File: {row.submission.fileName}
                      {row.submission.status === "graded" && row.submission.score != null
                        ? ` · Score: ${row.submission.score}/${row.assignment.maxScore}`
                        : null}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold",
                      row.isOverdue
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800",
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {row.countdownLabel}
                  </span>

                  {row.canSubmit ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => openSubmit(row)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50 focus-ring"
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <Upload className="h-4 w-4" aria-hidden />
                      )}
                      {row.submission.status === "submitted" ? "Resubmit" : "Submit"}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-accent-green">Graded</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-title"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="submit-title" className="text-lg font-bold text-primary">
                  Submit assignment
                </h3>
                <p className="mt-1 text-sm text-muted">{active.assignment.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-md p-1.5 text-muted hover:bg-surface focus-ring"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center transition hover:border-accent-cyan">
              <Upload className="h-6 w-6 text-primary" aria-hidden />
              <span className="mt-2 text-sm font-medium text-primary">
                {fileName || "Choose PDF or DOCX file"}
              </span>
              <span className="mt-1 text-xs text-muted">Mock upload — file stays on your device</span>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFileName(file?.name ?? "");
                }}
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-primary hover:bg-surface focus-ring"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!fileName || busyId === active.assignment.id}
                onClick={() => void handleConfirm()}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 focus-ring"
              >
                {busyId === active.assignment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                Upload & submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
