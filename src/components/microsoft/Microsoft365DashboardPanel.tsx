"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Loader2, Megaphone, RefreshCw } from "lucide-react";
import type { MicrosoftGraphBundle } from "@/lib/microsoft/types";
import { MicrosoftCalendarEvents } from "./MicrosoftCalendarEvents";
import { MicrosoftNoticesList } from "./MicrosoftNoticesList";

import { refreshMicrosoftTokenIfNeeded } from "@/lib/microsoft/client-token-sync";

export function Microsoft365DashboardPanel() {
  const [data, setData] = useState<MicrosoftGraphBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await refreshMicrosoftTokenIfNeeded();
    const response = await fetch("/api/microsoft/graph/dashboard", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load Microsoft 365 dashboard data.");
    }
    return (await response.json()) as MicrosoftGraphBundle;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load()
      .then((bundle) => {
        if (!cancelled) {
          setData(bundle);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData({
            configured: false,
            calendarEvents: [],
            notices: [],
            curriculumItems: [],
            error: err instanceof Error ? err.message : "Failed to load Microsoft 365 data.",
          });
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const bundle = await load();
      setData(bundle);
    } catch (err) {
      setData((prev) => ({
        configured: prev?.configured ?? false,
        calendarEvents: [],
        notices: [],
        curriculumItems: [],
        error: err instanceof Error ? err.message : "Refresh failed.",
      }));
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading Microsoft 365 calendar and notices…
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Microsoft 365
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-primary">
            School calendar &amp; notices
          </h2>
          <p className="mt-1 text-sm text-muted">
            Live data from your institutional Microsoft 365 tenant.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-cyan-soft disabled:opacity-60 focus-ring"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </button>
      </div>

      {data?.error ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{data.error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Upcoming events
            </h3>
          </div>
          <MicrosoftCalendarEvents events={data?.calendarEvents ?? []} />
        </div>

        <div className="rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Megaphone className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Institutional notices
            </h3>
          </div>
          <MicrosoftNoticesList notices={data?.notices ?? []} />
        </div>
      </div>
    </section>
  );
}
