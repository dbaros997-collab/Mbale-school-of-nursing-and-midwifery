import type { AdminStudentRecord, FeeInvoice, FeeLineItem, Payment } from "./schema";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "./constants";
const CURRENT_SEMESTER = "Semester 1, 2025/26";
import {
  bumpFeeLedgerRevision,
  bumpStudentFeeLedgerRevision,
  getStudentFeeLedgerRevision,
} from "./fee-ledger-revision";

export const SARAH_STUDENT_ID = "stu-sarah";

function normalizeStudentNumber(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function buildDefaultFeeLineItems(invoiceId: string): FeeLineItem[] {
  return [
    { id: `${invoiceId}-fl-1`, invoiceId, label: "Tuition fees", amount: 1_200_000 },
    {
      id: `${invoiceId}-fl-2`,
      invoiceId,
      label: "Functional / examination fees",
      amount: 120_000,
    },
    { id: `${invoiceId}-fl-3`, invoiceId, label: "Library & ICT levy", amount: 50_000 },
    {
      id: `${invoiceId}-fl-4`,
      invoiceId,
      label: "Skills lab & clinical materials",
      amount: 80_000,
    },
  ];
}

type StudentLedgerMeta = {
  fullName?: string;
  studentNumber?: string;
  email?: string;
};

const studentInvoices = new Map<string, FeeInvoice>();
const studentFeeLines = new Map<string, FeeLineItem[]>();

/** Maps portal profile ids to canonical admin ledger ids when they differ. */
const ledgerIdAliases = new Map<string, string>();

type FeeLedgerStoreAccess = {
  getAdminStudents: () => AdminStudentRecord[];
  getPayments: () => Payment[];
  getAdminPayments: () => Payment[];
};

let storeAccess: FeeLedgerStoreAccess | null = null;

export function bindFeeLedgerStores(access: FeeLedgerStoreAccess) {
  storeAccess = access;
}

function adminStudentsRef(): AdminStudentRecord[] {
  return storeAccess?.getAdminStudents() ?? [];
}

export function registerLedgerIdAlias(profileStudentId: string, canonicalStudentId: string) {
  if (profileStudentId === canonicalStudentId) return;
  ledgerIdAliases.set(profileStudentId, canonicalStudentId);
}

export function resolveCanonicalStudentId(
  studentId: string,
  studentNumber?: string | null,
): string {
  const alias = ledgerIdAliases.get(studentId);
  if (alias) return alias;

  const directAdmin = adminStudentsRef().find((s) => s.id === studentId);
  if (directAdmin) return directAdmin.id;

  if (studentNumber) {
    const norm = normalizeStudentNumber(studentNumber);
    const byNumber = adminStudentsRef().find(
      (s) => normalizeStudentNumber(s.studentNumber) === norm,
    );
    if (byNumber) {
      ledgerIdAliases.set(studentId, byNumber.id);
      return byNumber.id;
    }
  }

  return studentId;
}

export function collectStudentIdAliases(studentId: string, studentNumber?: string | null): string[] {
  const canonical = resolveCanonicalStudentId(studentId, studentNumber);
  const ids = new Set<string>([studentId, canonical]);
  for (const [profileId, adminId] of ledgerIdAliases) {
    if (adminId === canonical || profileId === studentId) {
      ids.add(profileId);
      ids.add(adminId);
    }
  }
  return [...ids];
}

function defaultInvoiceForStudent(
  studentId: string,
  patch?: Partial<FeeInvoice>,
): FeeInvoice {
  const invoiceId =
    studentId === SARAH_STUDENT_ID ? "inv-2025-1" : `inv-${studentId}-2025-1`;
  return {
    id: invoiceId,
    studentId,
    semesterLabel: CURRENT_SEMESTER,
    tuition: 1_200_000,
    functionalFees: 250_000,
    totalBilled: 1_450_000,
    totalPaid: 0,
    balance: 1_450_000,
    paymentDueDate: CURRENT_SEMESTER_FEE_DUE_ISO,
    ...patch,
  };
}

export function seedStudentInvoice(studentId: string, invoice: FeeInvoice, lineItems?: FeeLineItem[]) {
  studentInvoices.set(studentId, { ...invoice, studentId });
  studentFeeLines.set(
    studentId,
    lineItems ?? buildDefaultFeeLineItems(invoice.id),
  );
}

export function ensureStudentFeeLedger(
  studentId: string,
  meta: StudentLedgerMeta = {},
): FeeInvoice {
  const canonicalId = resolveCanonicalStudentId(studentId, meta.studentNumber ?? null);
  const existing = studentInvoices.get(canonicalId);
  if (existing) {
    return reconcileStudentInvoice(canonicalId, studentId, meta.studentNumber ?? null);
  }

  const adminRow = adminStudentsRef().find((s) => s.id === canonicalId);
  const invoice = defaultInvoiceForStudent(canonicalId, {
    totalBilled: adminRow?.feeTotalBilled ?? 1_450_000,
    totalPaid: adminRow?.feeTotalPaid ?? 0,
    balance: adminRow?.feeBalance ?? 1_450_000,
  });

  const lines =
    canonicalId === SARAH_STUDENT_ID
      ? buildDefaultFeeLineItems(invoice.id)
      : buildDefaultFeeLineItems(invoice.id);

  seedStudentInvoice(canonicalId, invoice, lines);
  return reconcileStudentInvoice(canonicalId, studentId, meta.studentNumber ?? null);
}

function allPayments(): Payment[] {
  const byId = new Map<string, Payment>();
  const payments = storeAccess?.getPayments() ?? [];
  const adminPayments = storeAccess?.getAdminPayments() ?? [];
  for (const p of [...adminPayments, ...payments]) {
    byId.set(p.id, p);
  }
  return [...byId.values()];
}

export function paymentsForStudent(studentId: string, studentNumber?: string | null): Payment[] {
  const aliases = collectStudentIdAliases(studentId, studentNumber);
  return allPayments()
    .filter((p) => aliases.includes(p.studentId))
    .sort(
      (a, b) =>
        new Date(b.submittedAt ?? b.paidAt).getTime() -
        new Date(a.submittedAt ?? a.paidAt).getTime(),
    );
}

export function reconcileStudentInvoice(
  canonicalStudentId: string,
  requestStudentId = canonicalStudentId,
  studentNumber?: string | null,
): FeeInvoice {
  const invoice =
    studentInvoices.get(canonicalStudentId) ??
    ensureStudentFeeLedger(canonicalStudentId, { studentNumber: studentNumber ?? undefined });

  const completedTotal = paymentsForStudent(requestStudentId, studentNumber)
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = Math.max(invoice.totalPaid, completedTotal);
  const balance = Math.max(0, invoice.totalBilled - totalPaid);
  const updated: FeeInvoice = {
    ...invoice,
    totalPaid,
    balance,
  };

  studentInvoices.set(canonicalStudentId, updated);

  const adminRow = adminStudentsRef().find((s) => s.id === canonicalStudentId);
  if (adminRow) {
    adminRow.feeTotalPaid = updated.totalPaid;
    adminRow.feeBalance = updated.balance;
    adminRow.feeTotalBilled = updated.totalBilled;
  }

  return { ...updated };
}

export function getStudentInvoice(
  studentId: string,
  meta: StudentLedgerMeta = {},
): FeeInvoice {
  const canonicalId = resolveCanonicalStudentId(studentId, meta.studentNumber ?? null);
  ensureStudentFeeLedger(studentId, meta);
  return reconcileStudentInvoice(
    canonicalId,
    studentId,
    meta.studentNumber ?? null,
  );
}

export function getStudentFeeLineItems(
  studentId: string,
  meta: StudentLedgerMeta = {},
): FeeLineItem[] {
  const canonicalId = resolveCanonicalStudentId(studentId, meta.studentNumber ?? null);
  ensureStudentFeeLedger(studentId, meta);
  return [...(studentFeeLines.get(canonicalId) ?? buildDefaultFeeLineItems(`inv-${canonicalId}`))];
}

export function setStudentInvoice(
  studentId: string,
  next: FeeInvoice,
  meta: StudentLedgerMeta = {},
): FeeInvoice {
  const canonicalId = resolveCanonicalStudentId(studentId, meta.studentNumber ?? null);
  const merged = { ...next, studentId: canonicalId };
  studentInvoices.set(canonicalId, merged);

  const adminRow = adminStudentsRef().find((s) => s.id === canonicalId);
  if (adminRow) {
    adminRow.feeTotalPaid = merged.totalPaid;
    adminRow.feeBalance = merged.balance;
    adminRow.feeTotalBilled = merged.totalBilled;
  }

  bumpStudentFeeLedgerRevision(studentId);
  bumpFeeLedgerRevision();
  return { ...merged };
}

/** Recompute invoice totals from completed payments after a ledger mutation. */
export function refreshStudentFeeLedger(
  studentId: string,
  meta: StudentLedgerMeta = {},
): FeeInvoice {
  const canonicalId = resolveCanonicalStudentId(studentId, meta.studentNumber ?? null);
  ensureStudentFeeLedger(studentId, meta);
  const invoice = reconcileStudentInvoice(
    canonicalId,
    studentId,
    meta.studentNumber ?? null,
  );
  bumpStudentFeeLedgerRevision(studentId);
  bumpFeeLedgerRevision();
  return invoice;
}

export function peekStudentOutstandingBalance(
  studentId: string,
  meta: StudentLedgerMeta = {},
): number {
  return getStudentInvoice(studentId, meta).balance;
}

export function getLedgerRevisionForStudent(studentId: string): number {
  return getStudentFeeLedgerRevision(studentId);
}

export function provisionFeeLedgerForActivatedStudent(profile: {
  id: string;
  studentNumber: string;
  fullName: string;
  email: string;
}) {
  const canonicalId = resolveCanonicalStudentId(profile.id, profile.studentNumber);
  registerLedgerIdAlias(profile.id, canonicalId);
  ensureStudentFeeLedger(profile.id, {
    fullName: profile.fullName,
    studentNumber: profile.studentNumber,
    email: profile.email,
  });
}
