import { CreditCard, Wifi } from "lucide-react";
import type { FinanceGatewaySnapshot } from "@/services/portal/admin/fees-types";
import { formatUgx } from "@/lib/portal/constants";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { cn } from "@/lib/utils";

type FinanceGatewayPanelProps = {
  snapshot: FinanceGatewaySnapshot;
  className?: string;
};

export function FinanceGatewayPanel({ snapshot, className }: FinanceGatewayPanelProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
      aria-label="Online payment gateway activity"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Flutterwave &amp; online checkout
          </h2>
          <p className="mt-1 text-sm text-muted">
            Hosted checkout sessions settle through Supabase RPC and refresh the fee ledger in
            real time.
          </p>
        </div>
        <StatusBadge tone={snapshot.configured ? "success" : "warning"}>
          {snapshot.configured ? "Live keys configured" : "Gateway not configured"}
        </StatusBadge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-sky-900">
            <CreditCard className="h-3.5 w-3.5" aria-hidden />
            In-flight checkout
          </p>
          <p className="mt-1 text-2xl font-extrabold text-sky-950">
            {snapshot.pendingCheckoutCount}
          </p>
        </div>
        <div className="rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-accent-green">
            <Wifi className="h-3.5 w-3.5" aria-hidden />
            Completed (recent window)
          </p>
          <p className="mt-1 text-2xl font-extrabold text-accent-green">
            {snapshot.completedSessionCount}
          </p>
        </div>
      </div>

      {snapshot.recentSessions.length > 0 ? (
        <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
          {snapshot.recentSessions.map((session) => (
            <li
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  {formatUgx(session.amount)} · {session.studentName}
                </p>
                <p className="truncate font-mono text-[11px] text-muted">{session.txRef}</p>
              </div>
              <StatusBadge
                tone={
                  session.status === "completed"
                    ? "success"
                    : session.status === "pending"
                      ? "warning"
                      : "danger"
                }
              >
                {session.gateway} · {session.status}
              </StatusBadge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-muted">
          No online checkout sessions yet. Student payments appear here after Flutterwave checkout
          starts or webhooks settle.
        </p>
      )}
    </section>
  );
}
