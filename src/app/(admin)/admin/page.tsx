"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  UserCheck,
  Users,
} from "lucide-react";
import { getAdminOverview } from "@/services/portal/admin/overview";
import type { AdminOverviewSummary } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/portal/dashboard/StatCard";
import { QualificationStatusBadge, StatusBadge } from "@/components/portal/StatusBadge";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import { Button } from "@/components/ui/Button";
import { AppPageHero } from "@/components/ui/AppPageHero";
import { DataCard } from "@/components/ui/DataCard";
import { TintBarChart } from "@/components/ui/TintBarChart";

export default function AdminOverviewPage() {
  const { adminProfile } = useAuth();
  const [data, setData] = useState<AdminOverviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getAdminOverview().then((summary) => {
      if (!cancelled) {
        setData(summary);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="-mx-4 -mt-6 mb-6 sm:-mx-6 lg:-mx-8">
        <AppPageHero
          eyebrow="Admin overview"
          title={`Welcome, ${adminProfile?.fullName?.split(" ")[0] ?? "Admin"}`}
          description={`${adminProfile?.title ?? "Administrator"} · System analytics and control panel`}
          actions={
            <>
              <Button href="/admin/analytics" variant="ghost" size="sm">
                Analytics
              </Button>
              <Button href="/admin/applications" variant="ghost" size="sm">
                Applications
              </Button>
              <Button href="/admin/students" variant="ghost" size="sm">
                Manage students
              </Button>
              <Button href="/admin/fees" variant="primary" size="sm">
                Fee ledger
              </Button>
            </>
          }
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {loading || !data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl data-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Active students"
                value={String(data.activeStudents)}
                hint="Registered and active accounts"
                Icon={Users}
              />
              <StatCard
                label="Pending approvals"
                value={String(data.pendingApprovals)}
                hint="New account registrations"
                Icon={UserCheck}
                tone={data.pendingApprovals > 0 ? "danger" : "success"}
              />
              <StatCard
                label="Pending applications"
                value={String(data.pendingApplications)}
                hint="Awaiting admissions review"
                Icon={UserCheck}
                tone={data.pendingApplications > 0 ? "danger" : "success"}
              />
              <StatCard
                label="Fee collections"
                value={formatUgx(data.totalFeeCollections)}
                hint={`Outstanding ${formatUgx(data.outstandingBalances)}`}
                Icon={CreditCard}
                tone="success"
              />
              <StatCard
                label="Active courses"
                value={String(data.activeCourses)}
                hint="Units offered this semester"
                Icon={BookOpen}
              />
            </div>

            <DataCard title="Registry snapshot">
              <TintBarChart
                caption="Counts by category"
                items={[
                  { label: "Active students", value: data.activeStudents },
                  { label: "Pending applications", value: data.pendingApplications },
                  { label: "Pending approvals", value: data.pendingApprovals },
                  { label: "Active courses", value: data.activeCourses },
                ]}
              />
            </DataCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <DataCard
                title={
                  <span className="flex w-full items-center justify-between gap-2">
                    Application review queue
                    <Link
                      href="/admin/applications"
                      className="text-xs font-semibold text-brand-sky underline-offset-2 hover:underline"
                    >
                      View all
                    </Link>
                  </span>
                }
              >
                {data.pendingApplicationQueue.length === 0 ? (
                  <p className="text-sm text-muted">No applications awaiting review.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {data.pendingApplicationQueue.map((a) => (
                      <li
                        key={a.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-primary">
                            {a.fullName}
                          </p>
                          <p className="truncate text-xs text-muted">{a.applicationReference}</p>
                        </div>
                        <QualificationStatusBadge status={a.qualificationStatus} />
                      </li>
                    ))}
                  </ul>
                )}
              </DataCard>

              <DataCard
                title={
                  <span className="flex w-full items-center justify-between gap-2">
                    Pending account approvals
                    <Link
                      href="/admin/students"
                      className="text-xs font-semibold text-brand-sky underline-offset-2 hover:underline"
                    >
                      View all
                    </Link>
                  </span>
                }
              >
                {data.pendingStudents.length === 0 ? (
                  <p className="text-sm text-muted">No pending registrations.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {data.pendingStudents.map((s) => (
                      <li
                        key={s.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-primary">
                            {s.fullName}
                          </p>
                          <p className="truncate text-xs text-muted">{s.studentNumber}</p>
                        </div>
                        <StatusBadge tone="warning">Awaiting approval</StatusBadge>
                      </li>
                    ))}
                  </ul>
                )}
              </DataCard>
            </div>

            <DataCard
              title={
                <span className="flex w-full items-center justify-between gap-2">
                  Recent payments
                  <Link
                    href="/admin/fees"
                    className="text-xs font-semibold text-brand-sky underline-offset-2 hover:underline"
                  >
                    Ledger
                  </Link>
                </span>
              }
            >
              {data.recentPayments.length === 0 ? (
                <p className="text-sm text-muted">No payments recorded yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.recentPayments.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary">
                          {formatUgx(p.amount)}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {PAYMENT_METHOD_LABELS[p.method]} · {p.reference}
                        </p>
                      </div>
                      <StatusBadge tone="success">Completed</StatusBadge>
                    </li>
                  ))}
                </ul>
              )}
            </DataCard>
          </>
        )}
      </div>
    </>
  );
}
