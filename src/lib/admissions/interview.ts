import type { InterviewDetails, InterviewMode, InterviewStatus } from "@/lib/admissions/types";

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  interview_pending: "Interview Pending",
  interview_scheduled: "Interview Scheduled",
  interview_completed: "Interview Completed",
  admitted: "Admitted",
};

export const INTERVIEW_REQUIRED_DOCUMENTS = [
  "Original academic certificates and transcripts",
  "National ID (original and photocopy)",
  "Two recent passport-size photos",
  "Payment receipt for the UGX 20,000 application fee",
] as const;

export const DEFAULT_INTERVIEW_VENUES: Record<InterviewMode, string> = {
  physical: "MBSNM Main Campus — Admissions Block, Ground Floor",
  online: "Online via Google Meet (link shared after scheduling)",
};

/** Simulated upcoming interview slots shown when no date is set yet */
export const SUGGESTED_INTERVIEW_SLOTS = [
  { date: "2026-09-15", time: "09:00 AM", mode: "physical" as const },
  { date: "2026-09-16", time: "02:00 PM", mode: "physical" as const },
  { date: "2026-09-18", time: "10:00 AM", mode: "online" as const },
];

export function createInterviewInvitation(): InterviewDetails {
  return {
    status: "interview_pending",
    invitedAt: new Date().toISOString(),
  };
}

export function interviewStatusTone(
  status: InterviewStatus,
): "success" | "warning" | "danger" | "info" {
  if (status === "admitted") return "success";
  if (status === "interview_completed") return "info";
  if (status === "interview_scheduled") return "warning";
  return "warning";
}

export function formatInterviewDateTime(date?: string, time?: string): string | null {
  if (!date) return null;
  const formatted = new Date(`${date}T${time ?? "09:00"}`).toLocaleString("en-UG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: time ? "numeric" : undefined,
    minute: time ? "2-digit" : undefined,
  });
  return formatted;
}
