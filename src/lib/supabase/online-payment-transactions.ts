/**
 * Atomic online payment operations via Postgres RPC (single DB transaction per call).
 * Equivalent to wrapping ledger updates in `prisma.$transaction`.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type OnlinePaymentSessionPayload = {
  id: string;
  studentId: string;
  invoiceId: string | null;
  amount: number;
  currency: string;
  txRef: string;
  gateway: string;
  status: string;
  paymentRecordId?: string | null;
  gatewayTransactionId?: string | null;
};

export type RegisterOnlineSessionResult =
  | { ok: true; session: OnlinePaymentSessionPayload }
  | { ok: false; code?: string; message: string };

export type SettleOnlinePaymentResult =
  | { ok: true; session: OnlinePaymentSessionPayload; code?: string }
  | { ok: false; code?: string; message: string };

function mapSession(raw: Record<string, unknown>): OnlinePaymentSessionPayload {
  return {
    id: String(raw.id),
    studentId: String(raw.studentId),
    invoiceId: raw.invoiceId != null ? String(raw.invoiceId) : null,
    amount: Number(raw.amount),
    currency: String(raw.currency ?? "UGX"),
    txRef: String(raw.txRef),
    gateway: String(raw.gateway ?? "flutterwave"),
    status: String(raw.status),
    paymentRecordId:
      raw.paymentRecordId != null ? String(raw.paymentRecordId) : null,
    gatewayTransactionId:
      raw.gatewayTransactionId != null ? String(raw.gatewayTransactionId) : null,
  };
}

function parseRegisterRpc(data: unknown): RegisterOnlineSessionResult {
  const row = data as { ok?: boolean; code?: string; message?: string; session?: Record<string, unknown> };
  if (!row?.ok || !row.session) {
    return {
      ok: false,
      code: row?.code,
      message: row?.message ?? "Could not register payment session.",
    };
  }
  return { ok: true, session: mapSession(row.session) };
}

function parseSettleRpc(data: unknown): SettleOnlinePaymentResult {
  const row = data as { ok?: boolean; code?: string; message?: string; session?: Record<string, unknown> };
  if (!row?.ok || !row.session) {
    return {
      ok: false,
      code: row?.code,
      message: row?.message ?? "Could not settle payment.",
    };
  }
  return { ok: true, code: row.code, session: mapSession(row.session) };
}

export async function registerOnlinePaymentSessionInTransaction(input: {
  studentId: string;
  invoiceId?: string | null;
  amount: number;
  txRef: string;
  gateway?: "flutterwave" | "pesapal";
}): Promise<RegisterOnlineSessionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, code: "RPC_ERROR", message: "Supabase is not configured." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("register_online_payment_session", {
    p_student_id: input.studentId,
    p_invoice_id: input.invoiceId ?? null,
    p_amount: Math.round(input.amount),
    p_tx_ref: input.txRef,
    p_gateway: input.gateway ?? "flutterwave",
  });

  if (error) {
    console.error("[registerOnlinePaymentSessionInTransaction]", error);
    return { ok: false, code: "RPC_ERROR", message: error.message || "Could not register session." };
  }

  return parseRegisterRpc(data);
}

export async function settleOnlineFeePaymentInTransaction(input: {
  txRef: string;
  gatewayTransactionId: string;
  status: "successful" | "failed" | "cancelled";
  settledAmount: number;
  paymentChannel?: string | null;
  failureReason?: string | null;
}): Promise<SettleOnlinePaymentResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, code: "RPC_ERROR", message: "Supabase is not configured." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("settle_online_fee_payment", {
    p_tx_ref: input.txRef,
    p_gateway_transaction_id: input.gatewayTransactionId,
    p_status: input.status,
    p_settled_amount: Math.round(input.settledAmount),
    p_payment_channel: input.paymentChannel ?? "",
    p_failure_reason: input.failureReason ?? "",
  });

  if (error) {
    console.error("[settleOnlineFeePaymentInTransaction]", error);
    return { ok: false, code: "RPC_ERROR", message: error.message || "Could not settle payment." };
  }

  return parseSettleRpc(data);
}

export function onlinePaymentRpcHttpStatus(result: { ok: boolean; code?: string }): number {
  if (result.ok) return 200;
  switch (result.code) {
    case "AMOUNT_EXCEEDS_BALANCE":
    case "AMOUNT_MISMATCH":
    case "DUPLICATE_REFERENCE":
    case "DUPLICATE_GATEWAY_TX":
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
