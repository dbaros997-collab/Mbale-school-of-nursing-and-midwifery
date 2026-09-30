import type { FeesBundle } from "@/services/portal/fees-shared";
import type { Payment } from "@/lib/portal/schema";

function pendingKey(p: Payment): boolean {
  return (
    p.verificationStatus === "pending_review" ||
    (p.status === "pending" && p.method === "bank")
  );
}

/** Detect finance approve/reject after a realtime ledger refresh. */
export function detectFeeReviewOutcome(
  previous: FeesBundle | null,
  next: FeesBundle,
): "approved" | "rejected" | null {
  if (!previous) return null;

  for (const payment of next.payments) {
    const before = previous.payments.find((p) => p.id === payment.id);
    if (!before) continue;

    if (pendingKey(before) && payment.verificationStatus === "approved") {
      return "approved";
    }
    if (
      pendingKey(before) &&
      (payment.verificationStatus === "rejected" || payment.status === "failed")
    ) {
      return "rejected";
    }
  }

  return null;
}

export function feeAlertSummary(alerts: FeesBundle["alerts"]) {
  const count = alerts.length;
  if (count === 0) {
    return { count: 0, severity: null as null | "info" | "warning" | "danger" };
  }
  const order = { danger: 3, warning: 2, info: 1 } as const;
  let severity: "info" | "warning" | "danger" = "info";
  for (const alert of alerts) {
    if (order[alert.severity] > order[severity]) {
      severity = alert.severity;
    }
  }
  return { count, severity };
}
