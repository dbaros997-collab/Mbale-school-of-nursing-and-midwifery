"use client";

import { useEffect, useState } from "react";
import {
  BookMarked,
  CreditCard,
  GraduationCap,
  ListTodo,
} from "lucide-react";
import { getDashboardSummary } from "@/services/portal/dashboard";
import type { DashboardSummary } from "@/lib/portal/schema";
import { formatUgx } from "@/lib/portal/constants";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/portal/dashboard/StatCard";
import { QuickActions } from "@/components/portal/dashboard/QuickActions";
import { DeadlineList } from "@/components/portal/dashboard/DeadlineList";
import { AnnouncementTicker } from "@/components/portal/dashboard/AnnouncementTicker";
import { StatusBadge } from "@/components/portal/StatusBadge";

export default function StudentDashboardPage() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getDashboardSummary().then((summary) => {
      if (!cancelled) {
        setData(summary);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const feeDue = (data?.feeBalance ?? 0) > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Student dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
            Welcome, {profile?.fullName?.split(" ")[0] ?? data?.studentName ?? "Student"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {data?.studentId ?? profile?.studentNumber} · {data?.program}
          </p>
        </div>
        {feeDue ? (
          <StatusBadge tone="danger">Balance due</StatusBadge>
        ) : (
          <StatusBadge tone="success">Fees cleared</StatusBadge>
        )}
      </div>

      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-border bg-white"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Semester GPA"
              value={data.gpa.toFixed(2)}
              hint="Current semester"
              Icon={GraduationCap}
            />
            <StatCard
              label="Fee balance"
              value={formatUgx(data.feeBalance)}
              hint={feeDue ? "Payment required" : "No outstanding balance"}
              Icon={CreditCard}
              tone={feeDue ? "danger" : "success"}
            />
            <StatCard
              label="Enrolled units"
              value={String(data.enrolledUnits)}
              hint="Active this semester"
              Icon={BookMarked}
            />
            <StatCard
              label="Upcoming deadlines"
              value={String(data.upcomingDeadlines.length)}
              hint="Assignments due soon"
              Icon={ListTodo}
            />
          </div>

          <QuickActions />

          <div className="grid gap-6 lg:grid-cols-2">
            <DeadlineList items={data.upcomingDeadlines} />
            <AnnouncementTicker items={data.announcements} />
          </div>
        </>
      )}
    </div>
  );
}
