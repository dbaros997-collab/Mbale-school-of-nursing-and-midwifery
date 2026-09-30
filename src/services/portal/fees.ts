import type { PaymentMethod } from "@/lib/portal/schema";

export type { FeesBundle, SubmitFeePaymentInput } from "@/services/portal/fees-shared";
export {
  buildCategorySummaries,
  computeFinancialClearance,
} from "@/services/portal/fees-shared";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mtn: "MTN Mobile Money",
  airtel: "Airtel Money",
  bank: "Bank transfer",
  online: "Online (card / mobile money)",
};
