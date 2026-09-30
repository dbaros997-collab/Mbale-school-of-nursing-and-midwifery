import type { StudentProfile } from "./schema";

export type FeesStudentContext = {
  studentId: string;
  studentName: string;
  studentNumber: string;
  studentEmail: string;
};

export function resolveFeesStudentContext(
  studentId?: string | null,
  profile?: StudentProfile | null,
): FeesStudentContext | null {
  const trimmed = studentId?.trim();
  if (profile && trimmed && profile.id === trimmed) {
    return {
      studentId: profile.id,
      studentName: profile.fullName,
      studentNumber: profile.studentNumber,
      studentEmail: profile.email,
    };
  }
  if (!trimmed) return null;
  return {
    studentId: trimmed,
    studentName: profile?.fullName ?? "Student",
    studentNumber: profile?.studentNumber ?? trimmed,
    studentEmail: profile?.email ?? "",
  };
}
