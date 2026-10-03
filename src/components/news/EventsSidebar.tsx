import Link from "next/link";
import { eventHref } from "@/lib/data";
import { getSiteEvents } from "@/lib/site-content/queries";
import { cn } from "@/lib/utils";

function eventDayParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleString("en-GB", { day: "2-digit" }),
    month: d.toLocaleString("en-GB", { month: "short" }),
  };
}

type EventsSidebarProps = {
  limit?: number;
  title?: string;
  className?: string;
  showFooterLink?: boolean;
};

export async function EventsSidebar({
  limit = 4,
  title = "Upcoming Events & Activities",
  className,
  showFooterLink = true,
}: EventsSidebarProps) {
  const upcoming = (await getSiteEvents()).slice(0, limit);

  return (
    <aside className={cn("rounded-2xl border border-border bg-panel p-5 sm:p-6", className)}>
      <h3 className="font-display text-lg font-bold text-primary sm:text-xl">{title}</h3>
      <ul className="mt-4 space-y-4">
        {upcoming.map((event) => {
          const { day, month } = eventDayParts(event.date);
          return (
            <li key={event.id} className="flex gap-3 border-b border-border/80 pb-4 last:border-0 last:pb-0">
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-primary text-white"
                aria-hidden
              >
                <span className="text-lg font-bold leading-none">{day}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide">{month}</span>
              </div>
              <div className="min-w-0 pt-0.5">
                <h4 className="text-sm font-bold leading-snug text-foreground sm:text-base">
                  <Link href={eventHref(event.id)} className="hover:text-primary hover:underline">
                    {event.title}
                  </Link>
                </h4>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">
                  {event.location}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {showFooterLink ? (
        <Link
          href="/events"
          className="mt-5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          View all events
        </Link>
      ) : null}
    </aside>
  );
}
