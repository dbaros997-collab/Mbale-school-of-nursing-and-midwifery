/** Core academic tables — mirrors supabase/migrations/003_core_academic.sql */

export type StudentRecordStatus = "active" | "inactive" | "pending" | "graduated" | "withdrawn";

export type ClinicalPlacementStatus = "scheduled" | "active" | "completed" | "cancelled";

export type FeePaymentMethod = "mtn" | "airtel" | "bank" | "cash";

export type StudentRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  course_enrolled: string;
  enrollment_date: string;
  status: StudentRecordStatus;
};

export type CourseRow = {
  id: string;
  course_code: string;
  course_name: string;
  description: string;
  credits: number;
};

export type ClinicalPlacementRow = {
  id: string;
  student_id: string;
  facility_name: string;
  supervisor_name: string;
  start_date: string;
  end_date: string;
  status: ClinicalPlacementStatus;
};

export type FeePaymentRow = {
  id: string;
  student_id: string;
  amount_paid: number;
  balance_due: number;
  payment_date: string;
  payment_method: FeePaymentMethod;
};

/** Client-friendly shapes (camelCase) */
export type Student = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  courseEnrolled: string;
  courseName?: string;
  enrollmentDate: string;
  status: StudentRecordStatus;
};

export type Course = {
  id: string;
  courseCode: string;
  courseName: string;
  description: string;
  credits: number;
};

export type ClinicalPlacement = {
  id: string;
  studentId: string;
  facilityName: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  status: ClinicalPlacementStatus;
};

export type FeePayment = {
  id: string;
  studentId: string;
  amountPaid: number;
  balanceDue: number;
  paymentDate: string;
  paymentMethod: FeePaymentMethod;
};

export type AcademicRecordsBundle = {
  students: Student[];
  courses: Course[];
  clinicalPlacements: ClinicalPlacement[];
  feePayments: FeePayment[];
  dataSource: "supabase" | "mock";
};

export const STUDENT_STATUS_LABELS: Record<StudentRecordStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  graduated: "Graduated",
  withdrawn: "Withdrawn",
};

export const PLACEMENT_STATUS_LABELS: Record<ClinicalPlacementStatus, string> = {
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const FEE_PAYMENT_METHOD_LABELS: Record<FeePaymentMethod, string> = {
  mtn: "MTN Mobile Money",
  airtel: "Airtel Money",
  bank: "Bank transfer",
  cash: "Cash",
};

export function mapStudentRow(row: StudentRow, courseName?: string): Student {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    courseEnrolled: row.course_enrolled,
    courseName,
    enrollmentDate: row.enrollment_date,
    status: row.status,
  };
}

export function mapCourseRow(row: CourseRow): Course {
  return {
    id: row.id,
    courseCode: row.course_code,
    courseName: row.course_name,
    description: row.description,
    credits: row.credits,
  };
}

export function mapClinicalPlacementRow(row: ClinicalPlacementRow): ClinicalPlacement {
  return {
    id: row.id,
    studentId: row.student_id,
    facilityName: row.facility_name,
    supervisorName: row.supervisor_name,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
  };
}

export function mapFeePaymentRow(row: FeePaymentRow): FeePayment {
  return {
    id: row.id,
    studentId: row.student_id,
    amountPaid: Number(row.amount_paid),
    balanceDue: Number(row.balance_due),
    paymentDate: row.payment_date,
    paymentMethod: row.payment_method,
  };
}
