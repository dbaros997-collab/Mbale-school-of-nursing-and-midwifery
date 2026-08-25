/** Portal schema models — TypeScript shapes mirroring future DB tables. */

import type { ApplicationRecord } from "@/lib/admissions/types";

export type Role = "student" | "lecturer" | "admin";

export type PaymentMethod = "mtn" | "airtel" | "bank";

export type SubmissionStatus = "pending" | "submitted" | "graded";

export type DocumentRequestStatus = "processing" | "ready" | "downloaded";

export type RegistrationStatus = "draft" | "submitted" | "approved" | "rejected";

export type PaymentStatus = "pending" | "completed" | "failed";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  accountActivated: boolean;
  mustChangePassword: boolean;
};

export type Session = {
  id: string;
  userId: string;
  role: Role;
  /** Mock JWT token string for API-ready auth wiring */
  token: string;
  expiresAt: string;
};

export type Program = {
  id: string;
  code: string;
  title: string;
  totalCredits: number;
};

export type CourseUnit = {
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: number;
  programId: string;
  prerequisiteIds: string[];
};

export type Enrollment = {
  id: string;
  studentId: string;
  courseUnitId: string;
  semesterLabel: string;
  status: "active" | "completed" | "withdrawn";
};

export type SemesterRegistration = {
  id: string;
  studentId: string;
  semesterLabel: string;
  courseUnitIds: string[];
  totalCredits: number;
  status: RegistrationStatus;
  submittedAt: string | null;
};

export type Grade = {
  id: string;
  studentId: string;
  courseUnitId: string;
  semesterLabel: string;
  score: number;
  letterGrade: string;
  gpaPoints: number;
};

export type TranscriptEntry = {
  courseUnitId: string;
  code: string;
  title: string;
  credits: number;
  letterGrade: string;
  gpaPoints: number;
  semesterLabel: string;
};

export type FeeInvoice = {
  id: string;
  studentId: string;
  semesterLabel: string;
  tuition: number;
  functionalFees: number;
  totalBilled: number;
  totalPaid: number;
  balance: number;
};

export type FeeLineItem = {
  id: string;
  invoiceId: string;
  label: string;
  amount: number;
};

export type Payment = {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  paidAt: string;
};

export type CourseMaterial = {
  id: string;
  courseUnitId: string;
  title: string;
  fileType: "pdf" | "docx";
  fileUrl: string;
  uploadedAt: string;
};

export type Assignment = {
  id: string;
  courseUnitId: string;
  title: string;
  dueAt: string;
  maxScore: number;
};

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  score: number | null;
  fileName: string | null;
};

export type TimetableSlot = {
  id: string;
  studentId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  courseUnitId: string;
  venue: string;
};

export type ExamSlot = {
  id: string;
  studentId: string;
  courseUnitId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  audience: "all" | "students" | "staff";
};

export type NextOfKin = {
  name: string;
  relationship: string;
  phone: string;
  email: string;
};

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type MedicalInfo = {
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  disabilities: string;
  doctorName: string;
  doctorPhone: string;
};

export type StudentProfile = {
  id: string;
  userId: string;
  studentNumber: string;
  /** Temporary registration number issued at admission (cleared after activation) */
  tempRegistrationNumber: string | null;
  admissionLetterRef: string;
  fullName: string;
  programId: string;
  phone: string;
  email: string;
  address: string;
  nextOfKin: NextOfKin;
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInfo;
  creditsCompleted: number;
  creditsRequired: number;
  cumulativeGpa: number;
  semesterGpa: number;
};

/** Pending first-time activation candidate (admissions → portal) */
export type PendingActivation = {
  tempRegistrationNumber: string;
  admissionLetterRef: string;
  fullName: string;
  email: string;
  phone: string;
  programId: string;
  studentNumber: string;
};

export type DocumentRequest = {
  id: string;
  studentId: string;
  type: "testimonial" | "recommendation" | "admission_letter";
  status: DocumentRequestStatus;
  requestedAt: string;
  readyAt: string | null;
};

/** Dashboard DTO for the student overview page */
export type DeadlineItem = {
  id: string;
  title: string;
  courseCode: string;
  dueAt: string;
  status: SubmissionStatus;
};

export type DashboardSummary = {
  studentName: string;
  studentId: string;
  program: string;
  gpa: number;
  feeBalance: number;
  enrolledUnits: number;
  upcomingDeadlines: DeadlineItem[];
  announcements: Announcement[];
};

/** Staff profile for admin control panel */
export type AdminProfile = {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
};

export type StudentAccountStatus = "active" | "pending_approval" | "inactive";

/** Admin-facing student roster row (multi-student mock registry) */
export type AdminStudentRecord = {
  id: string;
  userId: string;
  studentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  programId: string;
  address: string;
  accountStatus: StudentAccountStatus;
  feeBalance: number;
  feeTotalPaid: number;
  feeTotalBilled: number;
  enrolledUnits: number;
  cumulativeGpa: number;
  registeredAt: string;
};

export type AdminOverviewSummary = {
  activeStudents: number;
  pendingApprovals: number;
  pendingApplications: number;
  totalFeeCollections: number;
  activeCourses: number;
  outstandingBalances: number;
  recentPayments: Payment[];
  pendingStudents: AdminStudentRecord[];
  pendingApplicationQueue: ApplicationRecord[];
};
