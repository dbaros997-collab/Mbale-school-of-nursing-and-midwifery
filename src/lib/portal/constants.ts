import type { Role, SubmissionStatus, DocumentRequestStatus, RegistrationStatus } from "./schema";

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
  { href: "/portal/academics", label: "Academics", icon: "GraduationCap", ready: true },
  { href: "/portal/registration", label: "Registration", icon: "BookOpen", ready: true },
  { href: "/portal/fees", label: "Fees", icon: "CreditCard", ready: true },
  { href: "/portal/lms", label: "LMS Hub", icon: "FolderOpen", ready: true },
  { href: "/portal/timetable", label: "Timetable", icon: "CalendarDays", ready: true },
  { href: "/portal/notices", label: "Notices", icon: "Megaphone", ready: true },
  { href: "/portal/profile", label: "Profile", icon: "User", ready: true },
  { href: "/portal/documents", label: "Documents", icon: "FileText", ready: true },
] as const;

export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}
