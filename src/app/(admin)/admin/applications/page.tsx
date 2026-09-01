"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Search, X } from "lucide-react";
import {
  approveApplication,
  bulkInviteToInterview,
  getAdminApplicationsBundle,
  rejectApplication,
  scheduleInterview,
  updateInterviewStatus,
  type AdminApplicationsBundle,
  type AdminApplicationRow,
  type InterviewScheduleInput,
} from "@/services/portal/admin/applications";
import { applicationIntakes } from "@/lib/data";
import { DEFAULT_INTERVIEW_VENUES } from "@/lib/admissions/interview";
import type { InterviewMode, InterviewStatus } from "@/lib/admissions/types";
import {
  InterviewStatusBadge,
  QualificationStatusBadge,
  StatusBadge,
  TrackingStatusBadge,
} from "@/components/portal/StatusBadge";
import { deriveTrackingStatus } from "@/lib/admissions/tracking";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { DataTable, DataTableBody, DataTableHead } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

type FilterTab =
  | "all"
  | "pending_approval"
  | "qualified"
  | "manual_review"
  | "not_qualified"
  | "interview_queue";

const defaultSchedule: InterviewScheduleInput = {
  scheduledDate: "2026-09-15",
  scheduledTime: "09:00",
  venue: DEFAULT_INTERVIEW_VENUES.physical,
  mode: "physical",
  adminNotes: "",
};

function intakeLabel(intakeId: string): string {
  return applicationIntakes.find((i) => i.id === intakeId)?.label ?? intakeId;
}

function isInterviewEligible(row: AdminApplicationRow): boolean {
  return row.qualificationStatus === "qualified" && row.interview !== null;
}

export default function AdminApplicationsPage() {
  const [data, setData] = useState<AdminApplicationsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<AdminApplicationRow | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [bulkSchedule, setBulkSchedule] = useState<InterviewScheduleInput>(defaultSchedule);
  const [showBulkPanel, setShowBulkPanel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const bundle = await getAdminApplicationsBundle();
    setData(bundle);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.applications.filter((a) => {
      if (filter === "pending_approval" && a.reviewStatus !== "pending_approval") return false;
      if (filter === "qualified" && a.qualificationStatus !== "qualified") return false;
      if (filter === "manual_review" && a.qualificationStatus !== "manual_review") return false;
      if (filter === "not_qualified" && a.qualificationStatus !== "not_qualified") return false;
      if (
        filter === "interview_queue" &&
        !(a.interview && (a.interview.status === "interview_pending" || a.interview.status === "interview_scheduled"))
      ) {
        return false;
      }
      if (!q) return true;
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.applicationReference.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    });
  }, [data, query, filter]);

  const selectableIds = useMemo(
    () =>
      filtered
        .filter((a) => a.interview?.status === "interview_pending")
        .map((a) => a.id),
    [filtered],
  );

  function refreshSelected(bundle: AdminApplicationsBundle, applicationId?: string) {
    if (selected && applicationId === selected.id) {
      setSelected(bundle.applications.find((a) => a.id === selected.id) ?? null);
    }
  }

  async function handleApprove(applicationId: string) {
    setBusyId(applicationId);
    setFlash(null);
    const result = await approveApplication(applicationId);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    refreshSelected(result.bundle, applicationId);
    setBusyId(null);
  }

  async function handleReject(applicationId: string) {
    setBusyId(applicationId);
    setFlash(null);
    const result = await rejectApplication(applicationId);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    refreshSelected(result.bundle, applicationId);
    setBusyId(null);
  }

  async function handleScheduleInterview(applicationId: string, schedule: InterviewScheduleInput) {
    setBusyId(applicationId);
    setFlash(null);
    const result = await scheduleInterview(applicationId, schedule);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    refreshSelected(result.bundle, applicationId);
    setBusyId(null);
  }

  async function handleUpdateInterviewStatus(applicationId: string, status: InterviewStatus) {
    setBusyId(applicationId);
    setFlash(null);
    const result = await updateInterviewStatus(applicationId, status);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    refreshSelected(result.bundle, applicationId);
    setBusyId(null);
  }

  async function handleBulkInvite() {
    setBusyId("bulk");
    setFlash(null);
    const result = await bulkInviteToInterview(checkedIds, bulkSchedule);
    setData(result.bundle);
    setFlash({ ok: result.ok, text: result.message });
    setCheckedIds([]);
    setShowBulkPanel(false);
    setBusyId(null);
  }

  function toggleRow(id: string) {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAllSelectable() {
    if (checkedIds.length === selectableIds.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(selectableIds);
    }
  }

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "pending_approval", label: "Pending review", count: data?.pendingCount },
    { id: "qualified", label: "Auto-qualified", count: data?.qualifiedCount },
    { id: "interview_queue", label: "Interview queue", count: data?.interviewQueueCount },
    { id: "manual_review", label: "Manual review", count: data?.manualReviewCount },
    { id: "not_qualified", label: "Not qualified", count: data?.notQualifiedCount },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="admin-page-eyebrow">Admissions queue</p>
        <h1 className="admin-page-title">Application review</h1>
        <p className="admin-page-desc">
          Review online applications, schedule interviews for qualified candidates, and update
          interview outcomes.
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, reference, or email…"
            className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-primary outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id);
                setCheckedIds([]);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-ring",
                filter === tab.id
                  ? "bg-primary text-white"
                  : "border border-border bg-white text-muted hover:bg-surface",
              )}
            >
              {tab.label}
              {tab.count !== undefined ? ` (${tab.count})` : ""}
            </button>
          ))}
        </div>
      </div>

      {selectableIds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <Button
            type="button"
            variant="green"
            size="sm"
            onClick={() => setShowBulkPanel((v) => !v)}
            disabled={busyId === "bulk"}
          >
            <Calendar className="mr-1.5 h-4 w-4" aria-hidden />
            Bulk invite ({checkedIds.length || selectableIds.length} eligible)
          </Button>
          <span className="text-xs text-muted">
            Select pending-interview applicants to schedule a shared session.
          </span>
        </div>
      ) : null}

      {showBulkPanel ? (
        <BulkSchedulePanel
          schedule={bulkSchedule}
          onChange={setBulkSchedule}
          selectedCount={checkedIds.length}
          onSubmit={() => void handleBulkInvite()}
          onCancel={() => setShowBulkPanel(false)}
          busy={busyId === "bulk"}
        />
      ) : null}

      {loading || !data ? (
        <div className="h-80 animate-pulse rounded-xl border border-border bg-white" />
      ) : (
        <DataTable caption="Applications queue">
          <DataTableHead>
            <tr>
              {selectableIds.length > 0 ? (
                <th className="font-semibold">
                  <input
                    type="checkbox"
                    checked={checkedIds.length > 0 && checkedIds.length === selectableIds.length}
                    onChange={toggleAllSelectable}
                    aria-label="Select all pending interview applicants"
                    className="h-4 w-4 rounded border-border text-primary focus-ring"
                  />
                </th>
              ) : null}
              <th className="font-semibold">Applicant</th>
              <th className="font-semibold">Programme</th>
              <th className="font-semibold">Qualification check</th>
              <th className="font-semibold">Interview</th>
              <th className="font-semibold">Tracking status</th>
              <th className="font-semibold">Review status</th>
              <th className="font-semibold">Actions</th>
            </tr>
          </DataTableHead>
          <DataTableBody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectableIds.length > 0 ? 8 : 7}
                      className="px-4 py-10 text-center text-muted"
                    >
                      No applications match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      {selectableIds.length > 0 ? (
                        <td className="px-4 py-3">
                          {a.interview?.status === "interview_pending" ? (
                            <input
                              type="checkbox"
                              checked={checkedIds.includes(a.id)}
                              onChange={() => toggleRow(a.id)}
                              aria-label={`Select ${a.fullName}`}
                              className="h-4 w-4 rounded border-border text-primary focus-ring"
                            />
                          ) : null}
                        </td>
                      ) : null}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary">{a.fullName}</p>
                        <p className="font-mono text-xs text-muted">{a.applicationReference}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-primary">{a.programTitle}</p>
                        <p className="text-xs text-muted">{intakeLabel(a.intakeId)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <QualificationStatusBadge status={a.qualificationStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {a.interview ? (
                          <InterviewStatusBadge status={a.interview.status} />
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <TrackingStatusBadge status={deriveTrackingStatus(a)} />
                      </td>
                      <td className="px-4 py-3">
                        <ReviewStatusBadge status={a.reviewStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(a)}>
                            View
                          </Button>
                          {a.reviewStatus === "pending_approval" ? (
                            <>
                              <Button
                                type="button"
                                variant="green"
                                size="sm"
                                disabled={busyId === a.id}
                                onClick={() => void handleApprove(a.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={busyId === a.id}
                                onClick={() => void handleReject(a.id)}
                              >
                                Reject
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </DataTableBody>
        </DataTable>
      )}

      {selected ? (
        <ApplicationDetailDialog
          application={selected}
          busyId={busyId}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onScheduleInterview={handleScheduleInterview}
          onUpdateInterviewStatus={handleUpdateInterviewStatus}
        />
      ) : null}
    </div>
  );
}

function BulkSchedulePanel({
  schedule,
  onChange,
  selectedCount,
  onSubmit,
  onCancel,
  busy,
}: {
  schedule: InterviewScheduleInput;
  onChange: (schedule: InterviewScheduleInput) => void;
  selectedCount: number;
  onSubmit: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  return (
    <Callout className="p-5">
      <h2 className="text-sm font-bold text-primary">Bulk interview invitation</h2>
      <p className="mt-1 text-xs text-muted">
        Schedule a shared interview session for {selectedCount || "selected"} applicant(s).
      </p>
      <InterviewScheduleFields schedule={schedule} onChange={onChange} className="mt-4" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="green" size="sm" disabled={busy || selectedCount === 0} onClick={onSubmit}>
          Invite selected applicants
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Callout>
  );
}

function InterviewScheduleFields({
  schedule,
  onChange,
  className,
}: {
  schedule: InterviewScheduleInput;
  onChange: (schedule: InterviewScheduleInput) => void;
  className?: string;
}) {
  function setMode(mode: InterviewMode) {
    onChange({
      ...schedule,
      mode,
      venue: mode === "online" ? DEFAULT_INTERVIEW_VENUES.online : DEFAULT_INTERVIEW_VENUES.physical,
    });
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Date</span>
        <input
          type="date"
          value={schedule.scheduledDate}
          onChange={(e) => onChange({ ...schedule, scheduledDate: e.target.value })}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
        />
      </label>
      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Time</span>
        <input
          type="time"
          value={schedule.scheduledTime}
          onChange={(e) => onChange({ ...schedule, scheduledTime: e.target.value })}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
        />
      </label>
      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mode</span>
        <select
          value={schedule.mode}
          onChange={(e) => setMode(e.target.value as InterviewMode)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
        >
          <option value="physical">Physical (campus)</option>
          <option value="online">Online</option>
        </select>
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Venue</span>
        <input
          type="text"
          value={schedule.venue}
          onChange={(e) => onChange({ ...schedule, venue: e.target.value })}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
        />
      </label>
      <label className="block text-sm sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Notes (optional)</span>
        <textarea
          value={schedule.adminNotes ?? ""}
          onChange={(e) => onChange({ ...schedule, adminNotes: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/30"
        />
      </label>
    </div>
  );
}

function ReviewStatusBadge({ status }: { status: AdminApplicationRow["reviewStatus"] }) {
  if (status === "approved") return <StatusBadge tone="success">Approved</StatusBadge>;
  if (status === "rejected") return <StatusBadge tone="danger">Rejected</StatusBadge>;
  return <StatusBadge tone="warning">Pending approval</StatusBadge>;
}

function ApplicationDetailDialog({
  application,
  busyId,
  onClose,
  onApprove,
  onReject,
  onScheduleInterview,
  onUpdateInterviewStatus,
}: {
  application: AdminApplicationRow;
  busyId: string | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onScheduleInterview: (id: string, schedule: InterviewScheduleInput) => void;
  onUpdateInterviewStatus: (id: string, status: InterviewStatus) => void;
}) {
  const isExtension = application.programId.includes("extension");
  const { academicResults } = application;
  const [schedule, setSchedule] = useState<InterviewScheduleInput>(() => ({
    scheduledDate: application.interview?.scheduledDate ?? defaultSchedule.scheduledDate,
    scheduledTime: application.interview?.scheduledTime ?? defaultSchedule.scheduledTime,
    venue:
      application.interview?.venue ??
      (application.interview?.mode === "online"
        ? DEFAULT_INTERVIEW_VENUES.online
        : DEFAULT_INTERVIEW_VENUES.physical),
    mode: application.interview?.mode ?? "physical",
    adminNotes: application.interview?.adminNotes ?? "",
  }));

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary-dark/40 p-4 sm:items-center">
      <div className="absolute inset-0" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-cyan">
              Application file
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-primary">{application.fullName}</h2>
            <p className="font-mono text-sm text-muted">{application.applicationReference}</p>
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted hover:bg-surface focus-ring"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <QualificationStatusBadge status={application.qualificationStatus} />
          {application.interview ? (
            <InterviewStatusBadge status={application.interview.status} />
          ) : null}
          <TrackingStatusBadge status={deriveTrackingStatus(application)} />
          <ReviewStatusBadge status={application.reviewStatus} />
        </div>

        <p className="mt-3 text-sm text-muted">{application.qualificationSummary}</p>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <DetailItem label="Email" value={application.email} />
          <DetailItem label="Phone" value={application.phone} />
          <DetailItem label="Programme" value={application.programTitle} />
          <DetailItem label="Intake" value={intakeLabel(application.intakeId)} />
          <DetailItem label="Education level" value={application.educationLevel} />
          <DetailItem label="Payment receipt" value={application.transactionReference} mono />
        </dl>

        {isInterviewEligible(application) && application.interview ? (
          <div className="mt-5 rounded-xl border border-border bg-surface p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Interview management
            </h3>
            <InterviewScheduleFields schedule={schedule} onChange={setSchedule} className="mt-3" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="green"
                size="sm"
                disabled={busyId === application.id}
                onClick={() => onScheduleInterview(application.id, schedule)}
              >
                {application.interview.status === "interview_scheduled"
                  ? "Update schedule"
                  : "Schedule interview"}
              </Button>
              {application.interview.status === "interview_scheduled" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === application.id}
                  onClick={() => onUpdateInterviewStatus(application.id, "interview_completed")}
                >
                  Mark completed
                </Button>
              ) : null}
              {application.interview.status === "interview_completed" ? (
                <Button
                  variant="green"
                  size="sm"
                  disabled={busyId === application.id}
                  onClick={() => onUpdateInterviewStatus(application.id, "admitted")}
                >
                  Mark admitted
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            Academic results
          </h3>
          {isExtension ? (
            <p className="mt-2 text-sm text-primary">
              License ref:{" "}
              <span className="font-mono">{academicResults.certificateLicenseRef || "—"}</span>
            </p>
          ) : (
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <DetailItem label="UCE index" value={academicResults.uceIndexNumber} mono />
              <DetailItem label="English" value={academicResults.englishGrade || "—"} />
              <DetailItem label="Mathematics" value={academicResults.mathematicsGrade || "—"} />
              <DetailItem label="Biology" value={academicResults.biologyGrade || "—"} />
              {academicResults.totalPasses ? (
                <DetailItem label="Total passes" value={academicResults.totalPasses} />
              ) : null}
            </dl>
          )}
        </div>

        {application.qualificationReasons.length ? (
          <ul className="mt-4 space-y-1 text-xs text-muted">
            {application.qualificationReasons.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {application.reviewStatus === "pending_approval" ? (
            <>
              <Button
                variant="green"
                disabled={busyId === application.id}
                onClick={() => onApprove(application.id)}
              >
                Approve application
              </Button>
              <Button
                variant="ghost"
                disabled={busyId === application.id}
                onClick={() => onReject(application.id)}
              >
                Reject
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className={cn("mt-0.5 text-primary", mono && "font-mono text-xs")}>{value}</dd>
    </div>
  );
}
