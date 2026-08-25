"use server";

import { mockDelay } from "@/lib/mock-delay";

import {
  courseNameById,
  getMockClinicalPlacements,
  getMockCourses,
  getMockFeePayments,
  getMockStudents,
} from "@/lib/supabase/academic-mock";
import type {
  AcademicRecordsBundle,
  ClinicalPlacementRow,
  CourseRow,
  FeePaymentRow,
  StudentRow,
} from "@/lib/supabase/academic-types";
import {
  mapClinicalPlacementRow,
  mapCourseRow,
  mapFeePaymentRow,
  mapStudentRow,
} from "@/lib/supabase/academic-types";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function buildBundle(
  students: StudentRow[],
  courses: CourseRow[],
  placements: ClinicalPlacementRow[],
  payments: FeePaymentRow[],
  dataSource: "supabase" | "mock",
): AcademicRecordsBundle {
  const courseMap = new Map(courses.map((c) => [c.id, c.course_name]));

  return {
    students: students.map((s) => mapStudentRow(s, courseMap.get(s.course_enrolled))),
    courses: courses.map(mapCourseRow),
    clinicalPlacements: placements.map(mapClinicalPlacementRow),
    feePayments: payments.map(mapFeePaymentRow),
    dataSource,
  };
}

function fetchFromMock(studentId?: string): AcademicRecordsBundle {
  const courses = getMockCourses();
  const students = studentId
    ? getMockStudents().filter((s) => s.id === studentId)
    : getMockStudents();
  return buildBundle(
    students,
    courses,
    getMockClinicalPlacements(studentId),
    getMockFeePayments(studentId),
    "mock",
  );
}

async function fetchFromSupabase(studentId?: string): Promise<AcademicRecordsBundle> {
  const supabase = createAdminClient();

  let studentsQuery = supabase.from("students").select("*").order("full_name");
  if (studentId) studentsQuery = studentsQuery.eq("id", studentId);

  let placementsQuery = supabase.from("clinical_placements").select("*").order("start_date", { ascending: false });
  if (studentId) placementsQuery = placementsQuery.eq("student_id", studentId);

  let paymentsQuery = supabase.from("fee_payments").select("*").order("payment_date", { ascending: false });
  if (studentId) paymentsQuery = paymentsQuery.eq("student_id", studentId);

  const [studentsRes, coursesRes, placementsRes, paymentsRes] = await Promise.all([
    studentsQuery,
    supabase.from("courses").select("*").order("course_code"),
    placementsQuery,
    paymentsQuery,
  ]);

  if (studentsRes.error) throw studentsRes.error;
  if (coursesRes.error) throw coursesRes.error;
  if (placementsRes.error) throw placementsRes.error;
  if (paymentsRes.error) throw paymentsRes.error;

  return buildBundle(
    (studentsRes.data ?? []) as StudentRow[],
    (coursesRes.data ?? []) as CourseRow[],
    (placementsRes.data ?? []) as ClinicalPlacementRow[],
    (paymentsRes.data ?? []) as FeePaymentRow[],
    "supabase",
  );
}

/** All core academic records, optionally scoped to one student. */
export async function getAcademicRecordsBundle(
  studentId?: string,
): Promise<AcademicRecordsBundle> {
  await mockDelay(180);

  if (isSupabaseConfigured()) {
    try {
      return await fetchFromSupabase(studentId);
    } catch (error) {
      console.error("[getAcademicRecordsBundle] Supabase failed, using mock:", error);
    }
  }

  return fetchFromMock(studentId);
}

/** Resolve enrolled course display name (mock helper). */
export async function getEnrolledCourseName(courseId: string): Promise<string> {
  await mockDelay(0);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("courses")
        .select("course_name")
        .eq("id", courseId)
        .maybeSingle();
      if (data?.course_name) return data.course_name as string;
    } catch {
      // fall through
    }
  }
  return courseNameById(courseId) ?? courseId;
}
