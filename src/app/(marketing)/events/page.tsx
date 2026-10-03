import Image from "next/image";
import Link from "next/link";
import { eventHref } from "@/lib/data";
import { getSiteEvents } from "@/lib/site-content/queries";
import { formatDisplayDate } from "@/lib/format-display-date";
import { marketingPageMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = marketingPageMetadata("/events", {
  title: "Events",
  description:
    "Upcoming orientations, open days, admissions sessions, and community events at Mbale School of Nursing and Midwifery.",
});

export default async function EventsIndexPage() {
  const sorted = await getSiteEvents();

  return (
    <div>
      <PageBanner
        breadcrumb="Events"
        title="Events & activities"
        subtitle="Orientations, open days, admissions briefings, and community outreach on campus and online."
        image="/images/events-staff.jpg"
      />

      <section className="section-sky py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Calendar"
            title="Upcoming events"
            description="Tap an event for location, format, and details."
            align="center"
          />

          <ul className="mt-10 space-y-5">
            {sorted.map((event) => (
              <li key={event.id}>
                <Link
                  href={eventHref(event.id)}
                  className="group grid overflow-hidden rounded-2xl border border-border bg-panel shadow-sm transition hover:border-primary/30 hover:shadow-md focus-ring sm:grid-cols-[200px_1fr]"
                >
                  <div className="relative min-h-[140px] sm:min-h-full">
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      sizes="200px"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">
                      {event.mode} · {formatDisplayDate(event.date)}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-foreground group-hover:text-primary">
                      {event.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{event.location}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                      {event.description}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-primary">View details →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-sm text-muted">
            Questions about an event?{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact the registry office
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
