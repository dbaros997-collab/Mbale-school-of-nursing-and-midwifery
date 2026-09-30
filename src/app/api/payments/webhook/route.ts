import { paymentWebhookResponse } from "@/lib/api/payment-route-utils";
import { handleFlutterwavePaymentWebhook } from "@/services/portal/online-payment-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/payments/webhook — Flutterwave success/failure callbacks.
 * Ledger updates run in a single Postgres transaction (Supabase RPC), equivalent to prisma.$transaction.
 */
export async function POST(request: Request) {
  const verifHash = request.headers.get("verif-hash");

  let rawBody: unknown;
  try {
    rawBody = JSON.parse(await request.text()) as unknown;
  } catch {
    return paymentWebhookResponse(false, 400);
  }

  const outcome = await handleFlutterwavePaymentWebhook(rawBody, verifHash);
  return paymentWebhookResponse(outcome.ok, outcome.httpStatus);
}
