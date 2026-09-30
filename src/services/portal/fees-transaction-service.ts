import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  feePaymentRpcHttpStatus,
  reviewFeePaymentInTransaction,
  submitFeePaymentInTransaction,
} from "@/lib/supabase/fee-payment-transactions";
import type { PaymentMethod } from "@/lib/portal/schema";

const MAX_SLIP_BYTES = 10 * 1024 * 1024;

export type SubmitPortalFeePaymentBody = {
  studentId: string;
  invoiceId?: string | null;
  amount: number;
  method: PaymentMethod;
  transactionReference: string;
  depositSlipDataUrl?: string | null;
  depositSlipFileName?: string | null;
};

export type ReviewAdminFeePaymentBody = {
  submissionId: string;
  decision: "approved" | "rejected";
  verifiedReference?: string;
  reviewNote?: string | null;
};

function validateSubmitBody(body: SubmitPortalFeePaymentBody): string | null {
  if (body.method === "online") {
    return "Online payments use the secure checkout gateway, not manual submission.";
  }

  const amount = Math.round(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Enter a valid payment amount.";
  }
  const ref = body.transactionReference?.trim();
  if (!ref) {
    return "Enter your bank or mobile money transaction reference.";
  }
  if (body.method === "bank") {
    if (!body.depositSlipFileName || !body.depositSlipDataUrl) {
      return "Upload a photo or scan of your bank deposit slip.";
    }
    const approxBytes = Math.ceil((body.depositSlipDataUrl.length * 3) / 4);
    if (approxBytes > MAX_SLIP_BYTES) {
      return "Deposit slip must be 10 MB or smaller.";
    }
  }
  if (!body.studentId?.trim()) {
    return "Student id is required.";
  }
  return null;
}

export async function submitPortalFeePaymentTransaction(body: SubmitPortalFeePaymentBody) {
  const validationError = validateSubmitBody(body);
  if (validationError) {
    return {
      ok: false as const,
      code: "INVALID_INPUT" as const,
      message: validationError,
      httpStatus: 400,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      code: "RPC_ERROR" as const,
      message: "Payment service unavailable.",
      httpStatus: 503,
    };
  }

  const result = await submitFeePaymentInTransaction({
    studentId: body.studentId.trim(),
    invoiceId: body.invoiceId ?? null,
    amount: Math.round(body.amount),
    paymentMethod: body.method,
    transactionReference: body.transactionReference.trim(),
    depositSlipUrl: body.depositSlipDataUrl ?? null,
    depositSlipFileName: body.depositSlipFileName ?? null,
  });

  return {
    ...result,
    httpStatus: result.ok ? 201 : feePaymentRpcHttpStatus(result),
  };
}

export async function reviewAdminFeePaymentTransaction(body: ReviewAdminFeePaymentBody) {
  if (!body.submissionId?.trim()) {
    return {
      ok: false as const,
      code: "INVALID_INPUT" as const,
      message: "submissionId is required.",
      httpStatus: 400,
    };
  }
  if (body.decision !== "approved" && body.decision !== "rejected") {
    return {
      ok: false as const,
      code: "INVALID_INPUT" as const,
      message: "decision must be approved or rejected.",
      httpStatus: 400,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      code: "RPC_ERROR" as const,
      message: "Verification service unavailable.",
      httpStatus: 503,
    };
  }

  const result = await reviewFeePaymentInTransaction({
    submissionId: body.submissionId.trim(),
    decision: body.decision,
    verifiedReference: body.verifiedReference,
    reviewNote: body.reviewNote ?? null,
  });

  return {
    ...result,
    httpStatus: result.ok ? 200 : feePaymentRpcHttpStatus(result),
  };
}
