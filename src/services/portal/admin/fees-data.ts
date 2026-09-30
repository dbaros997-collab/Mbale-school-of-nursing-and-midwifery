import { bumpFeeLedgerRevision, getFeeLedgerRevision } from "@/lib/portal/fee-ledger-revision";
import {
  buildAdminFinanceAlerts,
  buildOverdueAccountRows,
  buildStuckVerificationRows,
  countOverdueStudentAccounts,
  countStaleVerifications,
} from "@/services/portal/fees-finance-alerts";
import type { FinancialClearanceStatus, Payment } from "@/lib/portal/schema";
import type { BankPaymentSubmission } from "@/lib/supabase/fee-verification-types";
import { computeFinancialClearance } from "@/services/portal/fees-shared";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";
import {
  listPendingBankSubmissions,
  reviewBankPaymentSubmission,
} from "@/lib/supabase/fee-verification-store";
import { listRecentOnlinePaymentSessions } from "@/lib/supabase/online-payment-admin-store";
import { listPortalActivationRecords } from "@/lib/supabase/student-activation-admin-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminFinanceDataError } from "@/lib/supabase/admin-finance-errors";
import { isFlutterwaveConfigured } from "@/lib/payments/flutterwave";
import {
  adjustAdminStudentBalance,
  CURRENT_SEMESTER_LABEL,
  recordAdminFeePayment,
} from "@/lib/supabase/admin-finance-store";
import {
  computeAdminFeeAggregates,
  getAdminFeeStudentRows,
  invalidateAdminFeePaymentCache,
  invalidateAdminFeeStudentRowCache,
  queryAdminFeePayments,
  refreshAdminFeeStudentRows,
} from "@/services/portal/admin/fees-pagination";
import type {
  AdminFeeStudentRow,
  AdminFeesBundle,
  AdjustBalanceInput,
  PendingVerificationRow,
  RecordPaymentInput,
  ReviewPaymentInput,
} from "@/services/portal/admin/fees-types";

export type {
  AdminFeeStudentRow,
  AdminFeesBundle,
  PendingVerificationRow,
  RecordPaymentInput,
  AdjustBalanceInput,
  ReviewPaymentInput,
} from "@/services/portal/admin/fees-types";

function studentDisplay(
  studentId: string,
  nameById: Record<string, { name: string; number: string }>,
) {
  return {
    studentName: nameById[studentId]?.name ?? "Unknown student",
    studentNumber: nameById[studentId]?.number ?? "—",
  };
}

function submissionQueueId(submission: BankPaymentSubmission): string {
  return submission.paymentRecordId ?? `bank-sub-${submission.id}`;
}

function pendingRowFromSubmission(
  submission: BankPaymentSubmission,
  nameById: Record<string, { name: string; number: string }>,
): PendingVerificationRow {
  return {
    id: submissionQueueId(submission),
    invoiceId: submission.invoiceId ?? "",
    studentId: submission.studentId,
    amount: submission.amount,
    method: submission.paymentMethod,
    reference: submission.transactionReference,
    transactionReference: submission.transactionReference,
    status: "pending",
    paidAt: submission.submittedAt,
    submittedAt: submission.submittedAt,
    depositSlipDataUrl: submission.depositSlipUrl,
    depositSlipFileName: submission.depositSlipFileName,
    verificationStatus: "pending_review",
    bankSubmissionId: submission.id,
    reviewNote: submission.reviewNote,
    reviewedAt: submission.reviewedAt,
    ...studentDisplay(submission.studentId, nameById),
  };
}

function buildNameIndex(students: AdminFeeStudentRow[]) {
  return Object.fromEntries(
    students.map((s) => [s.id, { name: s.fullName, number: s.studentNumber }]),
  );
}

function refreshDerivedFinanceMetrics(
  bundle: AdminFeesBundle,
  studentRows: AdminFeeStudentRow[],
) {
  bundle.staleVerificationCount = countStaleVerifications(bundle.pendingVerifications);
  bundle.overdueAccountCount = countOverdueStudentAccounts(studentRows);
  bundle.overdueAccounts = buildOverdueAccountRows(studentRows);
  bundle.stuckVerifications = buildStuckVerificationRows(bundle.pendingVerifications);
  bundle.alerts = buildAdminFinanceAlerts({
    students: studentRows,
    pendingVerifications: bundle.pendingVerifications,
    overdueAccountCount: bundle.overdueAccountCount,
    staleVerificationCount: bundle.staleVerificationCount,
  });
}

function emptyOnboardingSnapshot(): AdminFeesBundle["onboarding"] {
  return {
    supabaseConnected: isSupabaseConfigured(),
    pendingPortalActivation: 0,
    activatedPortalAccounts: 0,
    pendingAccountApproval: 0,
    queue: [],
  };
}

function emptyGatewaySnapshot(): AdminFeesBundle["gateway"] {
  return {
    configured: isFlutterwaveConfigured(),
    pendingCheckoutCount: 0,
    completedSessionCount: 0,
    recentSessions: [],
  };
}

async function attachIntegrationSnapshots(
  bundle: AdminFeesBundle,
  nameById: Record<string, { name: string; number: string }>,
): Promise<void> {
  bundle.onboarding = emptyOnboardingSnapshot();
  bundle.gateway = emptyGatewaySnapshot();

  if (!isSupabaseConfigured()) return;

  try {
    const activationRows = await listPortalActivationRecords(20);
    const queueFromDb = activationRows.map((row) => ({
      studentId: row.studentId,
      fullName: row.fullName,
      email: row.email,
      studentNumber: row.studentNumber,
      tempRegistrationNumber: row.tempRegistrationNumber,
      admissionLetterRef: row.admissionLetterRef,
      activatedAt: row.activatedAt,
      source: "supabase" as const,
    }));
    bundle.onboarding.queue = queueFromDb;
    bundle.onboarding.pendingPortalActivation = queueFromDb.filter((r) => !r.activatedAt).length;
    bundle.onboarding.activatedPortalAccounts = queueFromDb.filter((r) => r.activatedAt).length;
    bundle.onboarding.pendingAccountApproval = getAdminFeeStudentRows().filter(
      (s) => s.accountStatus === "pending_approval",
    ).length;
  } catch {
    /* leave empty onboarding */
  }

  const remoteSessions = await listRecentOnlinePaymentSessions(12).catch(() => []);
  const sessionRows = remoteSessions.map((s) => ({
    id: s.id,
    studentId: s.studentId,
    studentName: nameById[s.studentId]?.name ?? s.studentId,
    amount: s.amount,
    txRef: s.txRef,
    gateway: s.gateway,
    status: s.status,
    createdAt: s.createdAt,
  }));

  bundle.gateway.recentSessions = sessionRows;
  bundle.gateway.pendingCheckoutCount = sessionRows.filter((s) => s.status === "pending").length;
  bundle.gateway.completedSessionCount = sessionRows.filter((s) => s.status === "completed").length;
}

async function buildBundle(): Promise<AdminFeesBundle> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is required to build the admin finance bundle.",
      "buildBundle",
    );
  }

  await refreshAdminFeeStudentRows();
  const students = getAdminFeeStudentRows();
  const nameById = buildNameIndex(students);
  const aggregates = await computeAdminFeeAggregates();

  const remotePending = await listPendingBankSubmissions();
  const pendingVerifications: PendingVerificationRow[] = remotePending.map((p) =>
    pendingRowFromSubmission(p, nameById),
  );

  const paymentPage = await queryAdminFeePayments({ page: 1, pageSize: 100 });

  const bundle: AdminFeesBundle = {
    semesterLabel: CURRENT_SEMESTER_LABEL,
    dataSource: "supabase",
    students: [],
    payments: paymentPage.rows,
    totalStudentCount: aggregates.totalStudentCount,
    totalPaymentCount: aggregates.totalPaymentCount,
    pendingVerifications,
    totalCollected: aggregates.totalCollected,
    totalOutstanding: aggregates.totalOutstanding,
    pendingReviewCount: pendingVerifications.length,
    overdueAccountCount: 0,
    staleVerificationCount: 0,
    ledgerRevision: getFeeLedgerRevision(),
    alerts: [],
    overdueAccounts: [],
    stuckVerifications: [],
    onboarding: emptyOnboardingSnapshot(),
    gateway: emptyGatewaySnapshot(),
  };

  refreshDerivedFinanceMetrics(bundle, students);
  await attachIntegrationSnapshots(bundle, nameById);
  return bundle;
}

export async function peekAdminFeesLedgerRevision(): Promise<number> {
  return getFeeLedgerRevision();
}

export async function getAdminFeesDashboardSummary(): Promise<AdminFeesBundle> {
  return getAdminFeesBundleDataFast();
}

export async function getAdminFeesBundleDataFast(): Promise<AdminFeesBundle> {
  return buildBundle();
}

export async function getAdminFeesBundleData(): Promise<AdminFeesBundle> {
  return buildBundle();
}

export async function recordStudentPaymentData(
  input: RecordPaymentInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Finance ledger requires Supabase. Configure your environment to record payments.",
      bundle: await buildBundle(),
    };
  }

  await refreshAdminFeeStudentRows();
  await refreshAdminFeeStudentRows();
  const student = getAdminFeeStudentRows().find((s) => s.id === input.studentId);
  if (!student) {
    return { ok: false, message: "Student not found.", bundle: await buildBundle() };
  }

  const prefix =
    input.method === "mtn" ? "MTN" : input.method === "airtel" ? "AIR" : "BNK";
  const reference =
    input.reference?.trim() ||
    `${prefix}-ADM-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const recorded = await recordAdminFeePayment({
    studentId: student.id,
    amount: input.amount,
    method: input.method,
    reference,
  });

  if (!recorded.ok) {
    return { ok: false, message: recorded.message, bundle: await buildBundle() };
  }

  invalidateAdminFeeStudentRowCache();
  invalidateAdminFeePaymentCache();
  bumpFeeLedgerRevision();

  return {
    ok: true,
    message: `Recorded UGX ${Math.round(input.amount).toLocaleString("en-UG")} for ${student.fullName} via ${PAYMENT_METHOD_LABELS[input.method]}.`,
    bundle: await buildBundle(),
  };
}

export async function adjustStudentBalanceData(
  input: AdjustBalanceInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Finance ledger requires Supabase to update balances.",
      bundle: await buildBundle(),
    };
  }

  await refreshAdminFeeStudentRows();
  await refreshAdminFeeStudentRows();
  const student = getAdminFeeStudentRows().find((s) => s.id === input.studentId);
  if (!student) {
    return { ok: false, message: "Student not found.", bundle: await buildBundle() };
  }

  const newBalance = Math.round(input.newBalance);
  if (!Number.isFinite(newBalance) || newBalance < 0) {
    return {
      ok: false,
      message: "Balance must be a non-negative amount.",
      bundle: await buildBundle(),
    };
  }

  const adjusted = await adjustAdminStudentBalance({
    studentId: student.id,
    newBalance,
  });

  if (!adjusted.ok) {
    return { ok: false, message: adjusted.message, bundle: await buildBundle() };
  }

  invalidateAdminFeeStudentRowCache();
  invalidateAdminFeePaymentCache();
  bumpFeeLedgerRevision();

  return {
    ok: true,
    message: `Updated balance for ${student.fullName} to UGX ${newBalance.toLocaleString("en-UG")}.`,
    bundle: await buildBundle(),
  };
}

export async function reviewStudentPaymentData(
  input: ReviewPaymentInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Payment verification requires Supabase.",
      bundle: await buildBundle(),
    };
  }

  let submissionId = input.paymentId;
  if (submissionId.startsWith("bank-sub-")) {
    submissionId = submissionId.slice("bank-sub-".length);
  }

  const remote = await listPendingBankSubmissions();
  const submission = remote.find(
    (row) => row.id === submissionId || row.paymentRecordId === input.paymentId,
  );

  if (!submission) {
    return { ok: false, message: "Payment submission not found.", bundle: await buildBundle() };
  }

  await refreshAdminFeeStudentRows();
  const student = getAdminFeeStudentRows().find((s) => s.id === submission.studentId);
  const name = student?.fullName ?? "Student";

  const review = await reviewBankPaymentSubmission(
    submission.id,
    input.decision,
    input.reviewNote?.trim() || null,
    input.verifiedReference?.trim(),
  );

  if (!review.ok) {
    return {
      ok: false,
      message: review.errorMessage ?? "Could not review payment.",
      bundle: await buildBundle(),
    };
  }

  invalidateAdminFeeStudentRowCache();
  invalidateAdminFeePaymentCache();
  bumpFeeLedgerRevision();

  if (review.alreadyReviewed) {
    return {
      ok: true,
      message: "Submission was already reviewed.",
      bundle: await buildBundle(),
    };
  }

  if (input.decision === "approved") {
    return {
      ok: true,
      message: `Approved payment for ${name}. Financial clearance updated.`,
      bundle: await buildBundle(),
    };
  }

  return {
    ok: true,
    message: `Rejected payment for ${name}. The student may resubmit with a corrected slip or reference.`,
    bundle: await buildBundle(),
  };
}

function studentClearance(studentId: string, balance: number): FinancialClearanceStatus {
  const invoiceLike = {
    balance,
    totalBilled: 0,
    totalPaid: 0,
    tuition: 0,
    functionalFees: 0,
    id: "",
    studentId,
    semesterLabel: "",
  };
  return computeFinancialClearance(invoiceLike, [] as Payment[]);
}

export { studentClearance };
