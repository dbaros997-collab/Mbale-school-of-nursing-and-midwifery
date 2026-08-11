"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  downloadTranscript,
  getAcademicsBundle,
  type AcademicsBundle,
} from "@/services/portal/academics";
import { StatusBadge } from "@/components/portal/StatusBadge";

export default function AcademicsPage() {
  const [data, setData] = useState<AcademicsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getAcademicsBundle().then((bundle) => {
      setData(bundle);
      setLoading(false);
    });
  }, []);

  async function handleTranscript() {
    setBusy(true);
    const result = await downloadTranscript();
    if (result.ok && result.blob && result.fileName) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Results
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">Academics</h1>
          <p className="mt-1 text-sm text-muted">
            Semester grades, cumulative GPA, and graduation progress.
          </p>
        </div>
        <button
          type="button"
          disabled={busy || loading}
          onClick={() => void handleTranscript()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 focus-ring"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Download className="h-4 w-4" aria-hidden />
          )}
          Download transcript
        </button>
      </div>

      {loading || !data ? (
        <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Semester GPA
              </p>
              <p className="mt-2 text-3xl font-extrabold text-primary">
                {data.semesterGpa.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Cumulative GPA
              </p>
              <p className="mt-2 text-3xl font-extrabold text-primary">
                {data.cumulativeGpa.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Progress to graduation
              </p>
              <p className="mt-2 text-3xl font-extrabold text-primary">{data.progressPercent}%</p>
              <p className="mt-1 text-xs text-muted">
                {data.creditsCompleted} / {data.creditsRequired} credit units
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-accent-green"
                  style={{ width: `${data.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                Completed grades
              </h2>
              <p className="mt-1 text-sm text-muted">{data.programTitle}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-semibold">Semester</th>
                    <th className="px-5 py-3 font-semibold">Unit</th>
                    <th className="px-5 py-3 font-semibold">Credits</th>
                    <th className="px-5 py-3 font-semibold">Score</th>
                    <th className="px-5 py-3 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grades.map((g) => (
                    <tr key={g.id} className="border-b border-border/70">
                      <td className="px-5 py-3 text-muted">{g.semesterLabel}</td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-primary">{g.code}</p>
                        <p className="text-xs text-muted">{g.title}</p>
                      </td>
                      <td className="px-5 py-3">{g.credits}</td>
                      <td className="px-5 py-3 font-semibold">{g.score}</td>
                      <td className="px-5 py-3">
                        <StatusBadge tone="success">{g.letterGrade}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
