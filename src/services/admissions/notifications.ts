import { mockDelay } from "@/lib/mock-delay";
import type {
  ApplicationNotificationLog,
  ApplicationRecord,
  NotificationChannel,
} from "@/lib/admissions/types";
import {
  appendApplicationNotification,
  findApplicationByReference,
} from "@/lib/admissions/applications-store";
import { deriveTrackingStatus, TRACKING_STATUS_LABELS } from "@/lib/admissions/tracking";
import {
  formatInterviewDateTime,
  INTERVIEW_REQUIRED_DOCUMENTS,
  INTERVIEW_STATUS_LABELS,
} from "@/lib/admissions/interview";

export type NotificationDispatchInput = {
  applicationReference: string;
  channels: NotificationChannel[];
};

export type NotificationDispatchResult = {
  ok: boolean;
  message: string;
  log?: ApplicationNotificationLog;
};

function buildNotificationContent(record: ApplicationRecord): {
  subject: string;
  body: string;
  preview: string;
} {
  const tracking = deriveTrackingStatus(record);
  const statusLabel = TRACKING_STATUS_LABELS[tracking];

  if (record.qualificationStatus === "qualified" && record.interview) {
    const interviewLabel = INTERVIEW_STATUS_LABELS[record.interview.status];
    const subject = `MBSNM Interview Invitation — ${record.applicationReference}`;
    const scheduled = formatInterviewDateTime(
      record.interview.scheduledDate,
      record.interview.scheduledTime,
    );
    const body = [
      `Dear ${record.fullName},`,
      "",
      "Congratulations! You qualify for the next stage at Mbale School of Nursing and Midwifery.",
      "Please get ready for your interview.",
      "",
      `Application reference: ${record.applicationReference}`,
      `Programme: ${record.programTitle}`,
      `Payment receipt: ${record.transactionReference}`,
      `Interview status: ${interviewLabel}`,
      scheduled ? `Scheduled: ${scheduled}` : "",
      record.interview.venue ? `Venue: ${record.interview.venue}` : "",
      "",
      "Bring the following documents:",
      ...INTERVIEW_REQUIRED_DOCUMENTS.map((d) => `• ${d}`),
      "",
      `Track your application anytime at /admissions/track using reference ${record.applicationReference}.`,
      "",
      "In God We Love and Serve — MBSNM Admissions",
    ]
      .filter(Boolean)
      .join("\n");
    return { subject, body, preview: body.slice(0, 160) + "…" };
  }

  if (tracking === "qualified") {
    const subject = `MBSNM Application Update — ${statusLabel} (${record.applicationReference})`;
    const body = [
      `Dear ${record.fullName},`,
      "",
      "Congratulations! You qualify for admission review at Mbale School of Nursing and Midwifery.",
      "",
      `Application reference: ${record.applicationReference}`,
      `Programme: ${record.programTitle}`,
      `Payment receipt: ${record.transactionReference}`,
      `Current status: ${statusLabel}`,
      "",
      "Next steps:",
      "• Your file is with the admissions committee.",
      "• You may be invited for an interview or document verification.",
      "• A final admission letter will be issued after admin approval.",
      "",
      `Track your application anytime at /admissions/track using reference ${record.applicationReference}.`,
      "",
      "In God We Love and Serve — MBSNM Admissions",
    ].join("\n");
    return { subject, body, preview: body.slice(0, 160) + "…" };
  }

  if (tracking === "unsuccessful_fee_processed") {
    const subject = `MBSNM Application Update — ${statusLabel} (${record.applicationReference})`;
    const body = [
      `Dear ${record.fullName},`,
      "",
      "Thank you for applying to Mbale School of Nursing and Midwifery.",
      "",
      "Application unsuccessful — minimum requirements not met.",
      "",
      `Application reference: ${record.applicationReference}`,
      `Programme: ${record.programTitle}`,
      `Payment receipt: ${record.transactionReference}`,
      `Payment status: Completed (non-refundable)`,
      "",
      "Your application processing fee has been received and will not be refunded.",
      "",
      "Criteria notes:",
      ...record.qualificationReasons.map((r) => `• ${r}`),
      "",
      "If you believe this is an error, contact admissions@mbsnm.org or call our office.",
      "",
      "In God We Love and Serve — MBSNM Admissions",
    ].join("\n");
    return { subject, body, preview: body.slice(0, 160) + "…" };
  }

  if (tracking === "rejected") {
    const subject = `MBSNM Application Update — ${statusLabel} (${record.applicationReference})`;
    const body = [
      `Dear ${record.fullName},`,
      "",
      "Thank you for applying to Mbale School of Nursing and Midwifery.",
      "",
      "Application unsuccessful — minimum requirements not met.",
      "",
      `Application reference: ${record.applicationReference}`,
      `Programme: ${record.programTitle}`,
      `Payment receipt: ${record.transactionReference}`,
      "",
      "Criteria notes:",
      ...record.qualificationReasons.map((r) => `• ${r}`),
      "",
      "If you believe this is an error, contact admissions@mbsnm.org or call our office.",
      "",
      "In God We Love and Serve — MBSNM Admissions",
    ].join("\n");
    return { subject, body, preview: body.slice(0, 160) + "…" };
  }

  const subject = `MBSNM Application Received — ${statusLabel} (${record.applicationReference})`;
  const body = [
    `Dear ${record.fullName},`,
    "",
    "Your application has been received and is pending admissions review.",
    "",
    `Application reference: ${record.applicationReference}`,
    `Programme: ${record.programTitle}`,
    `Payment receipt: ${record.transactionReference}`,
    `Current status: ${statusLabel}`,
    "",
    record.qualificationStatus === "manual_review"
      ? "Your certificate credentials require manual verification by our admissions team."
      : "Our team will review your file and contact you with next steps.",
    "",
    `Track your application at /admissions/track using reference ${record.applicationReference}.`,
    "",
    "In God We Love and Serve — MBSNM Admissions",
  ].join("\n");
  return { subject, body, preview: body.slice(0, 160) + "…" };
}

/** Simulated email / SMS dispatch — ready for POST /api/admissions/notify */
export async function dispatchApplicationNotification(
  input: NotificationDispatchInput,
): Promise<NotificationDispatchResult> {
  await mockDelay(900);

  if (!input.channels.length) {
    return { ok: false, message: "Select at least one notification channel." };
  }

  const record = findApplicationByReference(input.applicationReference);
  if (!record) {
    return { ok: false, message: "Application reference not found." };
  }

  const { subject, body, preview } = buildNotificationContent(record);

  const log: ApplicationNotificationLog = {
    id: `notif-${Date.now()}`,
    sentAt: new Date().toISOString(),
    channels: input.channels,
    email: record.email,
    phone: record.phone,
    subject,
    preview,
  };

  appendApplicationNotification(record.id, log);

  for (const channel of input.channels) {
    if (channel === "email") {
      console.info("[Mock Email]", {
        to: record.email,
        subject,
        body,
      });
    }
    if (channel === "sms") {
      console.info("[Mock SMS]", {
        to: record.phone,
        message: `${subject} — Status: ${TRACKING_STATUS_LABELS[deriveTrackingStatus(record)]}. Ref: ${record.applicationReference}`,
      });
    }
  }

  const channelLabel = input.channels
    .map((c) => (c === "email" ? "email" : "SMS"))
    .join(" and ");

  return {
    ok: true,
    message: `Notification sent via ${channelLabel} to ${record.email}.`,
    log,
  };
}

export { buildNotificationContent };
