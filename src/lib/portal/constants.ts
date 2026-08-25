import type {
  Role,
  SubmissionStatus,
  DocumentRequestStatus,
  RegistrationStatus,
  StudentAccountStatus,
} from "./schema";

export const ROLES: Role[] = ["student", "lecturer", "admin"];

/** Maximum credit load per semester registration */
export const MAX_CREDIT_LOAD = 24;

/** Minimum credits typically required before overload approval */
export const MIN_CREDIT_LOAD = 12;

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  graded: "Graded",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentRequestStatus, string> = {
  processing: "Processing",
  ready: "Ready for pickup/download",
  downloaded: "Downloaded",
};

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted for approval",
  approved: "Approved",
  rejected: "Rejected",
};

export const PORTAL_NAV = [
  { href: "/portal/dashboard", label: "Dashboard", icon: "LayoutDashboard", ready: true },
  { href: "/portal/registration", label: "Registration", icon: "BookOpen", ready: true },
  { href: "/portal/fees", label: "Fees", icon: "CreditCard", ready: true },
  { href: "/portal/lms", label: "LMS Hub", icon: "FolderOpen", ready: true },
  { href: "/portal/timetable", label: "Timetable", icon: "CalendarDays", ready: true },
  { href: "/portal/notices", label: "Notices", icon: "Megaphone", ready: true },
  { href: "/portal/profile", label: "Profile", icon: "User", ready: true },
  { href: "/portal/documents", label: "Documents", icon: "FileText", ready: true },
  { href: "/portal/prescriptions", label: "Prescriptions", icon: "Pill", ready: true },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard", ready: true },
  { href: "/admin/analytics", label: "Analytics", icon: "BarChart3", ready: true },
  { href: "/admin/applications", label: "Applications", icon: "ClipboardList", ready: true },
  { href: "/admin/students", label: "Students", icon: "Users", ready: true },
  { href: "/admin/content", label: "Content & Schedule", icon: "CalendarDays", ready: true },
  { href: "/admin/fees", label: "Financial Ledger", icon: "Wallet", ready: true },
] as const;

export const STUDENT_ACCOUNT_STATUS_LABELS: Record<StudentAccountStatus, string> = {
  active: "Active",
  pending_approval: "Pending approval",
  inactive: "Inactive",
};

export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}
