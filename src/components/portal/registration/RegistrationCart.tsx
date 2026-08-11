"use client";

import { BookOpenCheck, Loader2, RotateCcw, Send } from "lucide-react";
import type { CourseUnit, SemesterRegistration } from "@/lib/portal/schema";
import { REGISTRATION_STATUS_LABELS } from "@/lib/portal/constants";
import { RegistrationStatusBadge } from "@/components/portal/StatusBadge";
import { cn } from "@/lib/utils";

type RegistrationCartProps = {
  semesterLabel: string;
  registration: SemesterRegistration;
  selectedUnits: CourseUnit[];
  totalCredits: number;
  minCredits: number;
  maxCredits: number;
  validationErrors: string[];
  canSubmit: boolean;
  busy: boolean;
  message: string | null;
  onSubmit: () => void;
  onReopen: () => void;
  onRemove: (unitId: string) => void;
};

export function RegistrationCart({
  semesterLabel,
  registration,
  selectedUnits,
  totalCredits,
  minCredits,
  maxCredits,
  validationErrors,
  canSubmit,
  busy,
  message,
  onSubmit,
  onReopen,
  onRemove,
}: RegistrationCartProps) {
  const locked =
    registration.status === "submitted" || registration.status === "approved";
  const loadTone =
    totalCredits > maxCredits
      ? "text-red-600"
      : totalCredits > 0 && totalCredits < minCredits
        ? "text-amber-700"
        : "text-primary";

  return (
    <aside className="rounded-xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Your registration
          </h2>
          <p className="mt-1 text-sm text-muted">{semesterLabel}</p>
        </div>
        <RegistrationStatusBadge status={registration.status} />
      </div>

      <div className="mt-4 rounded-lg bg-surface px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Credit load</p>
        <p className={cn("mt-1 text-2xl font-extrabold", loadTone)}>
          {totalCredits}
          <span className="text-sm font-semibold text-muted">
            {" "}
            / {maxCredits} max
          </span>
        </p>
        <p className="mt-1 text-xs text-muted">Minimum required: {minCredits} credits</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              totalCredits > maxCredits ? "bg-red-500" : "bg-primary",
            )}
            style={{
              width: `${Math.min(100, (totalCredits / maxCredits) * 100)}%`,
            }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {selectedUnits.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
            <BookOpenCheck className="mx-auto h-6 w-6 text-muted" aria-hidden />
            <p className="mt-2">No units selected yet</p>
          </li>
        ) : (
          selectedUnits.map((unit) => (
            <li
              key={unit.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-primary">{unit.code}</p>
                <p className="truncate text-xs text-muted">
                  {unit.title} · {unit.credits} cr
                </p>
              </div>
              {!locked ? (
                <button
                  type="button"
                  onClick={() => onRemove(unit.id)}
                  disabled={busy}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 focus-ring"
                >
                  Remove
                </button>
              ) : null}
            </li>
          ))
        )}
      </ul>

      {validationErrors.length > 0 ? (
        <ul className="mt-4 space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-900">
          {validationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-lg border border-accent-green/30 bg-accent-green-soft px-3 py-3 text-sm font-medium text-accent-green">
          {message}
        </p>
      ) : null}

      <div className="mt-5 space-y-2">
        {!locked ? (
          <button
            type="button"
            disabled={!canSubmit || busy}
            onClick={onSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
            Submit for approval
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={onReopen}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-3 text-sm font-bold text-primary transition hover:bg-surface focus-ring"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reopen draft (demo)
          </button>
        )}
        <p className="text-center text-[11px] text-muted">
          {locked
            ? REGISTRATION_STATUS_LABELS[registration.status]
            : "Digital workflow — no paperwork required"}
        </p>
      </div>
    </aside>
  );
}
