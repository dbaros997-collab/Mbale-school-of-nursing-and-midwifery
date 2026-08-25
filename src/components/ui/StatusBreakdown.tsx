import { CHART_TINTS } from "@/lib/brand/tints";
import type { OrderStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type StatusBreakdownItem = {
  status: OrderStatus | string;
  label: string;
  count: number;
};

type StatusBreakdownProps = {
  items: StatusBreakdownItem[];
  className?: string;
  caption?: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: CHART_TINTS[2],
  processing: CHART_TINTS[0],
  completed: CHART_TINTS[1],
  cancelled: "#94a3b8",
  failed: "#dc2626",
};

/** Stacked horizontal bar showing proportional status counts. */
export function StatusBreakdown({ items, className, caption }: StatusBreakdownProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <figure className={cn("space-y-4", className)}>
      {caption ? (
        <figcaption className="text-xs font-semibold uppercase tracking-wider text-muted">
          {caption}
        </figcaption>
      ) : null}

      <div
        className="flex h-3 overflow-hidden rounded-full"
        style={{ background: "var(--tint-navy-50)" }}
        role="img"
        aria-label={`Order status breakdown: ${items.map((i) => `${i.label} ${i.count}`).join(", ")}`}
      >
        {items.map((item) => {
          if (item.count === 0) return null;
          const width = `${(item.count / total) * 100}%`;
          const color = STATUS_COLORS[item.status] ?? CHART_TINTS[3];
          return (
            <div
              key={item.status}
              className="h-full transition-all duration-500"
              style={{ width, backgroundColor: color }}
              title={`${item.label}: ${item.count}`}
            />
          );
        })}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2" role="list">
        {items.map((item, index) => {
          const color = STATUS_COLORS[item.status] ?? CHART_TINTS[index % CHART_TINTS.length];
          const pct = Math.round((item.count / total) * 100);
          return (
            <li key={item.status} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
                <span className="truncate font-medium text-foreground">{item.label}</span>
              </span>
              <span className="shrink-0 font-semibold text-primary">
                {item.count}
                <span className="ml-1 text-xs font-normal text-muted">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
