import type {
  Assignment,
  AssignmentSubmission,
  CourseMaterial,
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
    return { label: `${days}d ${hours}h left`, isOverdue: false };
  }
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return { label: `${hours}h ${minutes}m left`, isOverdue: false };
}

export async function getLmsBundle(_studentId?: string | null): Promise<LmsBundle> {
  return { materials: [], assignments: [] };
}

export async function downloadMaterial(_materialId: string): Promise<{
  ok: boolean;
  fileName?: string;
  blob?: Blob;
  message: string;
}> {
  return { ok: false, message: "No materials published yet for your enrolled units." };
}

export async function submitAssignment(
  _assignmentId: string,
  _fileName: string,
  _studentId?: string,
): Promise<{ ok: boolean; message: string; bundle: LmsBundle }> {
  return {
    ok: false,
    message: "Assignment submission is not available yet.",
    bundle: { materials: [], assignments: [] },
  };
}

export type { SubmissionStatus };
