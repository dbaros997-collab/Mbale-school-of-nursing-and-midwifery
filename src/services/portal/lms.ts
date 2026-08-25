import { mockDelay } from "@/lib/mock-delay";
import {
  MOCK_ASSIGNMENTS,
  MOCK_MATERIALS,
  MOCK_PROFILE,
  MOCK_UNITS,
  mockSubmissions,
  upsertMockSubmission,
} from "@/lib/portal/mock-store";
import type {
  Assignment,
  AssignmentSubmission,
  CourseMaterial,
  CourseUnit,
  SubmissionStatus,
} from "@/lib/portal/schema";

export type MaterialRow = CourseMaterial & {
  courseCode: string;
  courseTitle: string;
};

export type AssignmentRow = {
  assignment: Assignment;
  courseCode: string;
  courseTitle: string;
  submission: AssignmentSubmission;
  countdownLabel: string;
  isOverdue: boolean;
  canSubmit: boolean;
};

export type LmsBundle = {
  materials: MaterialRow[];
  assignments: AssignmentRow[];
};

function unitMap(): Record<string, CourseUnit> {
  return Object.fromEntries(MOCK_UNITS.map((u) => [u.id, u]));
}

export function formatCountdown(dueAt: string, now = Date.now()): {
  label: string;
  isOverdue: boolean;
} {
  const ms = new Date(dueAt).getTime() - now;
  if (ms < 0) {
    const days = Math.ceil(Math.abs(ms) / (1000 * 60 * 60 * 24));
    return { label: `Overdue by ${days} day${days === 1 ? "" : "s"}`, isOverdue: true };
  }
  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) {
    return {
      label: `${days}d ${hours}h left`,
      isOverdue: false,
    };
  }
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return { label: `${hours}h ${minutes}m left`, isOverdue: false };
}

function buildBundle(studentId: string): LmsBundle {
  const units = unitMap();

  const materials: MaterialRow[] = MOCK_MATERIALS.map((m) => {
    const unit = units[m.courseUnitId];
    return {
      ...m,
      courseCode: unit?.code ?? "—",
      courseTitle: unit?.title ?? "Course",
    };
  }).sort((a, b) => a.courseCode.localeCompare(b.courseCode));

  const assignments: AssignmentRow[] = MOCK_ASSIGNMENTS.map((assignment) => {
    const unit = units[assignment.courseUnitId];
    const submission =
      mockSubmissions.find(
        (s) => s.assignmentId === assignment.id && s.studentId === studentId,
      ) ??
      ({
        id: `sub-new-${assignment.id}`,
        assignmentId: assignment.id,
        studentId,
        status: "pending" as SubmissionStatus,
        submittedAt: null,
        score: null,
        fileName: null,
      } satisfies AssignmentSubmission);

    const { label, isOverdue } = formatCountdown(assignment.dueAt);
    const canSubmit =
      submission.status === "pending" || submission.status === "submitted";

    return {
      assignment,
      courseCode: unit?.code ?? "—",
      courseTitle: unit?.title ?? "Course",
      submission,
      countdownLabel: label,
      isOverdue,
      canSubmit,
    };
  }).sort(
    (a, b) =>
      new Date(a.assignment.dueAt).getTime() - new Date(b.assignment.dueAt).getTime(),
  );

  return { materials, assignments };
}

/** Ready for GET /api/portal/lms */
export async function getLmsBundle(studentId = MOCK_PROFILE.id): Promise<LmsBundle> {
  await mockDelay(280);
  return buildBundle(studentId);
}

/** Mock lecture material download (generates a small text blob) */
export async function downloadMaterial(materialId: string): Promise<{
  ok: boolean;
  fileName?: string;
  blob?: Blob;
  message: string;
}> {
  await mockDelay(200);
  const material = MOCK_MATERIALS.find((m) => m.id === materialId);
  if (!material) {
    return { ok: false, message: "Material not found." };
  }

  const ext = material.fileType;
  const fileName = `${material.title.replace(/[^\w\s-]/g, "").trim()}.${ext}`;
  const content = [
    "MBSNM Learning Management System",
    "================================",
    `Title: ${material.title}`,
    `Type: ${ext.toUpperCase()}`,
    `Uploaded: ${material.uploadedAt}`,
    "",
    "This is a mock lecture note download for demonstration.",
    "Replace with real files from your content storage / LMS backend.",
  ].join("\n");

  const blob = new Blob([content], {
    type: ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  return { ok: true, fileName, blob, message: "Download ready." };
}

/** Ready for POST /api/portal/lms/assignments/:id/submit */
export async function submitAssignment(
  assignmentId: string,
  fileName: string,
  studentId = MOCK_PROFILE.id,
): Promise<{ ok: boolean; message: string; bundle: LmsBundle }> {
  await mockDelay(550);

  const assignment = MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId);
  if (!assignment) {
    return { ok: false, message: "Assignment not found.", bundle: buildBundle(studentId) };
  }

  const existing = mockSubmissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  );

  if (existing?.status === "graded") {
    return {
      ok: false,
      message: "This assignment is already graded and cannot be resubmitted.",
      bundle: buildBundle(studentId),
    };
  }

  if (!fileName.trim()) {
    return {
      ok: false,
      message: "Choose a file to upload (PDF or DOCX).",
      bundle: buildBundle(studentId),
    };
  }

  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".doc")) {
    return {
      ok: false,
      message: "Only PDF or DOCX files are accepted.",
      bundle: buildBundle(studentId),
    };
  }

  upsertMockSubmission({
    id: existing?.id ?? `sub-${Date.now()}`,
    assignmentId,
    studentId,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    score: null,
    fileName: fileName.trim(),
  });

  return {
    ok: true,
    message: `“${assignment.title}” submitted successfully.`,
    bundle: buildBundle(studentId),
  };
}
