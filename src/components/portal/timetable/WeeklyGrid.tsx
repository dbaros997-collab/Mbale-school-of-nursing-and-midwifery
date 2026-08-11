import { MapPin } from "lucide-react";
import { WEEK_DAYS, type TimetableSlotView } from "@/services/portal/timetable";

type WeeklyGridProps = {
  byDay: Record<(typeof WEEK_DAYS)[number], TimetableSlotView[]>;
  semesterLabel: string;
};

export function WeeklyGrid({ byDay, semesterLabel }: WeeklyGridProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Weekly class schedule
        </h2>
        <p className="mt-1 text-sm text-muted">{semesterLabel} · Personalized timetable</p>
      </div>

      <div className="overflow-x-auto p-4">
        <div className="grid min-w-[720px] gap-3 md:grid-cols-5 lg:grid-cols-6">
          {WEEK_DAYS.map((day) => {
            const slots = byDay[day] ?? [];
            return (
              <div key={day} className="rounded-lg border border-border bg-surface/40">
                <div className="border-b border-border px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">{day}</p>
                </div>
                <ul className="space-y-2 p-2">
                  {slots.length === 0 ? (
                    <li className="px-2 py-6 text-center text-xs text-muted">—</li>
                  ) : (
                    slots.map((slot) => (
                      <li
                        key={slot.id}
                        className="rounded-md border border-border bg-white p-2.5 shadow-sm"
                      >
                        <p className="text-[11px] font-bold text-accent-cyan">
                          {slot.startTime}–{slot.endTime}
                        </p>
                        <p className="mt-1 text-xs font-bold text-primary">{slot.courseCode}</p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                          {slot.courseTitle}
                        </p>
                        <p className="mt-1.5 flex items-start gap-1 text-[10px] text-muted">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                          <span>{slot.venue}</span>
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
