import { mockDelay } from "@/lib/mock-delay";
import {
  CURRENT_SEMESTER,
  addAdminPayment,
  mockAdminPayments,
  mockAdminStudents,
  mockPayments,
  updateAdminStudentFees,
} from "@/lib/portal/mock-store";
import type { AdminStudentRecord, Payment, PaymentMethod } from "@/lib/portal/schema";
import { PAYMENT_METHOD_LABELS } from "@/services/portal/fees";

export type AdminFeeStudentRow = AdminStudentRecord & {
  paymentCount: number;
};

export type AdminFeesBundle = {
  semesterLabel: string;
  students: AdminFeeStudentRow[];
  payments: Array<Payment & { studentName: string; studentNumber: string }>;
  totalCollected: number;
  totalOutstanding: number;
};

function allPayments(): Payment[] {
  const byId = new Map<string, Payment>();
  for (const p of [...mockAdminPayments, ...mockPayments]) {
    byId.set(p.id, p);
  }
  return [...byId.values()];
}

function buildBundle(): AdminFeesBundle {
  const payments = allPayments();
  const nameById = Object.fromEntries(
    mockAdminStudents.map((s) => [s.id, { name: s.fullName, number: s.studentNumber }]),
  );

  const students: AdminFeeStudentRow[] = [...mockAdminStudents]
    .map((s) => ({
      ...s,
      paymentCount: payments.filter((p) => p.studentId === s.id && p.status === "completed")
        .length,
    }))
    .sort((a, b) => b.feeBalance - a.feeBalance || a.fullName.localeCompare(b.fullName));

  const enrichedPayments = payments
    .map((p) => ({
      ...p,
      studentName: nameById[p.studentId]?.name ?? "Unknown student",
      studentNumber: nameById[p.studentId]?.number ?? "—",
    }))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  const totalCollected = enrichedPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOutstanding = students.reduce((sum, s) => sum + s.feeBalance, 0);

  return {
    semesterLabel: CURRENT_SEMESTER,
    students,
    payments: enrichedPayments,
    totalCollected,
    totalOutstanding,
  };
}

/** Ready for GET /api/portal/admin/fees */
export async function getAdminFeesBundle(): Promise<AdminFeesBundle> {
  await mockDelay(280);
  return buildBundle();
}

export type RecordPaymentInput = {
  studentId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
};

/** Ready for POST /api/portal/admin/fees/payments */
export async function recordStudentPayment(
  input: RecordPaymentInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  await mockDelay(500);

  const student = mockAdminStudents.find((s) => s.id === input.studentId);
  if (!student) {
    return { ok: false, message: "Student not found.", bundle: buildBundle() };
  }

  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Enter a valid payment amount.", bundle: buildBundle() };
  }
  if (amount > student.feeBalance) {
    return {
      ok: false,
      message: `Amount exceeds outstanding balance of UGX ${student.feeBalance.toLocaleString("en-UG")}.`,
      bundle: buildBundle(),
    };
  }

  const prefix =
    input.method === "mtn" ? "MTN" : input.method === "airtel" ? "AIR" : "BNK";
  const reference =
    input.reference?.trim() ||
    `${prefix}-ADM-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

  const payment: Payment = {
    id: `apay-${Date.now()}`,
    invoiceId: `inv-${student.id}-admin`,
    studentId: student.id,
    amount,
    method: input.method,
    reference,
    status: "completed",
    paidAt: new Date().toISOString(),
  };

  addAdminPayment(payment);

  const totalPaid = student.feeTotalPaid + amount;
  const balance = Math.max(0, student.feeTotalBilled - totalPaid);
  updateAdminStudentFees(student.id, { feeTotalPaid: totalPaid, feeBalance: balance });

  return {
    ok: true,
    message: `Recorded UGX ${amount.toLocaleString("en-UG")} for ${student.fullName} via ${PAYMENT_METHOD_LABELS[input.method]}.`,
    bundle: buildBundle(),
  };
}

export type AdjustBalanceInput = {
  studentId: string;
  newBalance: number;
  note?: string;
};

/** Ready for PATCH /api/portal/admin/fees/:studentId/balance */
export async function adjustStudentBalance(
  input: AdjustBalanceInput,
): Promise<{ ok: boolean; message: string; bundle: AdminFeesBundle }> {
  await mockDelay(400);

  const student = mockAdminStudents.find((s) => s.id === input.studentId);
  if (!student) {
    return { ok: false, message: "Student not found.", bundle: buildBundle() };
  }

  const newBalance = Math.round(input.newBalance);
  if (!Number.isFinite(newBalance) || newBalance < 0) {
    return {
      ok: false,
      message: "Balance must be a non-negative amount.",
      bundle: buildBundle(),
    };
  }
  if (newBalance > student.feeTotalBilled) {
    return {
      ok: false,
      message: "Balance cannot exceed total billed.",
      bundle: buildBundle(),
    };
  }

  const totalPaid = student.feeTotalBilled - newBalance;
  updateAdminStudentFees(student.id, {
    feeTotalPaid: totalPaid,
    feeBalance: newBalance,
  });

  return {
    ok: true,
    message: `Updated balance for ${student.fullName} to UGX ${newBalance.toLocaleString("en-UG")}.`,
    bundle: buildBundle(),
  };
}
