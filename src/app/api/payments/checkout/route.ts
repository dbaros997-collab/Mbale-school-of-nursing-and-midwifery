import { paymentApiJson } from "@/lib/api/payment-route-utils";
import { startOnlineFeeCheckout } from "@/services/portal/online-payment-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  studentId?: string;
  invoiceId?: string;
  amount?: number;
  studentEmail?: string;
  studentName?: string;
};

/** POST /api/payments/checkout — register session + Flutterwave hosted checkout (UGX) */
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return paymentApiJson({ ok: false, code: "INVALID_INPUT", message: "Invalid JSON body." }, 400);
  }

  const studentId = body.studentId?.trim() ?? "";
  const invoiceId = body.invoiceId?.trim() ?? "";
  const amount = Math.round(Number(body.amount));

  if (!studentId) {
    return paymentApiJson(
      { ok: false, code: "INVALID_INPUT", message: "studentId is required." },
      400,
    );
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return paymentApiJson(
      { ok: false, code: "INVALID_INPUT", message: "Enter a valid payment amount." },
      400,
    );
  }

  const result = await startOnlineFeeCheckout({
    studentId,
    invoiceId,
    amount,
    studentEmail: body.studentEmail?.trim(),
    studentName: body.studentName?.trim(),
  });

  if (!result.ok) {
    const status =
      result.code === "INVALID_INPUT"
        ? 400
        : result.code === "AMOUNT_EXCEEDS_BALANCE" || result.code === "DUPLICATE_REFERENCE"
          ? 409
          : result.code === "GATEWAY_UNAVAILABLE"
            ? 503
            : 502;
    return paymentApiJson(
      {
        ok: false,
        code: result.code,
        message: result.message,
        ...(result.txRef ? { txRef: result.txRef } : {}),
      },
      status,
    );
  }

  return paymentApiJson(
    {
      ok: true,
      checkoutUrl: result.checkoutUrl,
      txRef: result.txRef,
      amount: result.amount,
      currency: result.currency,
      redirectMode: result.redirectMode,
    },
    201,
  );
}
