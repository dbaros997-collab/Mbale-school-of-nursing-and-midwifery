import { CalendarClock, MapPin } from "lucide-react";
import type { ExamSlotView } from "@/services/portal/timetable";
import { StatusBadge } from "@/components/portal/StatusBadge";

type ExamTimelineProps = {
  exams: ExamSlotView[];
};

function formatExamDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(isoDate: string) {
  const target = new Date(`${isoDate}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((target - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Completed window";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function ExamTimeline({ exams }: ExamTimelineProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Exam timetable
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Provisional end-of-semester exam timeline for your enrolled units.
        </p>
      </div>

      {exams.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted">No exams scheduled yet.</p>
      ) : (
        <ol className="relative space-y-0 px-5 py-4">
          {exams.map((exam, index) => (
            <li key={exam.id} className="relative flex gap-4 pb-6 last:pb-2">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-3 w-3 rounded-full bg-primary" />
                {index < exams.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-border" aria-hidden />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-surface/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-primary">{exam.courseCode}</p>
                  <StatusBadge tone="info">{daysUntil(exam.date)}</StatusBadge>
                </div>
                <p className="mt-0.5 text-sm text-foreground">{exam.courseTitle}</p>
                <p className="mt-2 text-xs font-semibold text-muted">
                  {formatExamDate(exam.date)} · {exam.startTime}–{exam.endTime}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {exam.venue}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
