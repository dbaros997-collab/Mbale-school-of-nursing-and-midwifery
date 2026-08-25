import { mockDelay } from "@/lib/mock-delay";
import {
  MOCK_PROGRAM,
  approveAdminStudent,
  mockAdminStudents,
  mockRegistration,
} from "@/lib/portal/mock-store";
import type { AdminStudentRecord, SemesterRegistration } from "@/lib/portal/schema";

export type AdminStudentRow = AdminStudentRecord & {
  programTitle: string;
  programCode: string;
};

export type AdminStudentsBundle = {
  students: AdminStudentRow[];
  pendingCount: number;
  activeCount: number;
  semesterRegistration: SemesterRegistration | null;
};

function enrich(row: AdminStudentRecord): AdminStudentRow {
  return {
    ...row,
    programTitle: MOCK_PROGRAM.title,
    programCode: MOCK_PROGRAM.code,
  };
}

function snapshot(): AdminStudentsBundle {
  const students = [...mockAdminStudents]
    .map(enrich)
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  return {
    students,
    pendingCount: students.filter((s) => s.accountStatus === "pending_approval").length,
    activeCount: students.filter((s) => s.accountStatus === "active").length,
    semesterRegistration:
      mockRegistration.status === "submitted" || mockRegistration.status === "approved"
        ? { ...mockRegistration, courseUnitIds: [...mockRegistration.courseUnitIds] }
        : null,
  };
}

/** Ready for GET /api/portal/admin/students */
export async function getAdminStudentsBundle(): Promise<AdminStudentsBundle> {
  await mockDelay(260);
  return snapshot();
}

/** Ready for GET /api/portal/admin/students/:id */
export async function getAdminStudent(
  studentId: string,
): Promise<{ ok: boolean; student?: AdminStudentRow; message: string }> {
  await mockDelay(180);
  const row = mockAdminStudents.find((s) => s.id === studentId);
  if (!row) {
    return { ok: false, message: "Student record not found." };
  }
  return { ok: true, student: enrich(row), message: "OK" };
}

/** Ready for POST /api/portal/admin/students/:id/approve */
export async function approveStudentRegistration(
  studentId: string,
): Promise<{ ok: boolean; message: string; bundle: AdminStudentsBundle }> {
  await mockDelay(450);
  const approved = approveAdminStudent(studentId);
  if (!approved) {
    return {
      ok: false,
      message: "Student is not awaiting approval, or was not found.",
      bundle: snapshot(),
    };
  }
  return {
    ok: true,
    message: `Account for ${approved.fullName} has been approved.`,
    bundle: snapshot(),
  };
}
