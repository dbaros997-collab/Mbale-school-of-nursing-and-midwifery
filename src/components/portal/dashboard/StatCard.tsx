import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  Icon: ComponentType<{ className?: string }>;
  tone?: "default" | "danger" | "success";
};

export function StatCard({ label, value, hint, Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="data-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
          <p
            className={cn(
              "mt-2 text-2xl font-extrabold tracking-tight",
              tone === "danger" && "text-red-600",
              tone === "success" && "text-accent-green",
              tone === "default" && "text-primary",
            )}
          >
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tone === "danger" && "bg-red-100 text-red-600",
            tone === "success" && "bg-accent-green-soft text-accent-green",
            tone === "default" && "bg-accent-cyan-soft text-primary",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  );
}
