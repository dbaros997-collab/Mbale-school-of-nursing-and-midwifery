import { mockDelay } from "@/lib/mock-delay";
import {
  CURRENT_SEMESTER,
  MOCK_EXAMS,
  MOCK_PROFILE,
  MOCK_TIMETABLE,
  MOCK_UNITS,
} from "@/lib/portal/mock-store";
import type { ExamSlot, TimetableSlot } from "@/lib/portal/schema";

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type TimetableSlotView = TimetableSlot & {
  courseCode: string;
  courseTitle: string;
};

export type ExamSlotView = ExamSlot & {
  courseCode: string;
  courseTitle: string;
};

export type TimetableBundle = {
  semesterLabel: string;
  weekSlots: TimetableSlotView[];
  byDay: Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]>;
  exams: ExamSlotView[];
};

function unitLookup() {
  return Object.fromEntries(MOCK_UNITS.map((u) => [u.id, u]));
}

/** Ready for GET /api/portal/timetable */
export async function getTimetableBundle(
  studentId = MOCK_PROFILE.id,
): Promise<TimetableBundle> {
  await mockDelay(280);
  const units = unitLookup();

  const weekSlots: TimetableSlotView[] = MOCK_TIMETABLE.filter(
    (s) => s.studentId === studentId,
  )
    .map((s) => ({
      ...s,
      courseCode: units[s.courseUnitId]?.code ?? "—",
      courseTitle: units[s.courseUnitId]?.title ?? "Course",
    }))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const byDay = Object.fromEntries(
    WEEK_DAYS.map((day) => [day, weekSlots.filter((s) => s.day === day)]),
  ) as Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]>;

  const exams: ExamSlotView[] = MOCK_EXAMS.filter((e) => e.studentId === studentId)
    .map((e) => ({
      ...e,
      courseCode: units[e.courseUnitId]?.code ?? "—",
      courseTitle: units[e.courseUnitId]?.title ?? "Course",
    }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return {
    semesterLabel: CURRENT_SEMESTER,
    weekSlots,
    byDay,
    exams,
  };
}
