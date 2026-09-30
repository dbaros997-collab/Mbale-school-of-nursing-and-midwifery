import type { FinancialClearanceStatus, StudentAccountStatus } from "@/lib/portal/schema";
import type { AdminFeeStudentRow } from "@/services/portal/admin/fees-types";
import type { Payment } from "@/lib/portal/schema";

export type FinanceStudentSortField = "name" | "balance" | "paid" | "billed";

export type FinanceStudentQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: FinanceStudentSortField;
  sortDir?: "asc" | "desc";
  clearance?: FinancialClearanceStatus | "all";
  accountStatus?: StudentAccountStatus | "all";
  overdueOnly?: boolean;
};

export type FinancePaymentQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: Payment["status"] | "all";
  method?: Payment["method"] | "all";
};

export type PaginatedResult<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminFeePaymentRow = Payment & {
  studentName: string;
  studentNumber: string;
};

export type AdminStudentLookupRow = Pick<
  AdminFeeStudentRow,
  "id" | "fullName" | "studentNumber" | "feeBalance"
>;
