import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFinanceDataError } from "@/lib/supabase/admin-finance-errors";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "@/lib/portal/constants";
import type { AdminStudentRecord, Payment, PaymentMethod, StudentAccountStatus } from "@/lib/portal/schema";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import type { AdminFeePaymentRow } from "@/services/portal/admin/fees-query-types";
import { computeFinancialClearance } from "@/services/portal/fees-shared";

export const CURRENT_SEMESTER_LABEL = "Semester 1, 2025/26";

type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  enrollment_date: string;
  course_enrolled: string;
};

type ActivationNumberRow = {
  student_id: string;
  student_number: string;
};

type FeePaymentRow = {
  id: string;
  student_id: string;
  amount_paid: number;
  balance_due: number;
  payment_date: string;
  payment_method: string;
  transaction_reference: string | null;
  created_at: string;
};

function mapAccountStatus(status: string): StudentAccountStatus {
  switch (status) {
    case "pending":
      return "pending_approval";
    case "inactive":
    case "withdrawn":
      return "inactive";
    case "graduated":
      return "inactive";
    default:
      return "active";
  }
}

async function loadStudentNumbers(): Promise<Map<string, string>> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("student_portal_activation")
    .select("student_id, student_number");
  const map = new Map<string, string>();
  for (const row of (data ?? []) as ActivationNumberRow[]) {
    map.set(row.student_id, row.student_number);
  }
  return map;
}

async function loadLatestBalances(): Promise<
  Map<string, { balance: number; totalPaid: number; totalBilled: number }>
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fee_payments")
    .select("student_id, amount_paid, balance_due, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[loadLatestBalances]", error);
    throw new AdminFinanceDataError(
      error.message || "Could not load fee balances from Supabase.",
      "loadLatestBalances",
    );
  }

  const paidByStudent = new Map<string, number>();
  const latestBalance = new Map<string, number>();

  for (const row of data ?? []) {
    const sid = String(row.student_id);
    paidByStudent.set(sid, (paidByStudent.get(sid) ?? 0) + Number(row.amount_paid));
    latestBalance.set(sid, Number(row.balance_due));
  }

  const result = new Map<string, { balance: number; totalPaid: number; totalBilled: number }>();
  for (const [studentId, totalPaid] of paidByStudent) {
    const balance = latestBalance.get(studentId) ?? 0;
    result.set(studentId, {
      balance,
      totalPaid,
      totalBilled: totalPaid + balance,
    });
  }

  for (const [studentId, balance] of latestBalance) {
    if (!result.has(studentId)) {
      result.set(studentId, { balance, totalPaid: 0, totalBilled: balance });
    }
  }

  return result;
}

function rowToAdminStudent(
  row: StudentRow,
  numbers: Map<string, string>,
  fees: Map<string, { balance: number; totalPaid: number; totalBilled: number }>,
  paymentCount: number,
): AdminFeeStudentRow {
  const fee = fees.get(row.id) ?? { balance: 0, totalPaid: 0, totalBilled: 0 };
  const base: AdminStudentRecord = {
    id: row.id,
    userId: `user-${row.id}`,
    studentNumber: numbers.get(row.id) ?? row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    programId: row.course_enrolled,
    address: "",
    accountStatus: mapAccountStatus(row.status),
    feeBalance: fee.balance,
    feeTotalPaid: fee.totalPaid,
    feeTotalBilled: fee.totalBilled,
    enrolledUnits: 0,
    cumulativeGpa: 0,
    registeredAt: row.enrollment_date,
  };
  const invoiceLike = {
    balance: fee.balance,
    totalBilled: fee.totalBilled,
    totalPaid: fee.totalPaid,
    tuition: 0,
    functionalFees: 0,
    id: "",
    studentId: row.id,
    semesterLabel: "",
  };
  return {
    ...base,
    paymentCount,
    financialClearance: computeFinancialClearance(invoiceLike, []),
  };
}

export async function fetchAdminFeeStudentRowsFromDb(): Promise<AdminFeeStudentRow[]> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is not configured for admin finance.",
      "fetchAdminFeeStudentRowsFromDb",
    );
  }

  const supabase = createAdminClient();
  const [studentsRes, numbers, balances] = await Promise.all([
    supabase.from("students").select("*").order("full_name"),
    loadStudentNumbers(),
    loadLatestBalances(),
  ]);

  if (studentsRes.error) {
    console.error("[fetchAdminFeeStudentRowsFromDb]", studentsRes.error);
    throw new AdminFinanceDataError(
      studentsRes.error.message || "Could not load students from Supabase.",
      "fetchAdminFeeStudentRowsFromDb",
    );
  }

  const paymentsRes = await supabase
    .from("fee_payments")
    .select("student_id")
    .gt("amount_paid", 0);

  if (paymentsRes.error) {
    console.error("[fetchAdminFeeStudentRowsFromDb] payment counts", paymentsRes.error);
    throw new AdminFinanceDataError(
      paymentsRes.error.message || "Could not load payment counts from Supabase.",
      "fetchAdminFeeStudentRowsFromDb",
    );
  }

  const paymentCounts = new Map<string, number>();
  for (const p of paymentsRes.data ?? []) {
    const sid = String(p.student_id);
    paymentCounts.set(sid, (paymentCounts.get(sid) ?? 0) + 1);
  }

  return ((studentsRes.data ?? []) as StudentRow[]).map((row) =>
    rowToAdminStudent(row, numbers, balances, paymentCounts.get(row.id) ?? 0),
  );
}

export async function countAdminFeePaymentsFromDb(): Promise<number> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is not configured for admin finance.",
      "countAdminFeePaymentsFromDb",
    );
  }

  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("fee_payments")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("[countAdminFeePaymentsFromDb]", error);
    throw new AdminFinanceDataError(
      error.message || "Could not count fee payments.",
      "countAdminFeePaymentsFromDb",
    );
  }

  return count ?? 0;
}

export async function fetchAdminFeePaymentsFromDb(limit = 2000): Promise<AdminFeePaymentRow[]> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is not configured for admin finance.",
      "fetchAdminFeePaymentsFromDb",
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("fee_payments")
    .select(
      "id, student_id, amount_paid, balance_due, payment_date, payment_method, transaction_reference, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[fetchAdminFeePaymentsFromDb]", error);
    throw new AdminFinanceDataError(
      error.message || "Could not load fee payments from Supabase.",
      "fetchAdminFeePaymentsFromDb",
    );
  }

  const studentIds = [...new Set((data ?? []).map((r) => String(r.student_id)))];
  const nameById = new Map<string, { name: string; number: string }>();

  if (studentIds.length > 0) {
    const [students, numbers] = await Promise.all([
      supabase.from("students").select("id, full_name, email").in("id", studentIds),
      loadStudentNumbers(),
    ]);
    for (const s of students.data ?? []) {
      nameById.set(String(s.id), {
        name: String(s.full_name),
        number: numbers.get(String(s.id)) ?? String(s.id),
      });
    }
  }

  return ((data ?? []) as FeePaymentRow[]).map((row) => {
    const meta = nameById.get(row.student_id) ?? { name: "Unknown student", number: "—" };
    const rawMethod = String(row.payment_method);
    const method: PaymentMethod =
      rawMethod === "mtn" || rawMethod === "airtel" || rawMethod === "bank" || rawMethod === "online"
        ? rawMethod
        : "bank";
    const amountPaid = Number(row.amount_paid);
    const payment: AdminFeePaymentRow = {
      id: String(row.id),
      invoiceId: `inv-${row.student_id}`,
      studentId: row.student_id,
      amount: amountPaid,
      method,
      reference:
        row.transaction_reference?.trim() ||
        `PAY-${String(row.id).slice(0, 8).toUpperCase()}`,
      transactionReference: row.transaction_reference ?? undefined,
      status: amountPaid > 0 ? "completed" : "pending",
      paidAt: row.created_at ?? `${row.payment_date}T12:00:00.000Z`,
      submittedAt: row.created_at,
      verificationStatus: "approved",
      studentName: meta.name,
      studentNumber: meta.number,
    };
    return payment;
  });
}

export async function getStudentLatestBalance(studentId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
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

export async function recordAdminFeePayment(input: {
  studentId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Enter a valid payment amount." };
  }

  const balance = await getStudentLatestBalance(input.studentId);
  if (amount > balance) {
    return {
      ok: false,
      message: `Amount exceeds outstanding balance of UGX ${balance.toLocaleString("en-UG")}.`,
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("fee_payments").insert({
    student_id: input.studentId,
    amount_paid: amount,
    balance_due: Math.max(0, balance - amount),
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: input.method === "online" ? "bank" : input.method,
    transaction_reference: input.reference,
  });

  if (error) {
    console.error("[recordAdminFeePayment]", error);
    return { ok: false, message: error.message || "Could not record payment." };
  }

  return { ok: true, message: "Payment recorded." };
}

export async function adjustAdminStudentBalance(input: {
  studentId: string;
  newBalance: number;
}): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const newBalance = Math.round(input.newBalance);
  if (!Number.isFinite(newBalance) || newBalance < 0) {
    return { ok: false, message: "Balance must be a non-negative amount." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("fee_payments").insert({
    student_id: input.studentId,
    amount_paid: 0,
    balance_due: newBalance,
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "cash",
    transaction_reference: `ADJ-${Date.now()}`,
  });

  if (error) {
    console.error("[adjustAdminStudentBalance]", error);
    return { ok: false, message: error.message || "Could not update balance." };
  }

  return { ok: true, message: "Balance updated." };
}

export function emptyFeesBundleMeta() {
  return {
    semesterLabel: CURRENT_SEMESTER_LABEL,
    paymentDueDate: CURRENT_SEMESTER_FEE_DUE_ISO,
  };
}
