import { withAdminFinanceAccess } from "@/lib/api/admin-finance-route";
import { paymentApiJson } from "@/lib/api/payment-route-utils";
import { reviewAdminFeePaymentTransaction } from "@/services/portal/fees-transaction-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReviewBody = {
  submissionId?: string;
  decision?: "approved" | "rejected";
  verifiedReference?: string;
  reviewNote?: string | null;
};

/** POST /api/admin/fees/verify — atomic approve/reject with ledger update */
export async function POST(request: Request) {
  return withAdminFinanceAccess(async () => {
    let body: ReviewBody;
    try {
      body = (await request.json()) as ReviewBody;
    } catch {
      return paymentApiJson({ ok: false, code: "INVALID_INPUT", message: "Invalid JSON body." }, 400);
    }

    const result = await reviewAdminFeePaymentTransaction({
      submissionId: body.submissionId ?? "",
      decision: body.decision ?? "rejected",
      verifiedReference: body.verifiedReference,
      reviewNote: body.reviewNote ?? null,
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
  });
}
