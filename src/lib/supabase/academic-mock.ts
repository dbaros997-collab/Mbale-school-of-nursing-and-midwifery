import type {
  ClinicalPlacementRow,
  CourseRow,
  FeePaymentRow,
  StudentRow,
} from "@/lib/supabase/academic-types";

export const MOCK_COURSES: CourseRow[] = [
  {
    id: "course-dn-direct",
    course_code: "DN-DIRECT",
    course_name: "Diploma in Nursing (Direct)",
    description:
      "Two-year direct-entry nursing programme covering clinical care, pharmacology, community health, and professional ethics.",
    credits: 120,
  },
  {
    id: "course-dn-extension",
    course_code: "DN-EXT",
    course_name: "Diploma in Nursing (Extension)",
    description:
      "Upgrade pathway for certified nurses seeking diploma-level competence and expanded clinical responsibility.",
    credits: 90,
  },
  {
    id: "course-cn",
    course_code: "CN",
    course_name: "Certificate in Nursing",
    description:
      "Foundational nursing education focused on bedside care, infection prevention, and compassionate service.",
    credits: 100,
  },
  {
    id: "course-dm-direct",
    course_code: "DM-DIRECT",
    course_name: "Diploma in Midwifery (Direct)",
    description:
      "Direct-entry midwifery programme preparing students for safe motherhood and skilled birth attendance.",
    credits: 120,
  },
  {
    id: "course-nsg1101",
    course_code: "NSG1101",
    course_name: "Fundamentals of Nursing",
    description: "Core principles of nursing practice, patient assessment, and basic clinical skills.",
    credits: 4,
  },
  {
    id: "course-nsg2101",
    course_code: "NSG2101",
    course_name: "Adult Health Nursing",
    description: "Medical-surgical nursing concepts with supervised ward practice.",
    credits: 4,
  },
  {
    id: "course-nsg2104",
    course_code: "NSG2104",
    course_name: "Clinical Practicum I",
    description: "Supervised clinical rotation at partner hospitals and community health sites.",
    credits: 6,
  },
];

export const MOCK_STUDENTS: StudentRow[] = [
  {
    id: "stu-sarah",
    full_name: "Nagudi Sarah",
    email: "nagudi.sarah@student.mbsnm.org",
    phone: "+256 700 123 456",
    course_enrolled: "course-dn-direct",
    enrollment_date: "2024-08-01",
    status: "active",
  },
  {
    id: "stu-okello",
    full_name: "Okello Brian",
    email: "okello.brian@student.mbsnm.org",
    phone: "+256 772 441 902",
    course_enrolled: "course-dn-direct",
    enrollment_date: "2024-08-02",
    status: "active",
  },
  {
    id: "stu-nakato",
    full_name: "Nakato Esther",
    email: "nakato.esther@student.mbsnm.org",
    phone: "+256 705 662 118",
    course_enrolled: "course-dn-direct",
    enrollment_date: "2025-01-15",
    status: "active",
  },
  {
    id: "stu-waiswa",
    full_name: "Waiswa Daniel",
    email: "waiswa.daniel@student.mbsnm.org",
    phone: "+256 781 334 055",
    course_enrolled: "course-dn-direct",
    enrollment_date: "2025-01-18",
    status: "active",
  },
  {
    id: "stu-auma",
    full_name: "Auma Grace",
    email: "auma.grace@student.mbsnm.org",
    phone: "+256 702 889 441",
    course_enrolled: "course-cn",
    enrollment_date: "2026-02-01",
    status: "pending",
  },
];

export const MOCK_CLINICAL_PLACEMENTS: ClinicalPlacementRow[] = [
  {
    id: "cp-001",
    student_id: "stu-sarah",
    facility_name: "Mbale Referral Hospital",
    supervisor_name: "Sr. Rebecca Namukasa",
    start_date: "2025-09-01",
    end_date: "2025-12-15",
    status: "active",
  },
  {
    id: "cp-002",
    student_id: "stu-sarah",
    facility_name: "CURE Children's Hospital of Uganda",
    supervisor_name: "Dr. James Okello",
    start_date: "2026-01-10",
    end_date: "2026-03-20",
    status: "scheduled",
  },
  {
    id: "cp-003",
    student_id: "stu-okello",
    facility_name: "Mbale Regional Referral Hospital — Medical Ward",
    supervisor_name: "Sr. Patricia Ayo",
    start_date: "2025-09-01",
    end_date: "2025-11-30",
    status: "completed",
  },
  {
    id: "cp-004",
    student_id: "stu-nakato",
    facility_name: "Busia Health Centre IV",
    supervisor_name: "Sr. Miriam Chemutai",
    start_date: "2026-02-01",
    end_date: "2026-04-30",
    status: "active",
  },
  {
    id: "cp-005",
    student_id: "stu-waiswa",
    facility_name: "Mbale Referral Hospital — Maternity",
    supervisor_name: "Sr. Faith Nabwire",
    start_date: "2025-10-01",
    end_date: "2026-01-15",
    status: "completed",
  },
];

export const MOCK_FEE_PAYMENTS: FeePaymentRow[] = [
  {
    id: "fp-001",
    student_id: "stu-sarah",
    amount_paid: 500000,
    balance_due: 450000,
    payment_date: "2025-01-20",
    payment_method: "mtn",
  },
  {
    id: "fp-002",
    student_id: "stu-sarah",
    amount_paid: 500000,
    balance_due: 950000,
    payment_date: "2024-09-05",
    payment_method: "bank",
  },
  {
    id: "fp-003",
    student_id: "stu-okello",
    amount_paid: 1450000,
    balance_due: 0,
    payment_date: "2025-02-01",
    payment_method: "bank",
  },
  {
    id: "fp-004",
    student_id: "stu-nakato",
    amount_paid: 730000,
    balance_due: 720000,
    payment_date: "2025-02-10",
    payment_method: "airtel",
  },
  {
    id: "fp-005",
    student_id: "stu-waiswa",
    amount_paid: 625000,
    balance_due: 200000,
    payment_date: "2025-03-01",
    payment_method: "mtn",
  },
  {
    id: "fp-006",
    student_id: "stu-waiswa",
    amount_paid: 625000,
    balance_due: 825000,
    payment_date: "2024-10-15",
    payment_method: "bank",
  },
];

export function getMockCourses(): CourseRow[] {
  return MOCK_COURSES.map((c) => ({ ...c }));
}

export function getMockStudents(): StudentRow[] {
  return MOCK_STUDENTS.map((s) => ({ ...s }));
}

export function getMockClinicalPlacements(studentId?: string): ClinicalPlacementRow[] {
  const list = studentId
    ? MOCK_CLINICAL_PLACEMENTS.filter((p) => p.student_id === studentId)
    : MOCK_CLINICAL_PLACEMENTS;
  return list.map((p) => ({ ...p }));
}

export function getMockFeePayments(studentId?: string): FeePaymentRow[] {
  const list = studentId
    ? MOCK_FEE_PAYMENTS.filter((p) => p.student_id === studentId)
    : MOCK_FEE_PAYMENTS;
  return list.map((p) => ({ ...p }));
}

export function courseNameById(courseId: string): string | undefined {
  return MOCK_COURSES.find((c) => c.id === courseId)?.course_name;
}
