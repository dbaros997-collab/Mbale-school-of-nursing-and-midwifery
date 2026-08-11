import Link from "next/link";
import { events } from "@/lib/data";

export function UpcomingEvents() {
  return (
    <section id="events" className="scroll-mt-24 bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
            Upcoming Events & Activities
          </h2>
          <Link href="/contact" className="text-sm font-semibold text-primary hover:underline">
            View more upcoming events at our Events Portal
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => {
            const d = new Date(event.date);
            const day = d.getDate();
            const month = d.toLocaleString("en-UG", { month: "short" }).toUpperCase();
            return (
              <article
                key={event.id}
                className="flex gap-4 rounded-xl border border-border bg-white p-4 sm:p-5"
              >
                <div className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                  <span className="text-xs font-bold tracking-wider text-accent-gold">{month}</span>
                  <span className="text-2xl font-extrabold leading-none">{day}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {event.mode}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-primary">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{event.location}</p>
                  <Link
                    href="/admissions"
                    className="mt-2 inline-block text-sm font-semibold text-accent-gold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
