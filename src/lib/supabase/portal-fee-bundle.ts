import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildDefaultFeeLineItems } from "@/lib/portal/fee-student-ledger";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "@/lib/portal/constants";
import type { FeeInvoice, Payment, PaymentMethod } from "@/lib/portal/schema";
import {
  buildCategorySummaries,
  computeFinancialClearance,
  type FeesBundle,
} from "@/services/portal/fees-shared";
import { buildStudentFeeAlerts } from "@/services/portal/fees-finance-alerts";
import { getStudentFeeLedgerRevision, bumpStudentFeeLedgerRevision } from "@/lib/portal/fee-ledger-revision";
import { CURRENT_SEMESTER_LABEL } from "@/lib/supabase/admin-finance-store";

async function loadStudentMeta(studentId: string): Promise<{
  fullName: string;
  email: string;
  studentNumber: string;
} | null> {
  const supabase = createAdminClient();
  const { data: student } = await supabase
    .from("students")
    .select("full_name, email")
    .eq("id", studentId)
    .maybeSingle();
  if (!student) return null;

  const { data: activation } = await supabase
    .from("student_portal_activation")
    .select("student_number")
    .eq("student_id", studentId)
    .maybeSingle();

  return {
    fullName: String(student.full_name),
    email: String(student.email),
    studentNumber: activation?.student_number
      ? String(activation.student_number)
      : studentId,
  };
}

async function loadFeePayments(studentId: string): Promise<Payment[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fee_payments")
    .select(
      "id, student_id, amount_paid, payment_date, payment_method, transaction_reference, created_at",
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[loadFeePayments]", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const rawMethod = String(row.payment_method);
    const method: PaymentMethod =
      rawMethod === "mtn" || rawMethod === "airtel" || rawMethod === "bank" || rawMethod === "online"
        ? rawMethod
        : "bank";
    return {
      id: String(row.id),
      invoiceId: `inv-${studentId}`,
      studentId,
      amount: Number(row.amount_paid),
      method,
      reference:
        row.transaction_reference?.trim() ||
        `PAY-${String(row.id).slice(0, 8).toUpperCase()}`,
      transactionReference: row.transaction_reference,
      status: "completed",
      paidAt: row.created_at ?? `${row.payment_date}T12:00:00.000Z`,
      verificationStatus: "approved",
    };
  });
}

async function loadPendingSubmissionsTotal(studentId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bank_payment_submissions")
    .select("amount")
    .eq("student_id", studentId)
    .eq("status", "pending_review");

  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}

async function loadPendingOnlineTotal(studentId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("online_payment_sessions")
    .select("amount")
    .eq("student_id", studentId)
    .eq("status", "pending");

  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}

async function loadLatestBalance(studentId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("fee_payments")
    .select("balance_due")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ? Number(data.balance_due) : 0;
}

export async function buildPortalFeesBundleFromDb(
  studentId: string,
): Promise<FeesBundle | null> {
  if (!isSupabaseConfigured()) return null;

  const meta = await loadStudentMeta(studentId);
  if (!meta) return null;

  const [payments, balance, manualPending, onlinePending] = await Promise.all([
    loadFeePayments(studentId),
    loadLatestBalance(studentId),
    loadPendingSubmissionsTotal(studentId),
    loadPendingOnlineTotal(studentId),
  ]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalBilled = totalPaid + balance;
  const invoiceId = `inv-${studentId}-${CURRENT_SEMESTER_LABEL.replace(/\s+/g, "-").toLowerCase()}`;

  const invoice: FeeInvoice = {
    id: invoiceId,
    studentId,
    semesterLabel: CURRENT_SEMESTER_LABEL,
    tuition: totalBilled > 0 ? Math.round((totalBilled * 1_200_000) / 1_450_000) : 0,
    functionalFees: totalBilled > 0 ? totalBilled - Math.round((totalBilled * 1_200_000) / 1_450_000) : 0,
    totalBilled,
    totalPaid,
    balance,
    paymentDueDate: CURRENT_SEMESTER_FEE_DUE_ISO,
  };

  if (totalBilled === 0) {
    invoice.tuition = 0;
    invoice.functionalFees = 0;
  }

  const lineItems =
    totalBilled > 0
      ? buildDefaultFeeLineItems(invoiceId).map((line) => ({
          ...line,
          amount: Math.round((line.amount / 1_450_000) * totalBilled),
        }))
      : [];

  const financialClearance = computeFinancialClearance(invoice, payments);
  const pendingTotal = manualPending + onlinePending;
  const payableBalance = Math.max(0, balance - pendingTotal);

  return {
    invoice,
    lineItems,
    payments,
    categories: buildCategorySummaries(invoice, lineItems),
    financialClearance,
    studentName: meta.fullName,
    studentNumber: meta.studentNumber,
    studentEmail: meta.email,
    payableBalance,
    dataSource: "supabase",
    ledgerRevision: getStudentFeeLedgerRevision(studentId),
    alerts: buildStudentFeeAlerts({ invoice, payments, financialClearance }),
  };
}

export function touchStudentLedgerRevision(studentId: string) {
  bumpStudentFeeLedgerRevision(studentId);
}
