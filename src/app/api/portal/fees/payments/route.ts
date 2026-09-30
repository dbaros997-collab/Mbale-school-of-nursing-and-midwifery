import { submitPortalFeePaymentTransaction } from "@/services/portal/fees-transaction-service";
import type { PaymentMethod } from "@/lib/portal/schema";

import { paymentApiJson } from "@/lib/api/payment-route-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  studentId?: string;
  invoiceId?: string | null;
  amount?: number;
  method?: PaymentMethod;
  transactionReference?: string;
  depositSlipDataUrl?: string | null;
  depositSlipFileName?: string | null;
};

/** POST /api/portal/fees/payments — atomic student fee / bank slip submission */
export async function POST(request: Request) {
  let body: SubmitBody;
  try {
    body = (await request.json()) as SubmitBody;
  } catch {
    return paymentApiJson({ ok: false, code: "INVALID_INPUT", message: "Invalid JSON body." }, 400);
  }

  const result = await submitPortalFeePaymentTransaction({
    studentId: body.studentId ?? "",
    invoiceId: body.invoiceId ?? null,
    amount: Number(body.amount),
    method: body.method ?? "bank",
    transactionReference: body.transactionReference ?? "",
    depositSlipDataUrl: body.depositSlipDataUrl ?? null,
    depositSlipFileName: body.depositSlipFileName ?? null,
  });

  return paymentApiJson(
    {
      ok: result.ok,
      code: result.code,
      message: result.message,
      submission: result.submission,
    },
    result.httpStatus,
  );
}
