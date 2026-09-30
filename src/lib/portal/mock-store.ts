import type {
  AdminProfile,
  AdminStudentRecord,
  Announcement,
  Assignment,
  AssignmentSubmission,
  CourseMaterial,
  CourseUnit,
  Enrollment,
  ExamSlot,
  FeeInvoice,
  FeeLineItem,
  Grade,
  DocumentRequest,
  Payment,
  PaymentVerificationStatus,
  PendingActivation,
  Program,
  SemesterRegistration,
  Session,
  StudentProfile,
  TimetableSlot,
  User,
} from "./schema";
import { CURRENT_SEMESTER_FEE_DUE_ISO } from "./constants";
import { bumpFeeLedgerRevision, bumpStudentFeeLedgerRevision } from "./fee-ledger-revision";
import {
  refreshStudentFeeLedger,
  collectStudentIdAliases,
  bindFeeLedgerStores,
  buildDefaultFeeLineItems,
  ensureStudentFeeLedger,
  peekStudentOutstandingBalance,
  provisionFeeLedgerForActivatedStudent,
  seedStudentInvoice,
  setStudentInvoice,
  SARAH_STUDENT_ID,
} from "./fee-student-ledger";
import { registerActivatedStudentFeeHook } from "./student-registry";
import {
  isPendingFeeVerification,
  sumPendingVerificationPayments,
  validatePaymentHeadroom,
} from "./fee-pending-reservations";
import { registerStudentRegistrySync } from "./student-registry";

export const REGISTRATION_SEMESTER = "Semester 2, 2025/26";
export const CURRENT_SEMESTER = "Semester 1, 2025/26";

export const MOCK_PROGRAM: Program = {
  id: "prog-dn",
  code: "DN",
  title: "Diploma in Nursing (Direct)",
  totalCredits: 120,
};

/** Full course catalog (past + current + upcoming offerable units) */
export const MOCK_CATALOG: CourseUnit[] = [
  // Completed Year 1
  {
    id: "unit-fund",
    code: "NSG1101",
    title: "Fundamentals of Nursing",
    credits: 4,
    semester: 1,
    programId: "prog-dn",
    prerequisiteIds: [],
  },
  {
    id: "unit-anat",
    code: "NSG1102",
    title: "Anatomy & Physiology",
    credits: 4,
    semester: 1,
    programId: "prog-dn",
    prerequisiteIds: [],
  },
  {
    id: "unit-micro",
    code: "NSG1201",
    title: "Microbiology",
    credits: 3,
    semester: 2,
    programId: "prog-dn",
    prerequisiteIds: ["unit-anat"],
  },
  {
    id: "unit-patho",
    code: "NSG1202",
    title: "Pathophysiology",
    credits: 3,
    semester: 2,
    programId: "prog-dn",
    prerequisiteIds: ["unit-anat"],
  },
  // Current semester (active)
  {
    id: "unit-ahn",
    code: "NSG2101",
    title: "Adult Health Nursing",
    credits: 4,
    semester: 3,
    programId: "prog-dn",
    prerequisiteIds: ["unit-fund", "unit-patho"],
  },
  {
    id: "unit-pharm",
    code: "NSG2102",
    title: "Pharmacology",
    credits: 3,
    semester: 3,
    programId: "prog-dn",
    prerequisiteIds: ["unit-micro"],
  },
  {
    id: "unit-comm",
    code: "NSG2103",
    title: "Community Health Nursing",
    credits: 3,
    semester: 3,
    programId: "prog-dn",
    prerequisiteIds: ["unit-fund"],
  },
  {
    id: "unit-mid",
    code: "MID2101",
    title: "Midwifery Theory",
    credits: 4,
    semester: 3,
    programId: "prog-dn",
    prerequisiteIds: ["unit-anat"],
  },
  {
    id: "unit-ethics",
    code: "NSG2104",
    title: "Professional Ethics",
    credits: 2,
    semester: 3,
    programId: "prog-dn",
    prerequisiteIds: [],
  },
  // Upcoming semester offerable
  {
    id: "unit-peds",
    code: "NSG2201",
    title: "Paediatric Nursing",
    credits: 4,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-ahn"],
  },
  {
    id: "unit-mental",
    code: "NSG2202",
    title: "Mental Health Nursing",
    credits: 3,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-fund", "unit-patho"],
  },
  {
    id: "unit-repro",
    code: "MID2201",
    title: "Reproductive Health",
    credits: 4,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-mid"],
  },
  {
    id: "unit-research",
    code: "NSG2203",
    title: "Nursing Research Methods",
    credits: 3,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-fund"],
  },
  {
    id: "unit-skills",
    code: "NSG2204",
    title: "Advanced Clinical Skills Lab",
    credits: 3,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-ahn", "unit-pharm"],
  },
  {
    id: "unit-lead",
    code: "NSG2205",
    title: "Leadership & Management in Nursing",
    credits: 2,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-fund", "unit-micro"],
  },
  {
    id: "unit-crit",
    code: "NSG2206",
    title: "Critical Care Nursing",
    credits: 4,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: ["unit-ahn", "unit-pharm", "unit-patho"],
  },
  {
    id: "unit-elective-it",
    code: "GEN2201",
    title: "Health Informatics Elective",
    credits: 2,
    semester: 4,
    programId: "prog-dn",
    prerequisiteIds: [],
  },
];

/** Alias used by dashboard for current-semester unit lookups */
export const MOCK_UNITS: CourseUnit[] = MOCK_CATALOG.filter((u) =>
  ["unit-ahn", "unit-pharm", "unit-comm", "unit-mid", "unit-ethics"].includes(u.id),
);

export const MOCK_USER: User = {
  id: "user-sarah",
  email: "nagudi.sarah@mbaleschoolofnursing.ac.ug",
  passwordHash: "mock-hash:Student@2026",
  role: "student",
  createdAt: "2024-08-01T08:00:00.000Z",
  accountActivated: true,
  mustChangePassword: false,
};

export const MOCK_PROFILE: StudentProfile = {
  id: "stu-sarah",
  userId: "user-sarah",
  studentNumber: "MBSNM/NS/2024/018",
  tempRegistrationNumber: null,
  admissionLetterRef: "ADM-MBSNM-2024-018",
  fullName: "Nagudi Sarah",
  programId: "prog-dn",
  phone: "+256 700 123 456",
  email: "nagudi.sarah@mbaleschoolofnursing.ac.ug",
  address: "Mbale Municipality, Eastern Uganda",
  nextOfKin: {
    name: "Nagudi Peter",
    relationship: "Father",
    phone: "+256 772 987 654",
    email: "peter.nagudi@email.com",
  },
  emergencyContact: {
    name: "Nagudi Mary",
    relationship: "Mother",
    phone: "+256 701 555 221",
  },
  medicalInfo: {
    bloodGroup: "O+",
    allergies: "None known",
    chronicConditions: "None",
    disabilities: "None",
    doctorName: "Dr. Okello James",
    doctorPhone: "+256 750 111 222",
  },
  creditsCompleted: 48,
  creditsRequired: 120,
  cumulativeGpa: 3.42,
  semesterGpa: 3.55,
};

/** Demo first-time students — use any row on the activation wizard */
export { MOCK_PENDING_ACTIVATION } from "./student-registry";

export function applyActiveStudentSession(user: User, profile: StudentProfile) {
  Object.assign(MOCK_USER, user);
  Object.assign(MOCK_PROFILE, {
    ...profile,
    nextOfKin: { ...profile.nextOfKin },
    emergencyContact: { ...profile.emergencyContact },
    medicalInfo: { ...profile.medicalInfo },
  });
  ensureStudentFeeLedger(profile.id, {
    fullName: profile.fullName,
    studentNumber: profile.studentNumber,
    email: profile.email,
  });
}

registerStudentRegistrySync(applyActiveStudentSession);
registerActivatedStudentFeeHook((profile) => {
  provisionFeeLedgerForActivatedStudent(profile);
});

export function updateMockProfile(
  patch: Partial<Omit<StudentProfile, "id" | "userId" | "studentNumber" | "programId">> & {
    nextOfKin?: Partial<StudentProfile["nextOfKin"]>;
    emergencyContact?: Partial<StudentProfile["emergencyContact"]>;
    medicalInfo?: Partial<StudentProfile["medicalInfo"]>;
  },
) {
  if (patch.nextOfKin) {
    Object.assign(MOCK_PROFILE.nextOfKin, patch.nextOfKin);
  }
  if (patch.emergencyContact) {
    Object.assign(MOCK_PROFILE.emergencyContact, patch.emergencyContact);
  }
  if (patch.medicalInfo) {
    Object.assign(MOCK_PROFILE.medicalInfo, patch.medicalInfo);
  }
  const { nextOfKin: _kin, emergencyContact: _em, medicalInfo: _med, ...rest } = patch;
  Object.assign(MOCK_PROFILE, rest);
}

export function setMockUserPassword(passwordHash: string) {
  MOCK_USER.passwordHash = passwordHash;
  MOCK_USER.mustChangePassword = false;
  MOCK_USER.accountActivated = true;
}

export const MOCK_GRADES: Grade[] = [
  {
    id: "gr-1",
    studentId: "stu-sarah",
    courseUnitId: "unit-fund",
    semesterLabel: "Semester 1, 2024/25",
    score: 78,
    letterGrade: "B+",
    gpaPoints: 3.5,
  },
  {
    id: "gr-2",
    studentId: "stu-sarah",
    courseUnitId: "unit-anat",
    semesterLabel: "Semester 1, 2024/25",
    score: 82,
    letterGrade: "A-",
    gpaPoints: 3.7,
  },
  {
    id: "gr-3",
    studentId: "stu-sarah",
    courseUnitId: "unit-micro",
    semesterLabel: "Semester 2, 2024/25",
    score: 74,
    letterGrade: "B",
    gpaPoints: 3.0,
  },
  {
    id: "gr-4",
    studentId: "stu-sarah",
    courseUnitId: "unit-patho",
    semesterLabel: "Semester 2, 2024/25",
    score: 88,
    letterGrade: "A",
    gpaPoints: 4.0,
  },
];

export let mockDocumentRequests: DocumentRequest[] = [
  {
    id: "doc-1",
    studentId: "stu-sarah",
    type: "admission_letter",
    status: "downloaded",
    requestedAt: "2024-08-15T10:00:00.000Z",
    readyAt: "2024-08-16T09:00:00.000Z",
  },
  {
    id: "doc-2",
    studentId: "stu-sarah",
    type: "testimonial",
    status: "ready",
    requestedAt: "2026-08-01T11:20:00.000Z",
    readyAt: "2026-08-08T14:00:00.000Z",
  },
];

export function addMockDocumentRequest(req: DocumentRequest) {
  mockDocumentRequests = [req, ...mockDocumentRequests];
}

export function updateMockDocumentRequest(id: string, patch: Partial<DocumentRequest>) {
  const row = mockDocumentRequests.find((d) => d.id === id);
  if (row) Object.assign(row, patch);
}

export const MOCK_SESSION: Session = {
  id: "sess-demo",
  userId: "user-sarah",
  role: "student",
  token: "mock-jwt.student.nagudi-sarah",
  expiresAt: "2027-01-01T00:00:00.000Z",
};

export const MOCK_ENROLLMENTS: Enrollment[] = [
  // Completed Year 1–2
  {
    id: "enr-c1",
    studentId: "stu-sarah",
    courseUnitId: "unit-fund",
    semesterLabel: "Semester 1, 2024/25",
    status: "completed",
  },
  {
    id: "enr-c2",
    studentId: "stu-sarah",
    courseUnitId: "unit-anat",
    semesterLabel: "Semester 1, 2024/25",
    status: "completed",
  },
  {
    id: "enr-c3",
    studentId: "stu-sarah",
    courseUnitId: "unit-micro",
    semesterLabel: "Semester 2, 2024/25",
    status: "completed",
  },
  {
    id: "enr-c4",
    studentId: "stu-sarah",
    courseUnitId: "unit-patho",
    semesterLabel: "Semester 2, 2024/25",
    status: "completed",
  },
  // Current semester active
  {
    id: "enr-1",
    studentId: "stu-sarah",
    courseUnitId: "unit-ahn",
    semesterLabel: CURRENT_SEMESTER,
    status: "active",
  },
  {
    id: "enr-2",
    studentId: "stu-sarah",
    courseUnitId: "unit-pharm",
    semesterLabel: CURRENT_SEMESTER,
    status: "active",
  },
  {
    id: "enr-3",
    studentId: "stu-sarah",
    courseUnitId: "unit-comm",
    semesterLabel: CURRENT_SEMESTER,
    status: "active",
  },
  {
    id: "enr-4",
    studentId: "stu-sarah",
    courseUnitId: "unit-mid",
    semesterLabel: CURRENT_SEMESTER,
    status: "active",
  },
  {
    id: "enr-5",
    studentId: "stu-sarah",
    courseUnitId: "unit-ethics",
    semesterLabel: CURRENT_SEMESTER,
    status: "active",
  },
];

/** Mutable in-memory registration draft/submission for the upcoming semester */
export let mockRegistration: SemesterRegistration = {
  id: "reg-2025-2",
  studentId: "stu-sarah",
  semesterLabel: REGISTRATION_SEMESTER,
  courseUnitIds: [],
  totalCredits: 0,
  status: "draft",
  submittedAt: null,
};

export function setMockRegistration(next: SemesterRegistration) {
  mockRegistration = next;
}

export function resetMockRegistration() {
  mockRegistration = {
    id: "reg-2025-2",
    studentId: "stu-sarah",
    semesterLabel: REGISTRATION_SEMESTER,
    courseUnitIds: [],
    totalCredits: 0,
    status: "draft",
    submittedAt: null,
  };
}

export let mockInvoice: FeeInvoice = {
  id: "inv-2025-1",
  studentId: "stu-sarah",
  semesterLabel: CURRENT_SEMESTER,
  tuition: 1_200_000,
  functionalFees: 250_000,
  totalBilled: 1_450_000,
  totalPaid: 1_000_000,
  balance: 450_000,
  paymentDueDate: CURRENT_SEMESTER_FEE_DUE_ISO,
};

/** Alias for older imports — always read live balance via this object */
export const MOCK_INVOICE = mockInvoice;

export function setMockInvoice(next: FeeInvoice) {
  const updated = setStudentInvoice(SARAH_STUDENT_ID, next, {
    studentNumber: MOCK_PROFILE.studentNumber,
    fullName: MOCK_PROFILE.fullName,
    email: MOCK_PROFILE.email,
  });
  Object.assign(mockInvoice, updated);
}

export const MOCK_FEE_LINES: FeeLineItem[] = [
  { id: "fl-1", invoiceId: "inv-2025-1", label: "Tuition fees", amount: 1_200_000 },
  { id: "fl-2", invoiceId: "inv-2025-1", label: "Functional / examination fees", amount: 120_000 },
  { id: "fl-3", invoiceId: "inv-2025-1", label: "Library & ICT levy", amount: 50_000 },
  { id: "fl-4", invoiceId: "inv-2025-1", label: "Skills lab & clinical materials", amount: 80_000 },
];

export let mockPayments: Payment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-2025-1",
    studentId: "stu-sarah",
    amount: 500_000,
    method: "mtn",
    reference: "MTN-20250801-88421",
    status: "completed",
    paidAt: "2025-08-01T09:14:00.000Z",
  },
  {
    id: "pay-2",
    invoiceId: "inv-2025-1",
    studentId: "stu-sarah",
    amount: 300_000,
    method: "airtel",
    reference: "AIR-20250912-55109",
    status: "completed",
    paidAt: "2025-09-12T16:42:00.000Z",
  },
  {
    id: "pay-3",
    invoiceId: "inv-2025-1",
    studentId: "stu-sarah",
    amount: 200_000,
    method: "bank",
    reference: "BNK-STANBIC-778201",
    status: "completed",
    paidAt: "2025-10-03T11:05:00.000Z",
  },
];

export function addMockPayment(payment: Payment) {
  mockPayments = [payment, ...mockPayments];
  // Keep admin ledger in sync when the demo student pays from the student portal
  if (!mockAdminPayments.some((p) => p.id === payment.id)) {
    mockAdminPayments = [payment, ...mockAdminPayments];
  }
}

export function updateMockPayment(
  paymentId: string,
  patch: Partial<Payment>,
): Payment | null {
  const idx = mockPayments.findIndex((p) => p.id === paymentId);
  const adminIdx = mockAdminPayments.findIndex((p) => p.id === paymentId);
  if (idx < 0 && adminIdx < 0) return null;

  if (idx >= 0) {
    Object.assign(mockPayments[idx], patch);
  }
  if (adminIdx >= 0) {
    Object.assign(mockAdminPayments[adminIdx], patch);
  } else if (idx >= 0) {
    mockAdminPayments = [{ ...mockPayments[idx] }, ...mockAdminPayments];
  }

  return mockPayments.find((p) => p.id === paymentId) ?? mockAdminPayments.find((p) => p.id === paymentId) ?? null;
}

/** Pending finance review — surfaced on the admin verification dashboard */
export let mockPendingBankPayments: Payment[] = [
  {
    id: "pay-pending-waiswa",
    invoiceId: "inv-waiswa-2025-1",
    studentId: "stu-waiswa",
    amount: 200_000,
    method: "bank",
    reference: "PENDING-9030012345678",
    transactionReference: "9030012345678",
    status: "pending",
    paidAt: "2026-09-20T10:30:00.000Z",
    submittedAt: "2026-09-20T10:30:00.000Z",
    depositSlipFileName: "waiswa-deposit-slip-march.jpg",
    depositSlipDataUrl: null,
    verificationStatus: "pending_review",
    reviewNote: null,
    reviewedAt: null,
  },
];

export function listPendingVerificationPayments(): Payment[] {
  const byId = new Map<string, Payment>();
  for (const p of [...mockPendingBankPayments, ...mockPayments, ...mockAdminPayments]) {
    if (isPendingFeeVerification(p)) {
      byId.set(p.id, p);
    }
  }
  return [...byId.values()].sort(
    (a, b) =>
      new Date(b.submittedAt ?? b.paidAt).getTime() -
      new Date(a.submittedAt ?? a.paidAt).getTime(),
  );
}

/** Unverified bank/mobile submissions + in-flight online checkout sessions (mock ledger). */
export function getPendingPaymentReservationTotal(
  studentId: string,
  studentNumber?: string | null,
): {
  manualPending: number;
  onlinePending: number;
  total: number;
} {
  const aliases = collectStudentIdAliases(studentId, studentNumber);
  const allPendingPayments = [
    ...mockPendingBankPayments,
    ...mockPayments,
    ...mockAdminPayments,
  ];
  let manualPending = 0;
  for (const alias of aliases) {
    manualPending += sumPendingVerificationPayments(allPendingPayments, alias);
  }
  const onlinePending = mockOnlinePaymentSessions
    .filter((s) => aliases.includes(s.studentId) && s.status === "pending")
    .reduce((sum, s) => sum + s.amount, 0);
  return { manualPending, onlinePending, total: manualPending + onlinePending };
}

export function addPendingBankPayment(payment: Payment) {
  mockPendingBankPayments = [payment, ...mockPendingBankPayments];
  addMockPayment(payment);
  bumpStudentFeeLedgerRevision(payment.studentId);
}

export type MockOnlinePaymentSession = {
  id: string;
  studentId: string;
  invoiceId: string;
  amount: number;
  txRef: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  gatewayTransactionId?: string | null;
};

let mockOnlinePaymentSessions: MockOnlinePaymentSession[] = [];

export function listMockOnlinePaymentSessions(): MockOnlinePaymentSession[] {
  return [...mockOnlinePaymentSessions];
}

export function registerMockOnlinePaymentSession(input: {
  studentId: string;
  invoiceId: string;
  amount: number;
  txRef: string;
}): { ok: true; session: MockOnlinePaymentSession } | { ok: false; code?: string; message: string } {
  const amount = Math.round(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, code: "INVALID_INPUT", message: "Invalid payment amount." };
  }

  const balance = peekStudentOutstandingBalance(input.studentId);

  const reservations = getPendingPaymentReservationTotal(input.studentId);
  const headroom = validatePaymentHeadroom({
    outstandingBalance: balance,
    pendingUnverifiedTotal: reservations.total,
    paymentAmount: amount,
  });
  if (!headroom.ok) {
    return {
      ok: false,
      code: "AMOUNT_EXCEEDS_BALANCE",
      message: headroom.message,
    };
  }

  if (mockOnlinePaymentSessions.some((s) => s.txRef === input.txRef)) {
    return { ok: false, code: "DUPLICATE_REFERENCE", message: "Payment reference already exists." };
  }

  const session: MockOnlinePaymentSession = {
    id: `ops-${Date.now()}`,
    studentId: input.studentId,
    invoiceId: input.invoiceId,
    amount,
    txRef: input.txRef,
    status: "pending",
  };
  mockOnlinePaymentSessions = [session, ...mockOnlinePaymentSessions];
  bumpFeeLedgerRevision();
  return { ok: true, session };
}

export function settleMockOnlinePayment(input: {
  txRef: string;
  gatewayTransactionId: string;
  status: "successful" | "failed" | "cancelled";
  settledAmount: number;
  paymentChannel?: string | null;
  failureReason?: string | null;
}): {
  ok: true;
  studentId: string;
  alreadySettled?: boolean;
} | {
  ok: false;
  code?: string;
  message: string;
} {
  const idx = mockOnlinePaymentSessions.findIndex((s) => s.txRef === input.txRef);
  if (idx < 0) {
    return { ok: false, code: "NOT_FOUND", message: "Online payment session not found." };
  }

  const session = mockOnlinePaymentSessions[idx];
  if (session.status === "completed") {
    return { ok: true, studentId: session.studentId, alreadySettled: true };
  }

  if (input.status !== "successful") {
    mockOnlinePaymentSessions[idx] = {
      ...session,
      status: input.status === "cancelled" ? "cancelled" : "failed",
      gatewayTransactionId: input.gatewayTransactionId,
    };
    bumpFeeLedgerRevision();
    return { ok: true, studentId: session.studentId };
  }

  if (Math.round(input.settledAmount) !== session.amount) {
    return { ok: false, code: "AMOUNT_MISMATCH", message: "Gateway amount does not match session." };
  }

  const paidAt = new Date().toISOString();
  const payment: Payment = {
    id: `pay-online-${session.id}`,
    invoiceId: session.invoiceId,
    studentId: session.studentId,
    amount: session.amount,
    method: "online",
    reference: `FLW-${input.gatewayTransactionId.replace(/\s+/g, "").slice(-16)}`,
    transactionReference: input.gatewayTransactionId,
    status: "completed",
    paidAt,
    submittedAt: paidAt,
    verificationStatus: "approved",
    reviewNote: input.paymentChannel ? `Channel: ${input.paymentChannel}` : null,
    reviewedAt: paidAt,
  };

  addMockPayment(payment);
  mockOnlinePaymentSessions[idx] = {
    ...session,
    status: "completed",
    gatewayTransactionId: input.gatewayTransactionId,
  };

  refreshStudentFeeLedger(session.studentId);
  if (session.studentId === SARAH_STUDENT_ID) {
    Object.assign(mockInvoice, ensureStudentFeeLedger(SARAH_STUDENT_ID));
  }

  return { ok: true, studentId: session.studentId };
}

export function resolvePendingPayment(
  paymentId: string,
  decision: Extract<PaymentVerificationStatus, "approved" | "rejected">,
  reviewNote: string | null,
): Payment | null {
  const pools = [mockPendingBankPayments, mockPayments, mockAdminPayments];
  let target: Payment | undefined;
  for (const pool of pools) {
    target = pool.find((p) => p.id === paymentId);
    if (target) break;
  }
  if (!target) return null;

  const reviewedAt = new Date().toISOString();
  if (decision === "approved") {
    updateMockPayment(paymentId, {
      status: "completed",
      verificationStatus: "approved",
      reviewNote,
      reviewedAt,
      paidAt: reviewedAt,
      reference: target.transactionReference?.trim()
        ? `BNK-VER-${target.transactionReference.replace(/\s+/g, "").slice(-12)}`
        : target.reference,
    });
    mockPendingBankPayments = mockPendingBankPayments.filter((p) => p.id !== paymentId);

    refreshStudentFeeLedger(target.studentId);
    if (target.studentId === SARAH_STUDENT_ID) {
      Object.assign(mockInvoice, ensureStudentFeeLedger(SARAH_STUDENT_ID));
    }
  } else {
    updateMockPayment(paymentId, {
      status: "failed",
      verificationStatus: "rejected",
      reviewNote,
      reviewedAt,
    });
    mockPendingBankPayments = mockPendingBankPayments.filter((p) => p.id !== paymentId);
    bumpStudentFeeLedgerRevision(target.studentId);
  }

  return (
    mockPayments.find((p) => p.id === paymentId) ??
    mockAdminPayments.find((p) => p.id === paymentId) ??
    null
  );
}

export const MOCK_MATERIALS: CourseMaterial[] = [
  {
    id: "mat-1",
    courseUnitId: "unit-ahn",
    title: "Week 1–2 Lecture Notes: Adult Health Assessment",
    fileType: "pdf",
    fileUrl: "/materials/ahn-assessment-notes.pdf",
    uploadedAt: "2026-07-20T08:00:00.000Z",
  },
  {
    id: "mat-2",
    courseUnitId: "unit-ahn",
    title: "Nursing Care Plan Template",
    fileType: "docx",
    fileUrl: "/materials/care-plan-template.docx",
    uploadedAt: "2026-07-22T10:00:00.000Z",
  },
  {
    id: "mat-3",
    courseUnitId: "unit-pharm",
    title: "Drug Calculation Workbook",
    fileType: "pdf",
    fileUrl: "/materials/pharm-calculations.pdf",
    uploadedAt: "2026-07-18T09:30:00.000Z",
  },
  {
    id: "mat-4",
    courseUnitId: "unit-pharm",
    title: "Common Drug Classifications Handout",
    fileType: "pdf",
    fileUrl: "/materials/drug-classifications.pdf",
    uploadedAt: "2026-07-25T14:00:00.000Z",
  },
  {
    id: "mat-5",
    courseUnitId: "unit-comm",
    title: "Community Health Survey Guide",
    fileType: "docx",
    fileUrl: "/materials/community-survey-guide.docx",
    uploadedAt: "2026-07-28T11:15:00.000Z",
  },
  {
    id: "mat-6",
    courseUnitId: "unit-mid",
    title: "Antenatal Care Protocol Slides",
    fileType: "pdf",
    fileUrl: "/materials/anc-protocol.pdf",
    uploadedAt: "2026-07-15T07:45:00.000Z",
  },
  {
    id: "mat-7",
    courseUnitId: "unit-ethics",
    title: "Code of Ethics for Nurses — Reading Pack",
    fileType: "pdf",
    fileUrl: "/materials/ethics-reading-pack.pdf",
    uploadedAt: "2026-07-10T16:00:00.000Z",
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    courseUnitId: "unit-ahn",
    title: "Care Plan Case Study",
    dueAt: "2026-08-18T23:59:00.000Z",
    maxScore: 100,
  },
  {
    id: "asg-2",
    courseUnitId: "unit-pharm",
    title: "Drug Calculation Worksheet",
    dueAt: "2026-08-20T23:59:00.000Z",
    maxScore: 50,
  },
  {
    id: "asg-3",
    courseUnitId: "unit-comm",
    title: "Community Assessment Report",
    dueAt: "2026-08-25T23:59:00.000Z",
    maxScore: 100,
  },
  {
    id: "asg-4",
    courseUnitId: "unit-ethics",
    title: "Ethics Reflection Essay",
    dueAt: "2026-09-01T23:59:00.000Z",
    maxScore: 40,
  },
];

export let mockSubmissions: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "asg-1",
    studentId: "stu-sarah",
    status: "submitted",
    submittedAt: "2026-08-10T14:22:00.000Z",
    score: null,
    fileName: "care-plan-sarah.pdf",
  },
  {
    id: "sub-2",
    assignmentId: "asg-2",
    studentId: "stu-sarah",
    status: "pending",
    submittedAt: null,
    score: null,
    fileName: null,
  },
  {
    id: "sub-3",
    assignmentId: "asg-3",
    studentId: "stu-sarah",
    status: "pending",
    submittedAt: null,
    score: null,
    fileName: null,
  },
  {
    id: "sub-4",
    assignmentId: "asg-4",
    studentId: "stu-sarah",
    status: "graded",
    submittedAt: "2026-07-28T09:10:00.000Z",
    score: 36,
    fileName: "ethics-essay.docx",
  },
];

/** Live alias — same array reference as mockSubmissions */
export const MOCK_SUBMISSIONS = mockSubmissions;

export function upsertMockSubmission(next: AssignmentSubmission) {
  const idx = mockSubmissions.findIndex(
    (s) => s.assignmentId === next.assignmentId && s.studentId === next.studentId,
  );
  if (idx >= 0) {
    Object.assign(mockSubmissions[idx], next);
  } else {
    mockSubmissions.unshift(next);
  }
}

export const MOCK_TIMETABLE: TimetableSlot[] = [
  {
    id: "tt-1",
    studentId: "stu-sarah",
    day: "Monday",
    startTime: "08:00",
    endTime: "10:00",
    courseUnitId: "unit-ahn",
    venue: "Lecture Hall A",
  },
  {
    id: "tt-2",
    studentId: "stu-sarah",
    day: "Monday",
    startTime: "10:30",
    endTime: "12:30",
    courseUnitId: "unit-ahn",
    venue: "Skills Lab 2",
  },
  {
    id: "tt-3",
    studentId: "stu-sarah",
    day: "Tuesday",
    startTime: "08:00",
    endTime: "10:00",
    courseUnitId: "unit-pharm",
    venue: "Lecture Hall B",
  },
  {
    id: "tt-4",
    studentId: "stu-sarah",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "16:00",
    courseUnitId: "unit-comm",
    venue: "Community Health Room",
  },
  {
    id: "tt-5",
    studentId: "stu-sarah",
    day: "Wednesday",
    startTime: "08:00",
    endTime: "09:00",
    courseUnitId: "unit-ethics",
    venue: "Chapel / Assembly Hall",
  },
  {
    id: "tt-6",
    studentId: "stu-sarah",
    day: "Wednesday",
    startTime: "09:30",
    endTime: "12:30",
    courseUnitId: "unit-ahn",
    venue: "Clinical Placement — Mbale RRH",
  },
  {
    id: "tt-7",
    studentId: "stu-sarah",
    day: "Thursday",
    startTime: "08:00",
    endTime: "11:00",
    courseUnitId: "unit-mid",
    venue: "Midwifery Demo Room",
  },
  {
    id: "tt-8",
    studentId: "stu-sarah",
    day: "Thursday",
    startTime: "14:00",
    endTime: "16:00",
    courseUnitId: "unit-pharm",
    venue: "Tutorial Room 3",
  },
  {
    id: "tt-9",
    studentId: "stu-sarah",
    day: "Friday",
    startTime: "09:00",
    endTime: "11:00",
    courseUnitId: "unit-comm",
    venue: "Lecture Hall A",
  },
  {
    id: "tt-10",
    studentId: "stu-sarah",
    day: "Friday",
    startTime: "11:30",
    endTime: "13:00",
    courseUnitId: "unit-ethics",
    venue: "Lecture Hall B",
  },
];

export const MOCK_EXAMS: ExamSlot[] = [
  {
    id: "ex-1",
    studentId: "stu-sarah",
    courseUnitId: "unit-pharm",
    date: "2026-09-08",
    startTime: "09:00",
    endTime: "11:00",
    venue: "Exam Hall 1",
  },
  {
    id: "ex-2",
    studentId: "stu-sarah",
    courseUnitId: "unit-ahn",
    date: "2026-09-10",
    startTime: "09:00",
    endTime: "12:00",
    venue: "Exam Hall 1",
  },
  {
    id: "ex-3",
    studentId: "stu-sarah",
    courseUnitId: "unit-mid",
    date: "2026-09-12",
    startTime: "14:00",
    endTime: "16:00",
    venue: "Exam Hall 2",
  },
  {
    id: "ex-4",
    studentId: "stu-sarah",
    courseUnitId: "unit-comm",
    date: "2026-09-15",
    startTime: "09:00",
    endTime: "11:00",
    venue: "Exam Hall 2",
  },
  {
    id: "ex-5",
    studentId: "stu-sarah",
    courseUnitId: "unit-ethics",
    date: "2026-09-17",
    startTime: "09:00",
    endTime: "10:30",
    venue: "Lecture Hall A",
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Orientation materials",
    body: "June and July 2026 intake orientation materials are available at the registry.",
    publishedAt: "2026-08-08T08:00:00.000Z",
    audience: "students",
  },
  {
    id: "ann-2",
    title: "Clinical rotations",
    body: "Clinical rotation schedules for next month are posted on the notice board and in the LMS Hub.",
    publishedAt: "2026-08-07T10:00:00.000Z",
    audience: "students",
  },
  {
    id: "ann-3",
    title: "Chapel service",
    body: "Chapel service every Wednesday at 8:00 AM — attendance encouraged.",
    publishedAt: "2026-08-05T07:30:00.000Z",
    audience: "all",
  },
  {
    id: "ann-4",
    title: "End-of-semester exam circular",
    body: "Provisional exam timetable for September 2026 is published. Check Timetable → Exams for your personal schedule. Arrive 30 minutes early with student ID.",
    publishedAt: "2026-08-09T12:00:00.000Z",
    audience: "students",
  },
  {
    id: "ann-5",
    title: "Library extended hours",
    body: "The school library will remain open until 8:00 PM on weekdays during the revision period (1–16 September).",
    publishedAt: "2026-08-10T09:00:00.000Z",
    audience: "students",
  },
  {
    id: "ann-6",
    title: "Fee payment reminder",
    body: "Students with outstanding balances should clear fees before exam cards are issued. Pay via the Fees portal by bank transfer.",
    publishedAt: "2026-08-11T08:30:00.000Z",
    audience: "students",
  },
];

/* ─── Admin control panel seed data ─── */

export const MOCK_ADMIN_USER: User = {
  id: "user-admin",
  email: "registry@mbsnm.org",
  passwordHash: "mock-admin-hash",
  role: "admin",
  createdAt: "2023-01-10T08:00:00.000Z",
  accountActivated: true,
  mustChangePassword: false,
};

export const MOCK_ADMIN_SESSION: Session = {
  id: "sess-admin",
  userId: "user-admin",
  role: "admin",
  token: "mock-jwt.admin.registry",
  expiresAt: "2027-01-01T00:00:00.000Z",
};

export const MOCK_ADMIN_PROFILE: AdminProfile = {
  id: "adm-1",
  userId: "user-admin",
  fullName: "Namukasa Rebecca",
  title: "Academic Registrar",
  email: "registry@mbsnm.org",
  phone: "+256 454 123 400",
};

/** Mutable multi-student registry for the admin dashboard */
export let mockAdminStudents: AdminStudentRecord[] = [
  {
    id: "stu-sarah",
    userId: "user-sarah",
    studentNumber: "MBSNM/NS/2024/018",
    fullName: "Nagudi Sarah",
    email: "nagudi.sarah@mbaleschoolofnursing.ac.ug",
    phone: "+256 700 123 456",
    programId: "prog-dn",
    address: "Mbale Municipality, Eastern Uganda",
    accountStatus: "active",
    feeBalance: 450_000,
    feeTotalPaid: 1_000_000,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 5,
    cumulativeGpa: 3.42,
    registeredAt: "2024-08-01T08:00:00.000Z",
  },
  {
    id: "stu-okello",
    userId: "user-okello",
    studentNumber: "MBSNM/NS/2024/021",
    fullName: "Okello Brian",
    email: "okello.brian@mbaleschoolofnursing.ac.ug",
    phone: "+256 772 441 902",
    programId: "prog-dn",
    address: "Soroti City, Eastern Uganda",
    accountStatus: "active",
    feeBalance: 0,
    feeTotalPaid: 1_450_000,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 5,
    cumulativeGpa: 3.18,
    registeredAt: "2024-08-02T09:30:00.000Z",
  },
  {
    id: "stu-nakato",
    userId: "user-nakato",
    studentNumber: "MBSNM/NS/2025/007",
    fullName: "Nakato Esther",
    email: "nakato.esther@mbaleschoolofnursing.ac.ug",
    phone: "+256 705 662 118",
    programId: "prog-dn",
    address: "Jinja City, Eastern Uganda",
    accountStatus: "active",
    feeBalance: 720_000,
    feeTotalPaid: 730_000,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 4,
    cumulativeGpa: 3.65,
    registeredAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "stu-waiswa",
    userId: "user-waiswa",
    studentNumber: "MBSNM/NS/2025/014",
    fullName: "Waiswa Daniel",
    email: "waiswa.daniel@mbaleschoolofnursing.ac.ug",
    phone: "+256 781 334 055",
    programId: "prog-dn",
    address: "Iganga Town, Eastern Uganda",
    accountStatus: "active",
    feeBalance: 200_000,
    feeTotalPaid: 1_250_000,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 5,
    cumulativeGpa: 2.95,
    registeredAt: "2025-01-18T11:20:00.000Z",
  },
  {
    id: "stu-auma",
    userId: "user-auma",
    studentNumber: "MBSNM/NS/2026/042",
    fullName: "Auma Grace",
    email: "auma.grace@mbaleschoolofnursing.ac.ug",
    phone: "+256 704 888 301",
    programId: "prog-dn",
    address: "Pending — activation incomplete",
    accountStatus: "pending_approval",
    feeBalance: 1_450_000,
    feeTotalPaid: 0,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 0,
    cumulativeGpa: 0,
    registeredAt: "2026-07-28T14:00:00.000Z",
  },
  {
    id: "stu-mukisa",
    userId: "user-mukisa",
    studentNumber: "MBSNM/NS/2026/051",
    fullName: "Mukisa Joan",
    email: "mukisa.joan@mbaleschoolofnursing.ac.ug",
    phone: "+256 759 210 447",
    programId: "prog-dn",
    address: "Pending — awaiting registry approval",
    accountStatus: "pending_approval",
    feeBalance: 1_450_000,
    feeTotalPaid: 0,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 0,
    cumulativeGpa: 0,
    registeredAt: "2026-08-05T09:45:00.000Z",
  },
  {
    id: "stu-kato",
    userId: "user-kato",
    studentNumber: "MBSNM/NS/2023/009",
    fullName: "Kato Isaac",
    email: "kato.isaac@mbaleschoolofnursing.ac.ug",
    phone: "+256 700 998 221",
    programId: "prog-dn",
    address: "Tororo Municipality",
    accountStatus: "inactive",
    feeBalance: 0,
    feeTotalPaid: 1_450_000,
    feeTotalBilled: 1_450_000,
    enrolledUnits: 0,
    cumulativeGpa: 3.01,
    registeredAt: "2023-08-10T08:00:00.000Z",
  },
];

/** Admin-recorded payments across the student body (includes Sarah's live ledger) */
export let mockAdminPayments: Payment[] = [
  {
    id: "apay-1",
    invoiceId: "inv-okello-2025-1",
    studentId: "stu-okello",
    amount: 1_450_000,
    method: "bank",
    reference: "BNK-CENT-441902",
    status: "completed",
    paidAt: "2025-09-01T10:00:00.000Z",
  },
  {
    id: "apay-2",
    invoiceId: "inv-nakato-2025-1",
    studentId: "stu-nakato",
    amount: 730_000,
    method: "mtn",
    reference: "MTN-20260112-66211",
    status: "completed",
    paidAt: "2026-01-12T15:20:00.000Z",
  },
  {
    id: "apay-3",
    invoiceId: "inv-waiswa-2025-1",
    studentId: "stu-waiswa",
    amount: 800_000,
    method: "airtel",
    reference: "AIR-20260203-33405",
    status: "completed",
    paidAt: "2026-02-03T11:05:00.000Z",
  },
  {
    id: "apay-4",
    invoiceId: "inv-waiswa-2025-1",
    studentId: "stu-waiswa",
    amount: 450_000,
    method: "bank",
    reference: "BNK-STANBIC-990114",
    status: "completed",
    paidAt: "2026-06-18T09:40:00.000Z",
  },
];

export function syncAdminStudentFeesFromInvoice() {
  const invoice = ensureStudentFeeLedger(SARAH_STUDENT_ID);
  Object.assign(mockInvoice, invoice);
}

export function upsertMockAdminStudentFromAdmission(record: AdminStudentRecord) {
  const emailKey = record.email.trim().toLowerCase();
  const idx = mockAdminStudents.findIndex(
    (s) => s.id === record.id || s.email.trim().toLowerCase() === emailKey,
  );
  if (idx >= 0) {
    mockAdminStudents[idx] = { ...mockAdminStudents[idx], ...record, id: mockAdminStudents[idx]!.id };
    return { ...mockAdminStudents[idx]! };
  }
  mockAdminStudents = [...mockAdminStudents, record];
  return { ...record };
}

export function approveAdminStudent(studentId: string): AdminStudentRecord | null {
  const row = mockAdminStudents.find((s) => s.id === studentId);
  if (!row || row.accountStatus !== "pending_approval") return null;
  row.accountStatus = "active";
  return { ...row };
}

export function updateAdminStudentFees(
  studentId: string,
  patch: { feeTotalPaid: number; feeBalance: number; feeTotalBilled?: number },
) {
  const row = mockAdminStudents.find((s) => s.id === studentId);
  if (!row) return null;
  row.feeTotalPaid = patch.feeTotalPaid;
  row.feeBalance = patch.feeBalance;
  if (patch.feeTotalBilled !== undefined) {
    row.feeTotalBilled = patch.feeTotalBilled;
  }
  setStudentInvoice(
    studentId,
    {
      id: studentId === SARAH_STUDENT_ID ? mockInvoice.id : `inv-${studentId}-2025-1`,
      studentId,
      semesterLabel: mockInvoice.semesterLabel,
      tuition: mockInvoice.tuition,
      functionalFees: mockInvoice.functionalFees,
      totalBilled: patch.feeTotalBilled ?? row.feeTotalBilled,
      totalPaid: patch.feeTotalPaid,
      balance: patch.feeBalance,
      paymentDueDate: mockInvoice.paymentDueDate,
    },
    {
      studentNumber: row.studentNumber,
      fullName: row.fullName,
      email: row.email,
    },
  );
  if (studentId === SARAH_STUDENT_ID) {
    Object.assign(mockInvoice, ensureStudentFeeLedger(SARAH_STUDENT_ID));
  }
  return { ...row };
}

export function addAdminPayment(payment: Payment) {
  mockAdminPayments = [payment, ...mockAdminPayments];
  if (payment.studentId === MOCK_PROFILE.id) {
    addMockPayment(payment);
  }
  bumpStudentFeeLedgerRevision(payment.studentId);
}

export function addMockAnnouncement(announcement: Announcement) {
  MOCK_ANNOUNCEMENTS.unshift(announcement);
}

export function updateMockTimetableSlot(
  id: string,
  patch: Partial<Omit<TimetableSlot, "id" | "studentId">>,
): TimetableSlot | null {
  const slot = MOCK_TIMETABLE.find((s) => s.id === id);
  if (!slot) return null;
  Object.assign(slot, patch);
  return { ...slot };
}

export function addMockTimetableSlot(slot: TimetableSlot) {
  MOCK_TIMETABLE.push(slot);
}

export function removeMockTimetableSlot(id: string): boolean {
  const idx = MOCK_TIMETABLE.findIndex((s) => s.id === id);
  if (idx < 0) return false;
  MOCK_TIMETABLE.splice(idx, 1);
  return true;
}

export function addMockMaterial(material: CourseMaterial) {
  MOCK_MATERIALS.unshift(material);
}

export function addMockCatalogUnit(unit: CourseUnit) {
  MOCK_CATALOG.push(unit);
}

bindFeeLedgerStores({
  getAdminStudents: () => mockAdminStudents,
  getPayments: () => mockPayments,
  getAdminPayments: () => mockAdminPayments,
});

seedStudentInvoice(SARAH_STUDENT_ID, { ...mockInvoice }, buildDefaultFeeLineItems(mockInvoice.id));

for (const student of mockAdminStudents) {
  ensureStudentFeeLedger(student.id, {
    studentNumber: student.studentNumber,
    fullName: student.fullName,
    email: student.email,
  });
}
