"use client";

import { Minus, Plus, Search } from "lucide-react";
import type { Medication, PrescriptionLineItem } from "@/lib/pharmacy/types";
import { MEDICATION_FORM_LABELS } from "@/lib/pharmacy/types";
import { formatUgx } from "@/lib/portal/constants";
import { cn } from "@/lib/utils";

type MedicationPickerProps = {
  medications: Medication[];
  lineItems: PrescriptionLineItem[];
  onChange: (items: PrescriptionLineItem[]) => void;
  query: string;
  onQueryChange: (q: string) => void;
  disabled?: boolean;
};

export function MedicationPicker({
  medications,
  lineItems,
  onChange,
  query,
  onQueryChange,
  disabled,
}: MedicationPickerProps) {
  function quantityFor(medId: string): number {
    return lineItems.find((l) => l.medicationId === medId)?.quantity ?? 0;
  }

  function setQuantity(medId: string, quantity: number) {
    const next = lineItems.filter((l) => l.medicationId !== medId);
    if (quantity > 0) next.push({ medicationId: medId, quantity });
    onChange(next);
  }

  const filtered = medications.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.strength.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name or SKU…"
          disabled={disabled}
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm focus-ring"
        />
      </div>

      <ul className="max-h-80 space-y-2 overflow-y-auto" role="list">
        {filtered.map((med) => {
          const qty = quantityFor(med.id);
          const outOfStock = med.stockQuantity === 0;
          const lowStock = med.stockQuantity > 0 && med.stockQuantity <= med.reorderLevel;
          return (
            <li
              key={med.id}
              className={cn(
                "rounded-lg border px-3 py-3",
                qty > 0 ? "border-primary bg-accent-cyan-soft/40" : "border-border bg-white",
                outOfStock && "opacity-60",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary">
                    {med.name}{" "}
                    <span className="font-normal text-muted">{med.strength}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {med.sku} · {MEDICATION_FORM_LABELS[med.form]} · {formatUgx(med.unitPriceUgx)}
                    {med.requiresPrescription ? " · Rx required" : ""}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-semibold",
                      outOfStock && "text-red-600",
                      lowStock && !outOfStock && "text-amber-700",
                      !outOfStock && !lowStock && "text-accent-green",
                    )}
                  >
                    {outOfStock
                      ? "Out of stock"
                      : `${med.stockQuantity} in stock${lowStock ? " (low)" : ""}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={disabled || qty === 0}
                    onClick={() => setQuantity(med.id, Math.max(0, qty - 1))}
                    className="rounded border border-border p-1.5 hover:bg-surface disabled:opacity-40 focus-ring"
                    aria-label={`Decrease ${med.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-bold text-primary">
                    {qty}
                  </span>
                  <button
                    type="button"
                    disabled={disabled || outOfStock || qty >= med.stockQuantity}
                    onClick={() => setQuantity(med.id, qty + 1)}
                    className="rounded border border-border p-1.5 hover:bg-surface disabled:opacity-40 focus-ring"
                    aria-label={`Increase ${med.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
