import type {
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
  Program,
  SemesterRegistration,
  Session,
  StudentProfile,
  TimetableSlot,
  User,
} from "./schema";

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
  email: "nagudi.sarah@student.mbsnm.org",
  passwordHash: "mock-hash",
  role: "student",
  createdAt: "2024-08-01T08:00:00.000Z",
};

export const MOCK_PROFILE: StudentProfile = {
  id: "stu-sarah",
  userId: "user-sarah",
  studentNumber: "MBSNM/NS/2024/018",
  fullName: "Nagudi Sarah",
  programId: "prog-dn",
  phone: "+256 700 123 456",
  email: "nagudi.sarah@student.mbsnm.org",
  address: "Mbale Municipality, Eastern Uganda",
  nextOfKin: {
    name: "Nagudi Peter",
    relationship: "Father",
    phone: "+256 772 987 654",
    email: "peter.nagudi@email.com",
  },
  creditsCompleted: 48,
  creditsRequired: 120,
  cumulativeGpa: 3.42,
  semesterGpa: 3.55,
};

export function updateMockProfile(
  patch: Partial<Omit<StudentProfile, "id" | "userId" | "studentNumber" | "programId">> & {
    nextOfKin?: Partial<StudentProfile["nextOfKin"]>;
  },
) {
  if (patch.nextOfKin) {
    Object.assign(MOCK_PROFILE.nextOfKin, patch.nextOfKin);
  }
  const { nextOfKin: _kin, ...rest } = patch;
  Object.assign(MOCK_PROFILE, rest);
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
};

/** Alias for older imports — always read live balance via this object */
export const MOCK_INVOICE = mockInvoice;

export function setMockInvoice(next: FeeInvoice) {
  Object.assign(mockInvoice, next);
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
    body: "July 2026 intake orientation materials are available at the registry.",
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
    body: "Students with outstanding balances should clear fees before exam cards are issued. Pay via the Fees portal (MTN / Airtel / bank).",
    publishedAt: "2026-08-11T08:30:00.000Z",
    audience: "students",
  },
];
