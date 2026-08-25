"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Cloud, Loader2, LogIn, Megaphone, RefreshCw } from "lucide-react";
import { MicrosoftSignInButton } from "@/components/microsoft/MicrosoftSignInButton";
import { CurriculumDocumentViewer } from "@/components/microsoft/CurriculumDocumentViewer";
import { refreshMicrosoftTokenIfNeeded } from "@/lib/microsoft/client-token-sync";
import type { MicrosoftGraphNoticesBundle } from "@/lib/microsoft/types";
import { useAuth } from "@/contexts/AuthContext";
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

export function SharePointNoticesSection() {
  const { authProvider } = useAuth();
  const [data, setData] = useState<MicrosoftGraphNoticesBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const load = useCallback(async () => {
    await refreshMicrosoftTokenIfNeeded();
    const response = await fetch("/api/microsoft/graph/notices", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load SharePoint notices.");
    }
    return (await response.json()) as MicrosoftGraphNoticesBundle;
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
            authenticated: false,
            notices: [],
            curriculumItems: [],
            error: err instanceof Error ? err.message : "Failed to load SharePoint content.",
          });
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [load, authProvider]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const bundle = await load();
      setData(bundle);
    } catch (err) {
      setData((prev) => ({
        configured: prev?.configured ?? false,
        authenticated: prev?.authenticated ?? false,
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
          Loading SharePoint notices and curriculum documents…
        </div>
      </div>
    );
  }

  const showSignInPrompt = data?.configured && !data.authenticated;
  const hasSharePointNotices = (data?.notices.length ?? 0) > 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
            Microsoft 365
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-primary">
            SharePoint notices &amp; curriculum
          </h2>
          <p className="mt-1 text-sm text-muted">
            Official circulars and nursing/midwifery resources from the MBSNM SharePoint site.
          </p>
        </div>
        {data?.authenticated ? (
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent-cyan-soft disabled:opacity-60 focus-ring"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </button>
        ) : null}
      </div>

      {data?.error && !showSignInPrompt ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{data.error}</span>
        </div>
      ) : null}

      {showSignInPrompt ? (
        <div className="rounded-xl border border-primary/15 bg-accent-cyan-soft/40 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-primary">Sign in to view SharePoint content</h3>
              <p className="mt-1 text-sm text-muted">
                SharePoint notices and curriculum documents require your official MBSNM Microsoft
                school account (<span className="font-semibold">@student.mbsnm.org</span> or an
                approved security group).
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <MicrosoftSignInButton onError={setSignInError} />
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <LogIn className="h-4 w-4" aria-hidden />
                  Go to sign-in page
                </Link>
              </div>
              {signInError ? (
                <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                  {signInError}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {data?.authenticated && hasSharePointNotices ? (
        <>
          <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary text-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-white/15 px-5 py-3">
              <Megaphone className="h-4 w-4 text-accent-cyan" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                Latest SharePoint circular
              </p>
              <StatusBadge tone="info">SharePoint</StatusBadge>
            </div>
            <div className="px-5 py-5">
              <h3 className="text-xl font-bold">{data.notices[0].title}</h3>
              {data.notices[0].body ? (
                <p className="mt-2 text-sm leading-relaxed text-white/85">{data.notices[0].body}</p>
              ) : null}
              <p className="mt-3 text-xs text-white/60">
                Posted {formatPublished(data.notices[0].publishedAt)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                SharePoint announcements
              </h3>
            </div>
            <ul className="divide-y divide-border">
              {data.notices.map((notice) => (
                <li key={notice.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-primary">{notice.title}</h4>
                    <StatusBadge tone="info">SharePoint</StatusBadge>
                  </div>
                  {notice.body ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{notice.body}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
                    {formatPublished(notice.publishedAt)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : data?.authenticated && !hasSharePointNotices ? (
        <div className="rounded-xl border border-border bg-white px-5 py-8 text-sm text-muted shadow-sm">
          No SharePoint notices were returned. Confirm{" "}
          <code className="text-xs">MICROSOFT_NOTICES_LIST_ID</code> and{" "}
          <code className="text-xs">MICROSOFT_SHAREPOINT_SITE_ID</code> in your environment, or
          check list permissions for students.
        </div>
      ) : null}

      {data?.authenticated ? <CurriculumDocumentViewer /> : null}
    </section>
  );
}
