"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTimetableBundle, type TimetableBundle } from "@/services/portal/timetable";
import { WeeklyGrid } from "@/components/portal/timetable/WeeklyGrid";
import { ExamTimeline } from "@/components/portal/timetable/ExamTimeline";

export default function TimetablePage() {
  const [data, setData] = useState<TimetableBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getTimetableBundle().then((bundle) => {
      if (!cancelled) {
        setData(bundle);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Schedule
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">Timetable</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Weekly class grid and upcoming exam sessions for your enrolled units.
          </p>
        </div>
        <Link
          href="/portal/notices"
          className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          View notice board →
        </Link>
      </div>

      {loading || !data ? (
        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : (
        <>
          <WeeklyGrid byDay={data.byDay} semesterLabel={data.semesterLabel} />
          <ExamTimeline exams={data.exams} />
        </>
      )}
    </div>
  );
}
