import type { GraphCalendarEvent } from "@/lib/microsoft/types";

function formatEventRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  const dateFmt = startDate.toLocaleDateString("en-UG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeFmt = (d: Date) =>
    d.toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit" });

  if (sameDay) {
    return `${dateFmt} · ${timeFmt(startDate)} – ${timeFmt(endDate)}`;
  }
  return `${startDate.toLocaleString("en-UG")} – ${endDate.toLocaleString("en-UG")}`;
}

type MicrosoftCalendarEventsProps = {
  events: GraphCalendarEvent[];
};

export function MicrosoftCalendarEvents({ events }: MicrosoftCalendarEventsProps) {
  if (events.length === 0) {
    return (
      <p className="px-5 py-8 text-sm text-muted">
        No upcoming calendar events in the next two weeks. Check back later or view your full
        Outlook calendar.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <li key={event.id} className="px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-bold text-primary">{event.subject}</p>
              <p className="mt-1 text-xs text-muted">{formatEventRange(event.start, event.end)}</p>
              {event.location ? (
                <p className="mt-1 text-xs text-muted">📍 {event.location}</p>
              ) : null}
              {event.organizer ? (
                <p className="mt-1 text-xs text-muted">Organiser: {event.organizer}</p>
              ) : null}
            </div>
            {event.webLink ? (
              <a
                href={event.webLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:underline focus-ring"
              >
                Open in Outlook
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
