"use server";

import { requireStaffAuth } from "@/lib/admin/require-staff-auth";
import {
  adjustStudentBalanceData,
  getAdminFeesBundleData,
  recordStudentPaymentData,
  reviewStudentPaymentData,
} from "@/services/portal/admin/fees-data";
import type {
  AdjustBalanceInput,
  AdminFeesBundle,
  RecordPaymentInput,
  ReviewPaymentInput,
} from "@/services/portal/admin/fees-types";

export type {
  AdjustBalanceInput,
  AdminFeesBundle,
  RecordPaymentInput,
  ReviewPaymentInput,
} from "@/services/portal/admin/fees-types";

async function assertStaffAction(): Promise<void> {
  const auth = await requireStaffAuth();
  if (!auth.authorized) {
    throw new Error("Unauthorized. Staff sign-in is required.");
  }
}

export async function getAdminFeesBundle(): Promise<AdminFeesBundle> {
  await assertStaffAction();
  return getAdminFeesBundleData();
}

export async function recordStudentPayment(
  input: RecordPaymentInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  await assertStaffAction();
  return recordStudentPaymentData(input);
}

export async function adjustStudentBalance(
  input: AdjustBalanceInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  await assertStaffAction();
  return adjustStudentBalanceData(input);
}

export async function reviewStudentPayment(
  input: ReviewPaymentInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  await assertStaffAction();
  return reviewStudentPaymentData(input);
}
