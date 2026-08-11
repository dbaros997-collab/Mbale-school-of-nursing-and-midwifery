"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getLmsBundle,
  submitAssignment,
  type LmsBundle,
} from "@/services/portal/lms";
import { MaterialsList } from "@/components/portal/lms/MaterialsList";
import { AssignmentBoard } from "@/components/portal/lms/AssignmentBoard";

export default function LmsPage() {
  const [data, setData] = useState<LmsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getLmsBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(assignmentId: string, fileName: string) {
    setBusyId(assignmentId);
    setFlash(null);
    const result = await submitAssignment(assignmentId, fileName);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    setBusyId(null);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
          Learning hub
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">LMS Hub</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Download lecture notes and submit assignments with countdown timers and grading
          status.
        </p>
      </div>

      {flash ? (
        <p
          className={
            flash.ok
              ? "rounded-lg border border-accent-green/30 bg-accent-green-soft px-4 py-3 text-sm font-medium text-accent-green"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
          role="status"
        >
          {flash.text}
        </p>
      ) : null}

      {loading || !data ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
          <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <MaterialsList materials={data.materials} />
          <AssignmentBoard
            assignments={data.assignments}
            busyId={busyId}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
