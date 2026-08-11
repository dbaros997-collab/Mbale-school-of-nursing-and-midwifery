import { Clock } from "lucide-react";
import type { DeadlineItem } from "@/lib/portal/schema";
import { SubmissionStatusBadge } from "@/components/portal/StatusBadge";

function formatDue(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function DeadlineList({ items }: { items: DeadlineItem[] }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
          Upcoming deadlines
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No upcoming assignments.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {item.courseCode} · {formatDue(item.dueAt)}
                </p>
                <p className="mt-1 text-xs font-medium text-primary">{daysLeft(item.dueAt)}</p>
              </div>
              <SubmissionStatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
