import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type LiveFinanceIndicatorProps = {
  mode: "polling" | "realtime" | "broadcast";
  className?: string;
};

const labels = {
  polling: "Auto-updating",
  realtime: "Live",
  broadcast: "Updated",
} as const;

export function LiveFinanceIndicator({ mode, className }: LiveFinanceIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-green/30 bg-accent-green-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-green",
        className,
      )}
      title="Fee ledger syncs when finance approves payments or balances change"
    >
      <Radio className="h-3 w-3 animate-pulse" aria-hidden />
      {labels[mode]}
    </span>
  );
}
