"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { getNoticesBundle, type NoticesBundle } from "@/services/portal/notices";
import { StatusBadge } from "@/components/portal/StatusBadge";

function formatPublished(iso: string) {
  return new Date(iso).toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoticesPage() {
  const [data, setData] = useState<NoticesBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getNoticesBundle().then((bundle) => {
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
            Notice board
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Institutional circulars and announcements from the school administration.
          </p>
        </div>
        <Link
          href="/portal/timetable"
          className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          View timetable →
        </Link>
      </div>

      {loading || !data ? (
        <div className="h-96 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <>
          {data.headline ? (
            <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary text-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/15 px-5 py-3">
                <Megaphone className="h-4 w-4 text-accent-cyan" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                  Latest circular
                </p>
              </div>
              <div className="px-5 py-5">
                <h2 className="text-xl font-bold">{data.headline.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85">{data.headline.body}</p>
                <p className="mt-3 text-xs text-white/60">
                  Posted {formatPublished(data.headline.publishedAt)}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
                All announcements
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {data.announcements.map((item) => (
                <li key={item.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-primary">{item.title}</h3>
                    <StatusBadge tone={item.audience === "all" ? "neutral" : "info"}>
                      {item.audience}
                    </StatusBadge>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
                    {formatPublished(item.publishedAt)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
