"use client";

import { useEffect, useState } from "react";
import {
  BookMarked,
  CreditCard,
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
import { AppPageHero } from "@/components/ui/AppPageHero";
import { Microsoft365DashboardPanel } from "@/components/microsoft/Microsoft365DashboardPanel";

export default function StudentDashboardPage() {
  const { profile, authProvider } = useAuth();
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
    <>
      <div className="-mx-4 -mt-6 mb-6 sm:-mx-6 lg:-mx-8">
        <AppPageHero
          eyebrow="Student dashboard"
          title={`Welcome, ${profile?.fullName?.split(" ")[0] ?? data?.studentName ?? "Student"}`}
          description={`${data?.studentId ?? profile?.studentNumber ?? "—"} · ${data?.program ?? "Your programme"}`}
          actions={
            feeDue ? (
              <StatusBadge tone="danger">Balance due</StatusBadge>
            ) : (
              <StatusBadge tone="success">Fees cleared</StatusBadge>
            )
          }
        />
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        {loading || !data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl data-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

            {authProvider === "microsoft" ? <Microsoft365DashboardPanel /> : null}
          </>
        )}
      </div>
    </>
  );
}
