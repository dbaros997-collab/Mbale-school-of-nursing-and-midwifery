"use client";

import type { StockValidationResult } from "@/lib/pharmacy/types";
import { cn } from "@/lib/utils";

type StockValidationPanelProps = {
  validation: StockValidationResult | null;
  loading?: boolean;
};

export function StockValidationPanel({ validation, loading }: StockValidationPanelProps) {
  if (loading) {
    return (
      <p className="text-sm text-muted" role="status">
        Checking stock availability…
      </p>
    );
  }
  if (!validation) return null;

  return (
    <div className="space-y-3">
      {validation.lineResults.length > 0 ? (
        <ul className="space-y-2" role="list">
          {validation.lineResults.map((line) => (
            <li
              key={line.medicationId}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                line.sufficient
                  ? "border-accent-green/30 bg-accent-green-soft/50"
                  : "border-red-200 bg-red-50",
              )}
            >
              <span className="font-medium text-foreground">{line.medicationName}</span>
              <span
                className={cn(
                  "font-semibold",
                  line.sufficient ? "text-accent-green" : "text-red-600",
                )}
              >
                {line.requested} req · {line.available} avail
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {validation.errors.map((err) => (
        <p key={err} className="text-sm font-medium text-red-700" role="alert">
          {err}
        </p>
      ))}

      {validation.warnings.map((warn) => (
        <p key={warn} className="text-sm text-amber-800" role="status">
          {warn}
        </p>
      ))}

      {validation.valid ? (
        <p className="text-sm font-semibold text-accent-green" role="status">
          All items available — order can be submitted automatically.
        </p>
      ) : null}
    </div>
  );
}
