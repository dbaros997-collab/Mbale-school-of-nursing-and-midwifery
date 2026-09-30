import type { PaymentMethod, PaymentVerificationStatus } from "@/lib/portal/schema";

export type FeePaymentRpcCode =
  | "INVALID_INPUT"
  | "STUDENT_NOT_FOUND"
  | "DUPLICATE_REFERENCE"
  | "AMOUNT_EXCEEDS_BALANCE"
  | "NOT_FOUND"
  | "ALREADY_REVIEWED"
  | "RPC_ERROR";

export type FeePaymentSubmissionPayload = {
  id: string;
  studentId: string;
  invoiceId: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  depositSlipUrl: string | null;
  depositSlipFileName: string | null;
  status: PaymentVerificationStatus;
  submittedAt: string;
  paymentRecordId?: string | null;
  reviewedAt?: string | null;
};

export type SubmitFeePaymentRpcResult = {
  ok: boolean;
  message?: string;
  code?: FeePaymentRpcCode;
  submission?: FeePaymentSubmissionPayload;
};

export type ReviewFeePaymentRpcResult = {
  ok: boolean;
  message?: string;
  code?: FeePaymentRpcCode;
  submission?: FeePaymentSubmissionPayload;
};

type RpcSubmissionJson = {
  id: string;
  studentId: string;
  invoiceId?: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  depositSlipUrl?: string | null;
  depositSlipFileName?: string | null;
  status: PaymentVerificationStatus;
  submittedAt?: string;
  paymentRecordId?: string | null;
  reviewedAt?: string | null;
};

function mapSubmission(raw: RpcSubmissionJson): FeePaymentSubmissionPayload {
  return {
    id: raw.id,
    studentId: raw.studentId,
    invoiceId: raw.invoiceId ?? null,
    amount: Number(raw.amount),
    paymentMethod: raw.paymentMethod,
    transactionReference: raw.transactionReference,
    depositSlipUrl: raw.depositSlipUrl ?? null,
    depositSlipFileName: raw.depositSlipFileName ?? null,
    status: raw.status,
    submittedAt: raw.submittedAt ?? new Date().toISOString(),
    paymentRecordId: raw.paymentRecordId ?? null,
    reviewedAt: raw.reviewedAt ?? null,
  };
}

export function parseSubmitFeePaymentRpc(data: unknown): SubmitFeePaymentRpcResult {
  if (!data || typeof data !== "object") {
    return { ok: false, code: "RPC_ERROR", message: "Invalid response from payment service." };
  }
  const row = data as Record<string, unknown>;
  const ok = Boolean(row.ok);
  const code = (row.code as FeePaymentRpcCode | undefined) ?? undefined;
  const message = typeof row.message === "string" ? row.message : undefined;
  const submissionRaw = row.submission as RpcSubmissionJson | undefined;
  return {
    ok,
    code,
    message,
    submission: submissionRaw ? mapSubmission(submissionRaw) : undefined,
  };
}

export function parseReviewFeePaymentRpc(data: unknown): ReviewFeePaymentRpcResult {
  if (!data || typeof data !== "object") {
    return { ok: false, code: "RPC_ERROR", message: "Invalid response from verification service." };
  }
  const row = data as Record<string, unknown>;
  const ok = Boolean(row.ok);
  const code = (row.code as FeePaymentRpcCode | undefined) ?? undefined;
  const message = typeof row.message === "string" ? row.message : undefined;
  const submissionRaw = row.submission as RpcSubmissionJson | undefined;
  return {
    ok,
    code,
    message,
    submission: submissionRaw ? mapSubmission(submissionRaw) : undefined,
  };
}
