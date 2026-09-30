import type { FinancialClearanceStatus, Payment } from "@/lib/portal/schema";
import { computeFinancialClearance } from "@/services/portal/fees-shared";
import type {
  AdminFeePaymentRow,
  AdminStudentLookupRow,
  FinancePaymentQuery,
  FinanceStudentQuery,
  PaginatedResult,
} from "@/services/portal/admin/fees-query-types";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import {
  CURRENT_SEMESTER_LABEL,
  countAdminFeePaymentsFromDb,
  fetchAdminFeePaymentsFromDb,
  fetchAdminFeeStudentRowsFromDb,
} from "@/lib/supabase/admin-finance-store";
import { AdminFinanceDataError } from "@/lib/supabase/admin-finance-errors";
import { listPendingBankSubmissions } from "@/lib/supabase/fee-verification-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

function clampPageSize(n: number | undefined): number {
  const v = n ?? DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(v)));
}

function normalizePage(n: number | undefined): number {
  return Math.max(1, Math.floor(n ?? 1));
}

let studentRowCache: AdminFeeStudentRow[] | null = null;

export function getAdminFeeStudentRows(): AdminFeeStudentRow[] {
  return studentRowCache ?? [];
}

export async function refreshAdminFeeStudentRows(): Promise<AdminFeeStudentRow[]> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is not configured for admin finance.",
      "refreshAdminFeeStudentRows",
    );
  }
  studentRowCache = await fetchAdminFeeStudentRowsFromDb();
  return studentRowCache;
}

export function invalidateAdminFeeStudentRowCache(): void {
  studentRowCache = null;
}

function matchesStudentQuery(row: AdminFeeStudentRow, query: FinanceStudentQuery): boolean {
  const q = query.q?.trim().toLowerCase();
  if (q) {
    const haystack = `${row.fullName} ${row.studentNumber} ${row.email} ${row.id}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (query.clearance && query.clearance !== "all" && row.financialClearance !== query.clearance) {
    return false;
  }
  if (
    query.accountStatus &&
    query.accountStatus !== "all" &&
    row.accountStatus !== query.accountStatus
  ) {
    return false;
  }
  if (query.overdueOnly && row.feeBalance <= 0) return false;
  return true;
}

function sortStudents(
  rows: AdminFeeStudentRow[],
  sort: FinanceStudentQuery["sort"],
  sortDir: FinanceStudentQuery["sortDir"],
): AdminFeeStudentRow[] {
  const dir = sortDir === "asc" ? 1 : -1;
  const field = sort ?? "balance";
  return [...rows].sort((a, b) => {
    switch (field) {
      case "name":
        return dir * a.fullName.localeCompare(b.fullName);
      case "paid":
        return dir * (a.feeTotalPaid - b.feeTotalPaid);
      case "billed":
        return dir * (a.feeTotalBilled - b.feeTotalBilled);
      case "balance":
      default:
        return dir * (a.feeBalance - b.feeBalance) || a.fullName.localeCompare(b.fullName);
    }
  });
}

export async function queryAdminFeeStudents(
  query: FinanceStudentQuery,
): Promise<PaginatedResult<AdminFeeStudentRow>> {
  const pageSize = clampPageSize(query.pageSize);
  const page = normalizePage(query.page);

  await refreshAdminFeeStudentRows();

  const filtered = getAdminFeeStudentRows().filter((row) => matchesStudentQuery(row, query));
  const sorted = sortStudents(filtered, query.sort, query.sortDir ?? "desc");
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    rows: sorted.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function lookupAdminFeeStudents(
  q: string,
  limit = 20,
): Promise<AdminStudentLookupRow[]> {
  const result = await queryAdminFeeStudents({
    q,
    page: 1,
    pageSize: limit,
    sort: "name",
    sortDir: "asc",
  });
  return result.rows.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    studentNumber: s.studentNumber,
    feeBalance: s.feeBalance,
  }));
}

let paymentCache: AdminFeePaymentRow[] | null = null;

async function allPayments(): Promise<AdminFeePaymentRow[]> {
  if (!isSupabaseConfigured()) {
    throw new AdminFinanceDataError(
      "Supabase is not configured for admin finance.",
      "allPayments",
    );
  }
  if (!paymentCache) {
    paymentCache = await fetchAdminFeePaymentsFromDb();
  }
  return paymentCache;
}

export function invalidateAdminFeePaymentCache(): void {
  paymentCache = null;
}

export async function queryAdminFeePayments(
  query: FinancePaymentQuery,
): Promise<PaginatedResult<AdminFeePaymentRow>> {
  const pageSize = clampPageSize(query.pageSize);
  const page = normalizePage(query.page);

  invalidateAdminFeePaymentCache();
  let rows = await allPayments();

  const q = query.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (p) =>
        p.studentName.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q) ||
        (p.transactionReference?.toLowerCase().includes(q) ?? false),
    );
  }
  if (query.status && query.status !== "all") {
    rows = rows.filter((p) => p.status === query.status);
  }
  if (query.method && query.method !== "all") {
    rows = rows.filter((p) => p.method === query.method);
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function computeAdminFeeAggregates() {
  await refreshAdminFeeStudentRows();
  invalidateAdminFeePaymentCache();
  const students = getAdminFeeStudentRows();
  const payments = await allPayments();
  const enrichedPayments = payments.filter((p) => p.status === "completed");
  const totalCollected = enrichedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const pendingVerifications = (await listPendingBankSubmissions()).length;
  const totalPaymentCount = await countAdminFeePaymentsFromDb();

  return {
    semesterLabel: CURRENT_SEMESTER_LABEL,
    totalCollected,
    totalOutstanding,
    pendingReviewCount: pendingVerifications,
    totalStudentCount: students.length,
    totalPaymentCount,
  };
}

export function studentClearanceFromRow(row: AdminFeeStudentRow): FinancialClearanceStatus {
  const invoiceLike = {
    balance: row.feeBalance,
    totalBilled: row.feeTotalBilled,
    totalPaid: row.feeTotalPaid,
    tuition: 0,
    functionalFees: 0,
    id: "",
    studentId: row.id,
    semesterLabel: "",
  };
  return computeFinancialClearance(invoiceLike, [] as Payment[]);
}
