import { AlertCircle, AlertTriangle, Clock, Info } from "lucide-react";
import type { FinanceDashboardAlert } from "@/services/portal/fees-finance-alerts";
import { cn } from "@/lib/utils";

type FinanceMonitoringAlertsProps = {
  alerts: FinanceDashboardAlert[];
  overdueAccountCount: number;
  staleVerificationCount: number;
  pendingReviewCount: number;
  className?: string;
};

export function FinanceMonitoringAlerts({
  alerts,
  overdueAccountCount,
  staleVerificationCount,
  pendingReviewCount,
  className,
}: FinanceMonitoringAlertsProps) {
  return (
    <section
      className={cn("space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm", className)}
      aria-label="Finance monitoring summary"
    >
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Finance alerts &amp; tracking
        </h2>
        <p className="mt-1 text-sm text-muted">
          Live summary of overdue balances and verification backlog — details in the panels below.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Pending verification
          </p>
          <p className="mt-1 text-2xl font-extrabold text-amber-900">{pendingReviewCount}</p>
          {staleVerificationCount > 0 ? (
            <p className="mt-0.5 text-xs font-medium text-amber-800">
              {staleVerificationCount} delayed
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-800">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            Overdue accounts
          </p>
          <p className="mt-1 text-2xl font-extrabold text-red-900">{overdueAccountCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Active alerts
          </p>
          <p className="mt-1 text-2xl font-extrabold text-primary">{alerts.length}</p>
        </div>
      </div>

      {alerts.length > 0 ? (
        <ul className="space-y-2">
          {alerts.map((alert) => {
            const Icon =
              alert.severity === "danger"
                ? AlertCircle
                : alert.severity === "warning"
                  ? AlertTriangle
                  : Info;
            return (
              <li
                key={alert.id}
                className={cn(
                  "flex gap-3 rounded-lg border px-4 py-3 text-sm",
                  alert.severity === "danger" && "border-red-200 bg-red-50",
                  alert.severity === "warning" && "border-amber-200 bg-amber-50",
                  alert.severity === "info" && "border-border bg-white",
                )}
                role="status"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="font-semibold text-primary">{alert.title}</p>
                  <p className="mt-0.5 text-muted">{alert.message}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green">
          No critical finance alerts — queues and overdue accounts are within normal thresholds.
        </p>
      )}
    </section>
  );
}
