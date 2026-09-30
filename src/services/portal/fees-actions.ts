"use server";

import {
  getFeesBundleData,
  submitFeePaymentData,
  type FeesBundle,
  type SubmitFeePaymentInput,
} from "@/services/portal/fees-data";
import type { Payment } from "@/lib/portal/schema";

export type { FeesBundle, SubmitFeePaymentInput };

export async function getFeesBundle(studentId?: string | null): Promise<FeesBundle> {
  return getFeesBundleData(studentId);
}

export async function submitFeePayment(
  input: SubmitFeePaymentInput,
  studentId?: string | null,
): Promise<{ ok: boolean; message: string; payment?: Payment; bundle: FeesBundle }> {
  return submitFeePaymentData(input, studentId);
}
