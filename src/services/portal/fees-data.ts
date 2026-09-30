import {
  getFeeLedgerRevision,
  getStudentFeeLedgerRevision,
  bumpStudentFeeLedgerRevision,
} from "@/lib/portal/fee-ledger-revision";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "@/lib/portal/constants";
import { resolveFeesStudentContext } from "@/lib/portal/resolve-fees-student";
import type { StudentProfile } from "@/lib/portal/schema";
import { buildPortalFeesBundleFromDb, touchStudentLedgerRevision } from "@/lib/supabase/portal-fee-bundle";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CURRENT_SEMESTER_LABEL } from "@/lib/supabase/admin-finance-store";
import {
  buildCategorySummaries,
  computeFinancialClearance,
  type FeesBundle,
  type SubmitFeePaymentInput,
} from "@/services/portal/fees-shared";
import { submitPortalFeePaymentTransaction } from "@/services/portal/fees-transaction-service";

export type { FeesBundle, SubmitFeePaymentInput };

function emptyFeesBundle(ctx: {
  studentId: string;
  studentName: string;
  studentNumber: string;
  studentEmail: string;
}): FeesBundle {
  const invoice = {
    id: `inv-${ctx.studentId}-empty`,
    studentId: ctx.studentId,
    semesterLabel: CURRENT_SEMESTER_LABEL,
    tuition: 0,
    functionalFees: 0,
    totalBilled: 0,
    totalPaid: 0,
    balance: 0,
    paymentDueDate: CURRENT_SEMESTER_FEE_DUE_ISO,
  };
  return {
    invoice,
    lineItems: [],
    payments: [],
    categories: buildCategorySummaries(invoice, []),
    financialClearance: computeFinancialClearance(invoice, []),
    studentName: ctx.studentName,
    studentNumber: ctx.studentNumber,
    studentEmail: ctx.studentEmail,
    payableBalance: 0,
    dataSource: "supabase",
    ledgerRevision: getStudentFeeLedgerRevision(ctx.studentId),
    alerts: [],
  };
}

async function loadBundle(
  studentId?: string | null,
  profile?: StudentProfile | null,
): Promise<FeesBundle> {
  const ctx = resolveFeesStudentContext(studentId, profile);
  if (!ctx) {
    return emptyFeesBundle({
      studentId: "unknown",
      studentName: "Student",
      studentNumber: "—",
      studentEmail: "",
    });
  }

  if (!isSupabaseConfigured()) {
    return emptyFeesBundle(ctx);
  }

  const fromDb = await buildPortalFeesBundleFromDb(ctx.studentId);
  return fromDb ?? emptyFeesBundle(ctx);
}

export async function peekFeesLedgerRevision(studentId?: string | null): Promise<number> {
  if (!studentId?.trim()) return getFeeLedgerRevision();
  return getStudentFeeLedgerRevision(studentId);
}

export async function getFeesBundleDataFast(
  studentId?: string | null,
  profile?: StudentProfile | null,
): Promise<FeesBundle> {
  return loadBundle(studentId, profile);
}

export async function getFeesBundleData(
  studentId?: string | null,
  profile?: StudentProfile | null,
): Promise<FeesBundle> {
  return loadBundle(studentId, profile);
}

export async function submitFeePaymentData(
  input: SubmitFeePaymentInput,
  studentId?: string | null,
  profile?: StudentProfile | null,
): Promise<{ ok: boolean; message: string; payment?: import("@/lib/portal/schema").Payment; bundle: FeesBundle }> {
  const ctx = resolveFeesStudentContext(studentId, profile);
  if (!ctx) {
    return {
      ok: false,
      message: "Sign in to submit a payment.",
      bundle: await loadBundle(studentId, profile),
    };
  }

  if (input.method === "online") {
    return {
      ok: false,
      message:
        "Use Pay online (card / mobile money) to open the Flutterwave checkout — no deposit slip required.",
      bundle: await loadBundle(studentId, profile),
    };
  }

  const result = await submitPortalFeePaymentTransaction({
    studentId: ctx.studentId,
    invoiceId: `inv-${ctx.studentId}`,
    amount: input.amount,
    method: input.method,
    transactionReference: input.transactionReference,
    depositSlipDataUrl: input.depositSlipDataUrl ?? null,
    depositSlipFileName: input.depositSlipFileName ?? null,
  });

  touchStudentLedgerRevision(ctx.studentId);

  const methodLabel =
    input.method === "mtn"
      ? "MTN Mobile Money"
      : input.method === "airtel"
        ? "Airtel Money"
        : "Bank transfer";

  if (!result.ok) {
    return {
      ok: false,
      message: result.message ?? "Could not submit payment.",
      bundle: await loadBundle(studentId, profile),
    };
  }

  return {
    ok: true,
    message: `Your ${methodLabel} payment of UGX ${Math.round(input.amount).toLocaleString("en-UG")} was submitted. Finance will verify your reference and deposit slip before updating your clearance.`,
    bundle: await loadBundle(studentId, profile),
  };
}

export async function peekGlobalFeesLedgerRevision(): Promise<number> {
  return getFeeLedgerRevision();
}
