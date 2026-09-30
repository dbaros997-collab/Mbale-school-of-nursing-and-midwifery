import type { Payment } from "@/lib/portal/schema";

/**
 * Submissions awaiting finance review only — excludes completed, approved, rejected, and failed payments.
 */
export function isPendingFeeVerification(p: Payment): boolean {
  if (p.verificationStatus === "approved" || p.verificationStatus === "rejected") {
    return false;
  }
  if (p.status === "completed" || p.status === "failed") {
    return false;
  }
  return p.verificationStatus === "pending_review";
}

export function sumPendingVerificationPayments(
  payments: Iterable<Payment>,
  studentId: string,
): number {
  let total = 0;
  for (const p of payments) {
    if (p.studentId === studentId && isPendingFeeVerification(p)) {
      total += p.amount;
    }
  }
  return total;
}

export function computePayableBalance(
  outstandingBalance: number,
  pendingUnverifiedTotal: number,
): number {
  return Math.max(0, Math.round(outstandingBalance) - Math.round(pendingUnverifiedTotal));
}

export function validatePaymentHeadroom(input: {
  outstandingBalance: number;
  pendingUnverifiedTotal: number;
  paymentAmount: number;
}): { ok: true; payableBalance: number } | { ok: false; message: string; payableBalance: number } {
  const payableBalance = computePayableBalance(
    input.outstandingBalance,
    input.pendingUnverifiedTotal,
  );
  const amount = Math.round(input.paymentAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, payableBalance, message: "Enter a valid payment amount." };
  }

  if (amount > payableBalance) {
    return {
      ok: false,
      payableBalance,
      message:
        payableBalance <= 0
          ? "Your remaining balance is fully reserved by other payments awaiting verification. Wait for finance to review them or contact the bursar."
          : `Amount exceeds available balance of UGX ${payableBalance.toLocaleString("en-UG")} after pending (unverified) submissions.`,
    };
  }

  return { ok: true, payableBalance };
}
