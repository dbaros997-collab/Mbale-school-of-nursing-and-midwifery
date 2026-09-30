import type { AdminStudentRecord, Payment, PaymentMethod } from "@/lib/portal/schema";
import type { FinancialClearanceStatus } from "@/lib/portal/schema";
import type {
  FinanceDashboardAlert,
  OverdueAccountRow,
  StuckVerificationRow,
} from "@/services/portal/fees-finance-alerts";

export type AdminFeeStudentRow = AdminStudentRecord & {
  paymentCount: number;
  financialClearance: FinancialClearanceStatus;
};

export type PendingVerificationRow = Payment & {
  studentName: string;
  studentNumber: string;
};

export type PortalActivationQueueRow = {
  studentId: string;
  fullName: string;
  email: string;
  studentNumber: string;
  tempRegistrationNumber: string;
  admissionLetterRef: string;
  activatedAt: string | null;
  source: "supabase" | "registry";
};

export type FinanceOnboardingSnapshot = {
  supabaseConnected: boolean;
  pendingPortalActivation: number;
  activatedPortalAccounts: number;
  pendingAccountApproval: number;
  queue: PortalActivationQueueRow[];
};

export type OnlineGatewaySessionRow = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  txRef: string;
  gateway: string;
  status: string;
  createdAt: string;
};

export type FinanceGatewaySnapshot = {
  configured: boolean;
  pendingCheckoutCount: number;
  completedSessionCount: number;
  recentSessions: OnlineGatewaySessionRow[];
};

export type AdminFeesBundle = {
  semesterLabel: string;
  /** Live ledger source — always Supabase when this bundle is returned from admin APIs. */
  dataSource: "supabase";
  /** Empty on lightweight dashboard loads — use `/api/admin/fees/students` for pages. */
  students: AdminFeeStudentRow[];
  /** Empty on lightweight dashboard loads — use `/api/admin/fees/payments` for pages. */
  payments: Array<Payment & { studentName: string; studentNumber: string }>;
  totalStudentCount: number;
  totalPaymentCount: number;
  pendingVerifications: PendingVerificationRow[];
  totalCollected: number;
  totalOutstanding: number;
  pendingReviewCount: number;
  overdueAccountCount: number;
  staleVerificationCount: number;
  ledgerRevision: number;
  alerts: FinanceDashboardAlert[];
  overdueAccounts: OverdueAccountRow[];
  stuckVerifications: StuckVerificationRow[];
  onboarding: FinanceOnboardingSnapshot;
  gateway: FinanceGatewaySnapshot;
};

export type RecordPaymentInput = {
  studentId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
};

export type AdjustBalanceInput = {
  studentId: string;
  newBalance: number;
  note?: string;
};

export type ReviewPaymentInput = {
  paymentId: string;
  decision: "approved" | "rejected";
  verifiedReference?: string;
  reviewNote?: string;
};
