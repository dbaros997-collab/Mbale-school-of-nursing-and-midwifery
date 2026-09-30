/**
 * Atomic fee payment operations via Postgres RPC (single DB transaction per call).
 * This project persists through Supabase/SQL migrations rather than Prisma; these
 * functions are the concurrency-safe equivalent of wrapping multiple queries in
 * `prisma.$transaction`.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { InsertBankSubmissionInput } from "@/lib/supabase/fee-verification-store";
import {
  parseReviewFeePaymentRpc,
  parseSubmitFeePaymentRpc,
  type ReviewFeePaymentRpcResult,
  type SubmitFeePaymentRpcResult,
} from "@/lib/supabase/fee-payment-rpc-types";

export type ReviewBankSubmissionInput = {
  submissionId: string;
  decision: "approved" | "rejected";
  verifiedReference?: string;
  reviewNote?: string | null;
};

export async function submitFeePaymentInTransaction(
  input: InsertBankSubmissionInput,
): Promise<SubmitFeePaymentRpcResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      code: "RPC_ERROR",
      message: "Supabase is not configured.",
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_fee_payment_submission", {
    p_student_id: input.studentId,
    p_invoice_id: input.invoiceId,
    p_amount: input.amount,
    p_payment_method: input.paymentMethod,
    p_transaction_reference: input.transactionReference,
    p_deposit_slip_url: input.depositSlipUrl,
    p_deposit_slip_file_name: input.depositSlipFileName,
  });

  if (error) {
    console.error("[submitFeePaymentInTransaction]", error);
    return {
      ok: false,
      code: "RPC_ERROR",
      message: error.message || "Could not submit payment.",
    };
  }

  return parseSubmitFeePaymentRpc(data);
}

export async function reviewFeePaymentInTransaction(
  input: ReviewBankSubmissionInput,
): Promise<ReviewFeePaymentRpcResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      code: "RPC_ERROR",
      message: "Supabase is not configured.",
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("review_fee_payment_submission", {
    p_submission_id: input.submissionId,
    p_decision: input.decision,
    p_verified_reference: input.verifiedReference ?? "",
    p_review_note: input.reviewNote ?? "",
  });

  if (error) {
    console.error("[reviewFeePaymentInTransaction]", error);
    return {
      ok: false,
      code: "RPC_ERROR",
      message: error.message || "Could not review payment.",
    };
  }

  return parseReviewFeePaymentRpc(data);
}

/** HTTP status for API routes derived from RPC outcome */
export function feePaymentRpcHttpStatus(result: { ok: boolean; code?: string }): number {
  if (result.ok) return 200;
  switch (result.code) {
    case "DUPLICATE_REFERENCE":
    case "AMOUNT_EXCEEDS_BALANCE":
      return 409;
    case "NOT_FOUND":
    case "STUDENT_NOT_FOUND":
      return 404;
    case "INVALID_INPUT":
      return 400;
    default:
      return 503;
  }
}
