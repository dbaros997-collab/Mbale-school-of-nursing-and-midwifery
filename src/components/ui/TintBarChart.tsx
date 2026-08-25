import { CHART_TINTS } from "@/lib/brand/tints";
import { cn } from "@/lib/utils";

export type TintBarItem = {
  label: string;
  value: number;
  formattedValue?: string;
};

type TintBarChartProps = {
  items: TintBarItem[];
  className?: string;
  caption?: string;
};

/** Horizontal bar chart using approved MBSNM tint scales only. */
export function TintBarChart({ items, className, caption }: TintBarChartProps) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <figure className={cn("space-y-3", className)}>
      {caption ? (
        <figcaption className="text-xs font-semibold uppercase tracking-wider text-muted">
          {caption}
        </figcaption>
      ) : null}
      <ul className="space-y-3" role="list">
        {items.map((item, index) => {
          const width = `${Math.round((item.value / max) * 100)}%`;
          const color = CHART_TINTS[index % CHART_TINTS.length];
          return (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="font-semibold text-primary">
                  {item.formattedValue ?? item.value}
                </span>
              </div>
              <div
                className="mt-1.5 h-2.5 overflow-hidden rounded-full"
                style={{ background: "var(--tint-navy-50)" }}
                role="presentation"
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width, backgroundColor: color }}
                  aria-hidden
                />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
