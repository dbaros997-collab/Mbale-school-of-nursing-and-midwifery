import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PaymentMethod, PaymentVerificationStatus } from "@/lib/portal/schema";
import {
  reviewFeePaymentInTransaction,
  submitFeePaymentInTransaction,
} from "@/lib/supabase/fee-payment-transactions";
import {
  mapBankPaymentSubmissionRow,
  type BankPaymentSubmission,
  type BankPaymentSubmissionRow,
} from "@/lib/supabase/fee-verification-types";

export type InsertBankSubmissionInput = {
  studentId: string;
  invoiceId: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  depositSlipUrl: string | null;
  depositSlipFileName: string | null;
};

export type InsertBankSubmissionResult = {
  submission: BankPaymentSubmission | null;
  errorCode?: string;
  errorMessage?: string;
};

function payloadToSubmission(
  payload: NonNullable<Awaited<ReturnType<typeof submitFeePaymentInTransaction>>["submission"]>,
): BankPaymentSubmission {
  return {
    id: payload.id,
    studentId: payload.studentId,
    invoiceId: payload.invoiceId,
    amount: payload.amount,
    paymentMethod: payload.paymentMethod,
    transactionReference: payload.transactionReference,
    depositSlipUrl: payload.depositSlipUrl,
    depositSlipFileName: payload.depositSlipFileName,
    status: payload.status,
    reviewNote: null,
    reviewedAt: payload.reviewedAt ?? null,
    submittedAt: payload.submittedAt,
    paymentRecordId: payload.paymentRecordId ?? null,
  };
}

/** Inserts a submission inside a single Postgres transaction (advisory lock + unique reference). */
export async function insertBankPaymentSubmission(
  input: InsertBankSubmissionInput,
): Promise<InsertBankSubmissionResult> {
  if (!isSupabaseConfigured()) {
    return { submission: null };
  }

  const rpc = await submitFeePaymentInTransaction(input);
  if (!rpc.ok || !rpc.submission) {
    return {
      submission: null,
      errorCode: rpc.code,
      errorMessage: rpc.message ?? "Could not submit payment.",
    };
  }

  return { submission: payloadToSubmission(rpc.submission) };
}

export async function listPendingBankSubmissions(): Promise<BankPaymentSubmission[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bank_payment_submissions")
    .select(
      "id,student_id,invoice_id,amount,payment_method,transaction_reference,deposit_slip_url,deposit_slip_file_name,status,review_note,reviewed_at,submitted_at,payment_record_id",
    )
    .eq("status", "pending_review")
    .order("submitted_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[listPendingBankSubmissions]", error);
    return [];
  }

  return (data as BankPaymentSubmissionRow[]).map(mapBankPaymentSubmissionRow);
}

export type ReviewBankSubmissionResult = {
  ok: boolean;
  alreadyReviewed?: boolean;
  submission?: BankPaymentSubmission | null;
  errorCode?: string;
  errorMessage?: string;
};

/** Approves or rejects a submission atomically (row lock + ledger update). */
export async function reviewBankPaymentSubmission(
  id: string,
  status: Extract<PaymentVerificationStatus, "approved" | "rejected">,
  reviewNote: string | null,
  verifiedReference?: string,
): Promise<ReviewBankSubmissionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, errorMessage: "Supabase is not configured." };
  }

  const rpc = await reviewFeePaymentInTransaction({
    submissionId: id,
    decision: status,
    verifiedReference,
    reviewNote,
  });

  if (!rpc.ok) {
    return {
      ok: false,
      errorCode: rpc.code,
      errorMessage: rpc.message ?? "Could not review payment.",
    };
  }

  const alreadyReviewed = rpc.code === "ALREADY_REVIEWED";
  const submission: BankPaymentSubmission | null = rpc.submission
    ? {
        id: rpc.submission.id,
        studentId: rpc.submission.studentId,
        invoiceId: rpc.submission.invoiceId,
        amount: rpc.submission.amount,
        paymentMethod: rpc.submission.paymentMethod,
        transactionReference: rpc.submission.transactionReference,
        depositSlipUrl: rpc.submission.depositSlipUrl,
        depositSlipFileName: rpc.submission.depositSlipFileName,
        status: rpc.submission.status,
        reviewNote: reviewNote ?? null,
        reviewedAt: rpc.submission.reviewedAt ?? null,
        submittedAt: rpc.submission.submittedAt,
        paymentRecordId: rpc.submission.paymentRecordId ?? null,
      }
    : null;

  return { ok: true, alreadyReviewed, submission };
}

/** @deprecated Prefer reviewBankPaymentSubmission for atomic review */
export async function updateBankSubmissionStatus(
  id: string,
  status: Extract<PaymentVerificationStatus, "approved" | "rejected">,
  reviewNote: string | null,
): Promise<boolean> {
  const result = await reviewBankPaymentSubmission(id, status, reviewNote);
  return result.ok;
}
