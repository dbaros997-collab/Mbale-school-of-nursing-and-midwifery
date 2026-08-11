"use client";

import { AlertCircle, Check, Lock, Plus, X } from "lucide-react";
import type { UnitEligibility } from "@/services/portal/registration";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { cn } from "@/lib/utils";

type UnitCatalogProps = {
  catalog: UnitEligibility[];
  selectedIds: string[];
  locked: boolean;
  busy: boolean;
  onToggle: (unitId: string) => void;
};

export function UnitCatalog({
  catalog,
  selectedIds,
  locked,
  busy,
  onToggle,
}: UnitCatalogProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Available units
        </h2>
        <p className="mt-1 text-sm text-muted">
          Browse the upcoming semester offer list. Locked units fail prerequisite checks.
        </p>
      </div>

      <ul className="divide-y divide-border">
        {catalog.map(({ unit, selectable, reason, prereqCodes }) => {
          const selected = selectedIds.includes(unit.id);
          const disabled = locked || busy || (!selectable && !selected);

          return (
            <li
              key={unit.id}
              className={cn(
                "flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
                !selectable && "bg-surface/40",
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-primary">{unit.code}</p>
                  <StatusBadge tone="neutral">{unit.credits} cr</StatusBadge>
                  {!selectable ? (
                    <StatusBadge tone="danger">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" aria-hidden />
                        Locked
                      </span>
                    </StatusBadge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{unit.title}</p>
                <p className="mt-1 text-xs text-muted">
                  Prerequisites:{" "}
                  {prereqCodes.length > 0 ? prereqCodes.join(", ") : "None"}
                </p>
                {reason ? (
                  <p className="mt-1.5 inline-flex items-start gap-1.5 text-xs font-medium text-red-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {reason}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                disabled={disabled && !selected}
                onClick={() => onToggle(unit.id)}
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition focus-ring",
                  selected
                    ? "border border-primary bg-primary text-white hover:bg-primary-dark"
                    : selectable && !locked
                      ? "border border-border bg-white text-primary hover:bg-accent-cyan-soft"
                      : "cursor-not-allowed border border-border bg-surface text-muted",
                )}
              >
                {selected ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    Selected
                  </>
                ) : selectable ? (
                  <>
                    <Plus className="h-4 w-4" aria-hidden />
                    Add
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" aria-hidden />
                    Unavailable
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
