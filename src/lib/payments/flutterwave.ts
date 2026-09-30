import { createHash } from "crypto";
import { supabaseKeepAliveFetch } from "@/lib/supabase/http-client";

export type FlutterwaveConfig = {
  publicKey: string;
  secretKey: string;
  webhookSecretHash: string;
};

export function getFlutterwaveConfig(): FlutterwaveConfig | null {
  const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY?.trim() ?? "";
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY?.trim() ?? "";
  const webhookSecretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim() ?? "";
  if (!publicKey || !secretKey || !webhookSecretHash) return null;
  return { publicKey, secretKey, webhookSecretHash };
}

export function isFlutterwaveConfigured(): boolean {
  return getFlutterwaveConfig() !== null;
}

export type FlutterwaveCheckoutInput = {
  txRef: string;
  amount: number;
  currency?: string;
  redirectUrl: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  meta?: Record<string, string>;
  title?: string;
  description?: string;
};

export type FlutterwaveCheckoutResult =
  | { ok: true; checkoutUrl: string; flwRef?: string }
  | { ok: false; message: string };

/** Hosted payment page — supports UGX cards and Uganda mobile money on Flutterwave. */
export async function createFlutterwaveCheckout(
  input: FlutterwaveCheckoutInput,
): Promise<FlutterwaveCheckoutResult> {
  const config = getFlutterwaveConfig();
  if (!config) {
    return { ok: false, message: "Flutterwave is not configured." };
  }

  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Invalid payment amount." };
  }

  const res = await supabaseKeepAliveFetch()("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount,
      currency: input.currency ?? "UGX",
      redirect_url: input.redirectUrl,
      customer: {
        email: input.customerEmail,
        name: input.customerName,
        ...(input.customerPhone ? { phonenumber: input.customerPhone } : {}),
      },
      customizations: {
        title: input.title ?? "School fees",
        description: input.description ?? "Mbale School of Nursing and Midwifery",
      },
      meta: input.meta ?? {},
    }),
  });

  const json = (await res.json()) as {
    status?: string;
    message?: string;
    data?: { link?: string; flw_ref?: string };
  };

  if (!res.ok || json.status !== "success" || !json.data?.link) {
    return {
      ok: false,
      message: json.message ?? "Could not start Flutterwave checkout.",
    };
  }

  return { ok: true, checkoutUrl: json.data.link, flwRef: json.data.flw_ref };
}

export function verifyFlutterwaveWebhookSignature(
  verifHashHeader: string | null,
  config: FlutterwaveConfig = getFlutterwaveConfig()!,
): boolean {
  if (!verifHashHeader || !config.webhookSecretHash) return false;
  return verifHashHeader === config.webhookSecretHash;
}

export type FlutterwaveWebhookPayload = {
  event?: string;
  data?: {
    id?: number | string;
    tx_ref?: string;
    amount?: number;
    currency?: string;
    status?: string;
    payment_type?: string;
    processor_response?: string;
    customer?: { email?: string; name?: string };
  };
};

export function parseFlutterwaveWebhook(body: unknown): FlutterwaveWebhookPayload | null {
  if (!body || typeof body !== "object") return null;
  return body as FlutterwaveWebhookPayload;
}

export function mapFlutterwaveStatus(status: string | undefined): "successful" | "failed" | "cancelled" {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "successful") return "successful";
  if (normalized === "cancelled") return "cancelled";
  return "failed";
}

/** Deterministic tx_ref for a student checkout attempt */
export function buildFeePaymentTxRef(studentId: string): string {
  const stamp = Date.now().toString(36);
  const digest = createHash("sha256")
    .update(`${studentId}:${stamp}:${Math.random()}`)
    .digest("hex")
    .slice(0, 10);
  return `MBS-FEE-${studentId.slice(0, 12)}-${stamp}-${digest}`.toUpperCase();
}
