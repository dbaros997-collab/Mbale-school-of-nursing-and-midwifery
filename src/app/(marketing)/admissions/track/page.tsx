"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { SCHOOL } from "@/lib/data";
import { ApplicationStatusCard } from "@/components/admissions/ApplicationStatusCard";
import { NotificationDispatchPanel } from "@/components/admissions/NotificationDispatchPanel";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TRACKING_STATUS_LABELS } from "@/lib/admissions/tracking";
import {
  lookupApplicationByReference,
  type ApplicationTrackingView,
} from "@/services/admissions/tracking";

export default function TrackApplicationPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationTrackingView | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApplication(null);

    const result = await lookupApplicationByReference(reference);
    if (!result.ok || !result.application) {
      setError(result.message);
    } else {
      setApplication(result.application);
    }
    setLoading(false);
  }

  return (
    <div>
      <PageBanner
        breadcrumb="Admissions"
        title="Track Your Application"
        subtitle={`Check status anytime with your reference number — “${SCHOOL.motto}”.`}
        image="/images/front-offices.jpg"
      />

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Application tracker"
            title="Look up your status"
            description="Enter the reference number from your application confirmation (e.g. MBSNM/APP/2026/1234)."
            align="center"
          />

          <form
            onSubmit={handleLookup}
            className="mt-8 rounded-2xl content-panel p-6 sm:p-8"
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-foreground">
                Application reference
              </span>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  required
                  className="w-full rounded-lg border border-border bg-panel py-2.5 pl-9 pr-3 text-sm font-mono uppercase outline-none transition focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
                  placeholder="MBSNM/APP/2026/1234"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                />
              </div>
            </label>

            {error ? (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="green"
              className="mt-5 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Looking up…
                </>
              ) : (
                "Check status"
              )}
            </Button>
          </form>

          {application ? (
            <div className="mt-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-panel px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-primary">{application.fullName}</p>
                  <p className="text-xs text-muted">{application.programTitle}</p>
                </div>
                <span className="rounded-md bg-surface px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {TRACKING_STATUS_LABELS[application.trackingStatus]}
                </span>
              </div>

              <ApplicationStatusCard
                mode="tracking"
                data={{
                  applicationReference: application.applicationReference,
                  transactionReference: application.transactionReference,
                  trackingStatus: application.trackingStatus,
                  qualificationSummary: application.qualificationSummary,
                  qualificationReasons: application.qualificationReasons,
                  programTitle: application.programTitle,
                  autoQualified: application.qualificationStatus === "qualified",
                  manualReview: application.qualificationStatus === "manual_review",
                  interview: application.interview,
                }}
              />

              <NotificationDispatchPanel
                applicationReference={application.applicationReference}
                email={application.email}
                phone={application.phone}
                initialLog={application.notifications.at(-1) ?? null}
              />

              <p className="text-center text-xs text-muted">
                Submitted {new Date(application.submittedAt).toLocaleString("en-UG")} · Intake:{" "}
                {application.intakeLabel}
              </p>
            </div>
          ) : null}

          <p className="mt-8 text-center text-sm text-muted">
            Haven&apos;t applied yet?{" "}
            <a href="/admissions#apply" className="font-semibold text-primary hover:underline">
              Start your application
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
