import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { FeeFinanceAlert } from "@/services/portal/fees-finance-alerts";
import { cn } from "@/lib/utils";

type FeeFinanceAlertBannerProps = {
  alerts: FeeFinanceAlert[];
  className?: string;
};

const bannerStyles = {
  info: {
    wrap: "border-brand-sky/50 bg-gradient-to-r from-accent-cyan-soft/80 to-white",
    icon: Info,
    iconClass: "text-primary",
    badge: "bg-primary/10 text-primary",
  },
  warning: {
    wrap: "border-amber-300 bg-gradient-to-r from-amber-50 to-white",
    icon: AlertTriangle,
    iconClass: "text-amber-700",
    badge: "bg-amber-100 text-amber-900",
  },
  danger: {
    wrap: "border-red-300 bg-gradient-to-r from-red-50 to-white",
    icon: AlertCircle,
    iconClass: "text-red-700",
    badge: "bg-red-100 text-red-800",
  },
} as const;

function pickPrimaryAlert(alerts: FeeFinanceAlert[]): FeeFinanceAlert | null {
  if (alerts.length === 0) return null;
  const order = { danger: 3, warning: 2, info: 1 } as const;
  return [...alerts].sort((a, b) => order[b.severity] - order[a.severity])[0];
}

export function FeeFinanceAlertBanner({ alerts, className }: FeeFinanceAlertBannerProps) {
  const primary = pickPrimaryAlert(alerts);
  if (!primary) return null;

  const tone = bannerStyles[primary.severity];
  const Icon = tone.icon;
  const extraCount = alerts.length - 1;

  return (
    <div
      className={cn("rounded-xl border px-4 py-4 shadow-sm sm:px-5", tone.wrap, className)}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start gap-3">
        <Icon className={cn("mt-0.5 h-6 w-6 shrink-0", tone.iconClass)} aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-extrabold text-primary">{primary.title}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                tone.badge,
              )}
            >
              Finance alert
            </span>
            {extraCount > 0 ? (
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-muted">
                +{extraCount} more
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm text-muted">{primary.message}</p>
        </div>
      </div>
    </div>
  );
}

/** Nav badge count for /portal/fees */
export function feeNavAlertBadge(alerts: FeeFinanceAlert[]): number {
  return alerts.filter((a) => a.severity !== "info" || a.id === "pending-verification-info")
    .length;
}
