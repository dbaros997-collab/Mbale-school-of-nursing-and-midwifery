import { resolveCheckoutCustomer } from "@/lib/payments/checkout-customer";
import {
  buildFeePaymentTxRef,
  createFlutterwaveCheckout,
  getFlutterwaveConfig,
  isFlutterwaveConfigured,
  mapFlutterwaveStatus,
  parseFlutterwaveWebhook,
  verifyFlutterwaveWebhookSignature,
  type FlutterwaveWebhookPayload,
} from "@/lib/payments/flutterwave";
import { bumpFeeLedgerRevision } from "@/lib/portal/fee-ledger-revision";
import { peekStudentOutstandingBalance } from "@/lib/portal/fee-student-ledger";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStudentLatestBalance } from "@/lib/supabase/admin-finance-store";
import {
  registerOnlinePaymentSessionInTransaction,
  settleOnlineFeePaymentInTransaction,
} from "@/lib/supabase/online-payment-transactions";

export type StartOnlineCheckoutInput = {
  studentId: string;
  invoiceId: string;
  amount: number;
  studentEmail?: string;
  studentName?: string;
};

export type StartOnlineCheckoutResult =
  | {
      ok: true;
      checkoutUrl: string;
      txRef: string;
      amount: number;
      currency: "UGX";
      redirectMode: "hosted";
    }
  | { ok: false; message: string; code?: string; txRef?: string };

function resolveSiteOrigin(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:5173";
}

export async function startOnlineFeeCheckout(
  input: StartOnlineCheckoutInput,
): Promise<StartOnlineCheckoutResult> {
  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, code: "INVALID_INPUT", message: "Enter a valid payment amount." };
  }

  if (!isFlutterwaveConfigured()) {
    return {
      ok: false,
      code: "GATEWAY_UNAVAILABLE",
      message: "Online payments are not configured. Contact finance or use bank deposit.",
    };
  }

  const customerResult = await resolveCheckoutCustomer({
    studentId: input.studentId,
    hintEmail: input.studentEmail,
    hintName: input.studentName,
  });
  if (!customerResult.ok) {
    return { ok: false, code: "INVALID_INPUT", message: customerResult.message };
  }
  const { customer } = customerResult;

  const txRef = buildFeePaymentTxRef(customer.studentId);
  const redirectUrl = `${resolveSiteOrigin()}/portal/fees?online_payment=return&tx_ref=${encodeURIComponent(txRef)}`;

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      code: "GATEWAY_UNAVAILABLE",
      message: "Online payments require a live Supabase ledger. Contact finance or use bank deposit.",
    };
  }

  const registered = await registerOnlinePaymentSessionInTransaction({
    studentId: customer.studentId,
    invoiceId: input.invoiceId,
    amount,
    txRef,
    gateway: "flutterwave",
  });
  if (!registered.ok) {
    return { ok: false, code: registered.code, message: registered.message };
  }

  const checkout = await createFlutterwaveCheckout({
    txRef,
    amount,
    currency: "UGX",
    redirectUrl,
    customerEmail: customer.email,
    customerName: customer.fullName,
    customerPhone: customer.phone,
    title: "School fees payment",
    description: "Mbale School of Nursing and Midwifery — semester fees",
    meta: {
      student_id: customer.studentId,
      invoice_id: input.invoiceId,
      customer_email: customer.email,
    },
  });

  if (!checkout.ok) {
    return {
      ok: false,
      code: "GATEWAY_ERROR",
      message: checkout.message,
      txRef,
    };
  }

  const checkoutUrl = checkout.checkoutUrl.trim();
  if (!checkoutUrl.startsWith("https://")) {
    return {
      ok: false,
      code: "GATEWAY_ERROR",
      message: "Payment gateway returned an invalid checkout link.",
      txRef,
    };
  }

  return {
    ok: true,
    checkoutUrl,
    txRef,
    amount,
    currency: "UGX",
    redirectMode: "hosted",
  };
}

export type PaymentWebhookOutcome = {
  ok: boolean;
  httpStatus: number;
  message: string;
  studentId?: string;
  ledgerRevision?: number;
  alreadySettled?: boolean;
};

/**
 * Runs gateway settlement inside a single DB transaction (Supabase RPC), then bumps
 * the in-memory ledger revision so `/api/portal/fees/sync` picks up the change immediately.
 */
export async function runPaymentWebhookTransaction(input: {
  txRef: string;
  gatewayTransactionId: string;
  status: "successful" | "failed" | "cancelled";
  settledAmount: number;
  paymentChannel?: string | null;
  failureReason?: string | null;
}): Promise<PaymentWebhookOutcome> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      httpStatus: 503,
      message: "Payment settlement requires Supabase.",
    };
  }

  const result = await settleOnlineFeePaymentInTransaction(input);
  if (!result.ok) {
    return {
      ok: false,
      httpStatus: result.code === "NOT_FOUND" ? 404 : result.code === "INVALID_INPUT" ? 400 : 409,
      message: result.message,
    };
  }

  const revision = bumpFeeLedgerRevision();
  return {
    ok: true,
    httpStatus: 200,
    message: result.code === "ALREADY_SETTLED" ? "Payment already settled." : "Payment settled.",
    studentId: result.session.studentId,
    ledgerRevision: revision,
    alreadySettled: result.code === "ALREADY_SETTLED",
  };
}

const FLUTTERWAVE_SETTLEMENT_EVENTS = new Set([
  "charge.completed",
  "charge.failed",
]);

export async function handleFlutterwavePaymentWebhook(
  rawBody: unknown,
  verifHash: string | null,
): Promise<PaymentWebhookOutcome> {
  const config = getFlutterwaveConfig();
  if (!config) {
    return { ok: false, httpStatus: 503, message: "Payment gateway not configured." };
  }

  if (!verifyFlutterwaveWebhookSignature(verifHash, config)) {
    return { ok: false, httpStatus: 401, message: "Invalid webhook signature." };
  }

  const payload = parseFlutterwaveWebhook(rawBody);
  const eventName = payload?.event?.toLowerCase() ?? "";
  if (eventName && !FLUTTERWAVE_SETTLEMENT_EVENTS.has(eventName)) {
    return { ok: true, httpStatus: 200, message: "Event ignored." };
  }

  if (!payload?.data?.tx_ref) {
    return { ok: false, httpStatus: 400, message: "Invalid webhook payload." };
  }

  return processGatewaySettlementFromPayload(payload);
}

export async function processGatewaySettlementFromPayload(
  payload: FlutterwaveWebhookPayload,
): Promise<PaymentWebhookOutcome> {
  const data = payload.data!;
  const txRef = String(data.tx_ref);
  const gatewayTransactionId = data.id != null ? String(data.id) : txRef;
  const status = mapFlutterwaveStatus(data.status);
  const settledAmount = Math.round(Number(data.amount ?? 0));

  if (status === "successful" && settledAmount <= 0) {
    return { ok: false, httpStatus: 400, message: "Missing settled amount." };
  }

  return runPaymentWebhookTransaction({
    txRef,
    gatewayTransactionId,
    status,
    settledAmount: status === "successful" ? settledAmount : 0,
    paymentChannel: data.payment_type ?? null,
    failureReason: status === "successful" ? null : data.processor_response ?? payload.event ?? null,
  });
}

export async function peekOutstandingBalanceForStudent(studentId: string): Promise<number> {
  if (isSupabaseConfigured()) {
    return getStudentLatestBalance(studentId);
  }
  return peekStudentOutstandingBalance(studentId);
}
