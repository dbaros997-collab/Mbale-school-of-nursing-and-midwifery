import {
  MOCK_FEE_LINES,
  MOCK_PROFILE,
  addMockPayment,
  mockInvoice,
  mockPayments,
  setMockInvoice,
} from "@/lib/portal/mock-store";
import type {
  FeeInvoice,
  FeeLineItem,
  Payment,
  PaymentMethod,
} from "@/lib/portal/schema";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type FeesBundle = {
  invoice: FeeInvoice;
  lineItems: FeeLineItem[];
  payments: Payment[];
  studentName: string;
  studentNumber: string;
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mtn: "MTN Mobile Money",
  airtel: "Airtel Money",
  bank: "Bank transfer",
};

function snapshot(): FeesBundle {
  return {
    invoice: { ...mockInvoice },
    lineItems: MOCK_FEE_LINES.filter((l) => l.invoiceId === mockInvoice.id),
    payments: [...mockPayments].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime(),
    ),
    studentName: MOCK_PROFILE.fullName,
    studentNumber: MOCK_PROFILE.studentNumber,
  };
}

/** Ready for GET /api/portal/fees */
export async function getFeesBundle(): Promise<FeesBundle> {
  await delay(280);
  return snapshot();
}

export type PayFeesInput = {
  amount: number;
  method: PaymentMethod;
  phoneOrAccount: string;
};

/** Ready for POST /api/portal/fees/pay (MTN / Airtel / bank mock gateway) */
export async function payFees(
  input: PayFeesInput,
): Promise<{ ok: boolean; message: string; payment?: Payment; bundle: FeesBundle }> {
  await delay(700);

  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Enter a valid payment amount.", bundle: snapshot() };
  }
  if (amount > mockInvoice.balance) {
    return {
      ok: false,
      message: `Amount exceeds outstanding balance of UGX ${mockInvoice.balance.toLocaleString("en-UG")}.`,
      bundle: snapshot(),
    };
  }
  if (!input.phoneOrAccount.trim()) {
    return {
      ok: false,
      message:
        input.method === "bank"
          ? "Enter the bank account or transfer reference."
          : "Enter the Mobile Money phone number.",
      bundle: snapshot(),
    };
  }

  // Simulate occasional gateway failure for realism (never on exact 100k multiples)
  if (amount === 13_000) {
    return {
      ok: false,
      message: "Payment gateway timed out. Please try again.",
      bundle: snapshot(),
    };
  }

  const prefix =
    input.method === "mtn" ? "MTN" : input.method === "airtel" ? "AIR" : "BNK";
  const reference = `${prefix}-${Date.now().toString().slice(-8)}-${Math.floor(
    Math.random() * 90000 + 10000,
  )}`;

  const payment: Payment = {
    id: `pay-${Date.now()}`,
    invoiceId: mockInvoice.id,
    studentId: MOCK_PROFILE.id,
    amount,
    method: input.method,
    reference,
    status: "completed",
    paidAt: new Date().toISOString(),
  };

  addMockPayment(payment);

  const totalPaid = mockInvoice.totalPaid + amount;
  const balance = Math.max(0, mockInvoice.totalBilled - totalPaid);
  setMockInvoice({
    ...mockInvoice,
    totalPaid,
    balance,
  });

  return {
    ok: true,
    message: `Payment of UGX ${amount.toLocaleString("en-UG")} via ${PAYMENT_METHOD_LABELS[input.method]} succeeded.`,
    payment,
    bundle: snapshot(),
  };
}
