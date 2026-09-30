import Link from "next/link";
import { KeyRound, UserCheck, Users } from "lucide-react";
import type { FinanceOnboardingSnapshot } from "@/services/portal/admin/fees-types";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { cn } from "@/lib/utils";

type FinanceOnboardingPanelProps = {
  snapshot: FinanceOnboardingSnapshot;
  className?: string;
};

export function FinanceOnboardingPanel({ snapshot, className }: FinanceOnboardingPanelProps) {
  const pending = snapshot.queue.filter((row) => !row.activatedAt);

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
      aria-label="Portal activation and onboarding"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Portal activation &amp; onboarding
          </h2>
          <p className="mt-1 text-sm text-muted">
            Admission credentials, first-time activation at{" "}
            <span className="font-medium text-primary">/portal/activate</span>, and roster approval
            {snapshot.supabaseConnected
              ? " (live Supabase records)"
              : " — connect Supabase to track activation credentials"}.
          </p>
        </div>
        <Link
          href="/admin/students"
          className="text-xs font-semibold text-accent-green hover:underline"
        >
          Manage student accounts →
        </Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-amber-900">
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            Awaiting activation
          </p>
          <p className="mt-1 text-2xl font-extrabold text-amber-950">
            {snapshot.pendingPortalActivation}
          </p>
        </div>
        <div className="rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-accent-green">
            <UserCheck className="h-3.5 w-3.5" aria-hidden />
            Activated portals
          </p>
          <p className="mt-1 text-2xl font-extrabold text-accent-green">
            {snapshot.activatedPortalAccounts}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white px-4 py-3 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted">
            <Users className="h-3.5 w-3.5" aria-hidden />
            Pending account approval
          </p>
          <p className="mt-1 text-2xl font-extrabold text-primary">
            {snapshot.pendingAccountApproval}
          </p>
        </div>
      </div>

      {pending.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Students awaiting portal activation</caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <th className="px-2 py-2 font-semibold">Student</th>
                <th className="px-2 py-2 font-semibold">Temp registration</th>
                <th className="px-2 py-2 font-semibold">Admission letter</th>
                <th className="px-2 py-2 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {pending.slice(0, 6).map((row) => (
                <tr key={`${row.source}-${row.studentId}`} className="border-b border-border/60">
                  <td className="px-2 py-2.5">
                    <p className="font-semibold text-primary">{row.fullName}</p>
                    <p className="text-xs text-muted">{row.email}</p>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-primary">
                    {row.tempRegistrationNumber}
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-primary">
                    {row.admissionLetterRef}
                  </td>
                  <td className="px-2 py-2.5">
                    <StatusBadge tone={row.source === "supabase" ? "success" : "neutral"}>
                      {row.source}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          No students are waiting on first-time portal activation.
        </p>
      )}
    </section>
  );
}
