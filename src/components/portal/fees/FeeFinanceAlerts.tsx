import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { FeeFinanceAlert } from "@/services/portal/fees-finance-alerts";
import { cn } from "@/lib/utils";

type FeeFinanceAlertsProps = {
  alerts: FeeFinanceAlert[];
  className?: string;
};

const toneStyles = {
  info: {
    box: "border-brand-sky/40 bg-accent-cyan-soft/40",
    icon: "text-primary",
    Icon: Info,
  },
  warning: {
    box: "border-amber-300 bg-amber-50",
    icon: "text-amber-700",
    Icon: AlertTriangle,
  },
  danger: {
    box: "border-red-200 bg-red-50",
    icon: "text-red-700",
    Icon: AlertCircle,
  },
} as const;

export function FeeFinanceAlerts({ alerts, className }: FeeFinanceAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <ul className={cn("space-y-3", className)} aria-label="Fee and finance notifications">
      {alerts.map((alert) => {
        const tone = toneStyles[alert.severity];
        const Icon = tone.Icon;
        return (
          <li
            key={alert.id}
            className={cn("rounded-xl border px-4 py-3 shadow-sm", tone.box)}
            role="alert"
          >
            <div className="flex gap-3">
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.icon)} aria-hidden />
              <div>
                <p className="text-sm font-bold text-primary">{alert.title}</p>
                <p className="mt-1 text-sm text-muted">{alert.message}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
