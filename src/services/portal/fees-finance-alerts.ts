import {
  CURRENT_SEMESTER_FEE_DUE_ISO,
  FEE_DUE_SOON_DAYS,
  STALE_BANK_VERIFICATION_DAYS,
  STALE_STUDENT_VERIFICATION_DAYS,
} from "@/lib/portal/constants";
import { isPendingFeeVerification } from "@/lib/portal/fee-pending-reservations";
import type {
  FeeInvoice,
  FinancialClearanceStatus,
  Payment,
} from "@/lib/portal/schema";
import type { AdminFeeStudentRow, PendingVerificationRow } from "@/services/portal/admin/fees-types";
import { formatUgx } from "@/lib/portal/constants";

export type FeeFinanceAlertSeverity = "info" | "warning" | "danger";

export type FeeFinanceAlert = {
  id: string;
  severity: FeeFinanceAlertSeverity;
  title: string;
  message: string;
};

export type FinanceDashboardAlert = FeeFinanceAlert & {
  metric?: number;
};

function parseDueDate(invoice: FeeInvoice): Date | null {
  const iso = invoice.paymentDueDate ?? CURRENT_SEMESTER_FEE_DUE_ISO;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function buildStudentFeeAlerts(input: {
  invoice: FeeInvoice;
  payments: Payment[];
  financialClearance: FinancialClearanceStatus;
  now?: Date;
}): FeeFinanceAlert[] {
  const now = input.now ?? new Date();
  const alerts: FeeFinanceAlert[] = [];
  const due = parseDueDate(input.invoice);
  const balance = input.invoice.balance;

  if (balance > 0 && due) {
    const daysToDue = daysBetween(now, due);
    if (daysToDue < 0) {
      alerts.push({
        id: "balance-overdue",
        severity: "danger",
        title: "Overdue fee balance",
        message: `Your semester fees are ${Math.abs(daysToDue)} day(s) past the due date (${due.toLocaleDateString("en-UG")}). Outstanding: ${formatUgx(balance)}.`,
      });
    } else if (daysToDue <= FEE_DUE_SOON_DAYS) {
      alerts.push({
        id: "balance-due-soon",
        severity: "warning",
        title: "Payment due soon",
        message: `Semester fees are due on ${due.toLocaleDateString("en-UG")} (${daysToDue} day(s) left). Outstanding: ${formatUgx(balance)}.`,
      });
    }
  }

  const pending = input.payments.filter(isPendingFeeVerification);
  for (const p of pending) {
    const submitted = new Date(p.submittedAt ?? p.paidAt);
    const ageDays = daysBetween(submitted, now);
    if (ageDays >= STALE_STUDENT_VERIFICATION_DAYS) {
      alerts.push({
        id: `stale-pending-${p.id}`,
        severity: "warning",
        title: "Verification taking longer than usual",
        message: `Your ${formatUgx(p.amount)} submission has been awaiting finance review for ${ageDays} days. Contact the accounts office if you need assistance.`,
      });
      break;
    }
  }

  const rejected = input.payments
    .filter((p) => p.verificationStatus === "rejected" || p.status === "failed")
    .sort(
      (a, b) =>
        new Date(b.reviewedAt ?? b.paidAt).getTime() -
        new Date(a.reviewedAt ?? a.paidAt).getTime(),
    );
  const latestRejected = rejected[0];
  if (latestRejected?.reviewedAt) {
    const rejectedAt = new Date(latestRejected.reviewedAt);
    if (daysBetween(rejectedAt, now) <= 14) {
      alerts.push({
        id: `rejected-${latestRejected.id}`,
        severity: "danger",
        title: "Payment not accepted",
        message:
          latestRejected.reviewNote?.trim() ||
          `Finance could not verify your recent ${formatUgx(latestRejected.amount)} payment. Submit a corrected reference or deposit slip.`,
      });
    }
  }

  if (input.financialClearance === "pending_verification" && alerts.every((a) => !a.id.startsWith("stale-pending"))) {
    alerts.push({
      id: "pending-verification-info",
      severity: "info",
      title: "Payment under review",
      message:
        "Finance is verifying your latest submission. Your ledger will update automatically once approved.",
    });
  }

  return alerts;
}

export function buildAdminFinanceAlerts(input: {
  students: AdminFeeStudentRow[];
  pendingVerifications: PendingVerificationRow[];
  overdueAccountCount: number;
  staleVerificationCount: number;
  now?: Date;
}): FinanceDashboardAlert[] {
  const now = input.now ?? new Date();
  const alerts: FinanceDashboardAlert[] = [];

  if (input.pendingVerifications.length > 0) {
    alerts.push({
      id: "pending-queue",
      severity: input.staleVerificationCount > 0 ? "warning" : "info",
      title: "Bank verification queue",
      message: `${input.pendingVerifications.length} submission(s) awaiting review${input.staleVerificationCount > 0 ? ` · ${input.staleVerificationCount} delayed over ${STALE_BANK_VERIFICATION_DAYS} days` : ""}.`,
      metric: input.pendingVerifications.length,
    });
  }

  if (input.overdueAccountCount > 0) {
    alerts.push({
      id: "overdue-accounts",
      severity: "danger",
      title: "Overdue student accounts",
      message: `${input.overdueAccountCount} student(s) have outstanding balances past the semester due date.`,
      metric: input.overdueAccountCount,
    });
  }

  const pendingVerificationStudents = input.students.filter(
    (s) => s.financialClearance === "pending_verification" && s.feeBalance > 0,
  );
  if (pendingVerificationStudents.length > 0) {
    alerts.push({
      id: "clearance-blocked",
      severity: "warning",
      title: "Clearance blocked pending slips",
      message: `${pendingVerificationStudents.length} student(s) owe fees but have payments awaiting verification.`,
      metric: pendingVerificationStudents.length,
    });
  }

  const due = new Date(CURRENT_SEMESTER_FEE_DUE_ISO);
  const daysToDue = daysBetween(now, due);
  if (daysToDue >= 0 && daysToDue <= FEE_DUE_SOON_DAYS && input.overdueAccountCount === 0) {
    alerts.push({
      id: "due-date-approaching",
      severity: "info",
      title: "Semester due date approaching",
      message: `Fee deadline is ${due.toLocaleDateString("en-UG")} (${daysToDue} day(s) remaining).`,
    });
  }

  return alerts;
}

export function countOverdueStudentAccounts(
  students: AdminFeeStudentRow[],
  now: Date = new Date(),
): number {
  const due = new Date(CURRENT_SEMESTER_FEE_DUE_ISO);
  if (now <= due) return 0;
  return students.filter((s) => s.feeBalance > 0).length;
}

export function countStaleVerifications(
  pending: PendingVerificationRow[],
  now: Date = new Date(),
): number {
  return pending.filter((row) => {
    const submitted = new Date(row.submittedAt ?? row.paidAt);
    return daysBetween(submitted, now) >= STALE_BANK_VERIFICATION_DAYS;
  }).length;
}

export type OverdueAccountRow = {
  studentId: string;
  fullName: string;
  studentNumber: string;
  feeBalance: number;
  daysPastDue: number;
  financialClearance: AdminFeeStudentRow["financialClearance"];
};

export type StuckVerificationRow = {
  queueId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  amount: number;
  daysPending: number;
  transactionReference: string;
  isStale: boolean;
};

export function buildOverdueAccountRows(
  students: AdminFeeStudentRow[],
  now: Date = new Date(),
): OverdueAccountRow[] {
  const due = new Date(CURRENT_SEMESTER_FEE_DUE_ISO);
  if (Number.isNaN(due.getTime()) || now <= due) return [];

  return students
    .filter((s) => s.feeBalance > 0)
    .map((s) => ({
      studentId: s.id,
      fullName: s.fullName,
      studentNumber: s.studentNumber,
      feeBalance: s.feeBalance,
      daysPastDue: daysBetween(due, now),
      financialClearance: s.financialClearance,
    }))
    .sort((a, b) => b.feeBalance - a.feeBalance || b.daysPastDue - a.daysPastDue);
}

export function buildStuckVerificationRows(
  pending: PendingVerificationRow[],
  now: Date = new Date(),
): StuckVerificationRow[] {
  return pending
    .map((row) => {
      const submitted = new Date(row.submittedAt ?? row.paidAt);
      const daysPending = daysBetween(submitted, now);
      return {
        queueId: row.id,
        studentId: row.studentId,
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        amount: row.amount,
        daysPending,
        transactionReference: row.transactionReference ?? row.reference,
        isStale: daysPending >= STALE_BANK_VERIFICATION_DAYS,
      };
    })
    .sort((a, b) => b.daysPending - a.daysPending || b.amount - a.amount);
}
