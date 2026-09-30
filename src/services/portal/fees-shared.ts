import type {
  FeeCategorySummary,
  FeeInvoice,
  FeeLineItem,
  FinancialClearanceStatus,
  Payment,
} from "@/lib/portal/schema";
import { isPendingFeeVerification } from "@/lib/portal/fee-pending-reservations";
import type { FeeFinanceAlert } from "@/services/portal/fees-finance-alerts";

export type FeesBundle = {
  invoice: FeeInvoice;
  lineItems: FeeLineItem[];
  payments: Payment[];
  categories: FeeCategorySummary[];
  financialClearance: FinancialClearanceStatus;
  studentName: string;
  studentNumber: string;
  studentEmail: string;
  /** Outstanding minus only unverified pending submissions (amount student can still pay). */
  payableBalance: number;
  dataSource: "mock" | "supabase";
  ledgerRevision: number;
  alerts: FeeFinanceAlert[];
};

export type SubmitFeePaymentInput = {
  amount: number;
  method: import("@/lib/portal/schema").PaymentMethod;
  transactionReference: string;
  depositSlipDataUrl?: string | null;
  depositSlipFileName?: string | null;
};

/** Allocate total paid across line items proportionally for category outstanding balances */
export function buildCategorySummaries(
  invoice: FeeInvoice,
  lineItems: FeeLineItem[],
): FeeCategorySummary[] {
  const tuitionPaid = invoice.totalBilled
    ? Math.round((invoice.tuition / invoice.totalBilled) * invoice.totalPaid)
    : 0;
  const functionalPaid = invoice.totalBilled
    ? Math.round((invoice.functionalFees / invoice.totalBilled) * invoice.totalPaid)
    : 0;

  const headline: FeeCategorySummary[] = [
    {
      category: "Tuition",
      billed: invoice.tuition,
      paid: tuitionPaid,
      outstanding: Math.max(0, invoice.tuition - tuitionPaid),
    },
    {
      category: "Functional fees",
      billed: invoice.functionalFees,
      paid: functionalPaid,
      outstanding: Math.max(0, invoice.functionalFees - functionalPaid),
    },
  ];

  const otherLines = lineItems.filter(
    (line) =>
      !line.label.toLowerCase().includes("tuition") &&
      !line.label.toLowerCase().includes("functional"),
  );

  const otherBilled = otherLines.reduce((sum, line) => sum + line.amount, 0);
  const otherPaid = invoice.totalBilled
    ? Math.round((otherBilled / invoice.totalBilled) * invoice.totalPaid)
    : 0;

  if (otherLines.length > 0) {
    headline.push({
      category: "Other levies",
      billed: otherBilled,
      paid: otherPaid,
      outstanding: Math.max(0, otherBilled - otherPaid),
    });
  }

  return headline;
}

export function computeFinancialClearance(
  invoice: FeeInvoice,
  payments: Payment[],
): FinancialClearanceStatus {
  const pendingReview = payments.some(
    (p) => p.studentId === invoice.studentId && isPendingFeeVerification(p),
  );
  if (pendingReview) return "pending_verification";
  if (invoice.balance <= 0) return "cleared";
  return "outstanding";
}
