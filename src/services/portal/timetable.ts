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

const emptyByDay: Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]> = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

export async function getTimetableBundle(_studentId?: string | null): Promise<TimetableBundle> {
  return {
    semesterLabel: "—",
    weekSlots: [],
    byDay: emptyByDay,
    exams: [],
  };
}
