"use client";

import { FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PrescriptionUploadZoneProps = {
  fileName: string | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
};

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

export function PrescriptionUploadZone({
  fileName,
  onFileSelect,
  disabled,
  className,
}: PrescriptionUploadZoneProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition",
          disabled
            ? "cursor-not-allowed border-border bg-surface/50 opacity-60"
            : "border-brand-sky/50 bg-accent-cyan-soft/30 hover:border-primary hover:bg-accent-cyan-soft/50",
        )}
      >
        <FileUp className="h-10 w-10 text-primary" aria-hidden />
        <p className="mt-3 text-sm font-semibold text-primary">
          {fileName ?? "Upload prescription image or PDF"}
        </p>
        <p className="mt-1 text-xs text-muted">
          JPG, PNG, WEBP, or PDF — max 10 MB
        </p>
        <input
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onFileSelect(file);
          }}
        />
      </label>
      {fileName ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm">
          <span className="truncate font-medium text-foreground">{fileName}</span>
          <button
            type="button"
            className="ml-2 shrink-0 rounded p-1 text-muted hover:bg-surface hover:text-primary focus-ring"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
