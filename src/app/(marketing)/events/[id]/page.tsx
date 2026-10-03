import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { eventHref } from "@/lib/data";
import { getSiteEventById, getSiteEvents } from "@/lib/site-content/queries";
import { formatDisplayDate } from "@/lib/format-display-date";
import { marketingPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const events = await getSiteEvents();
  return events.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = await getSiteEventById(id);
  if (!item) {
    return marketingPageMetadata(`/events/${id}`, { title: "Event not found" });
  }
  return marketingPageMetadata(eventHref(id), {
    title: item.title,
    description: item.description,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getSiteEventById(id);
  if (!event) notFound();

  const isAdmissionsRelated =
    event.title.toLowerCase().includes("admissions") ||
    event.title.toLowerCase().includes("orientation") ||
    event.title.toLowerCase().includes("intake");

  return (
    <div>
      <PageBanner
        breadcrumb="Events"
        title={event.title}
        subtitle={formatDisplayDate(event.date)}
        image={event.image}
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
            <Image
              src={event.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <ul className="space-y-3 rounded-2xl border border-border bg-panel p-5 text-sm">
            <li className="flex gap-3">
              <CalendarDays className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-bold text-foreground">Date</p>
                <p className="text-muted">{formatDisplayDate(event.date)}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-bold text-foreground">Location</p>
                <p className="text-muted">{event.location}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-green-soft text-xs font-bold text-primary">
                •
              </span>
              <div>
                <p className="font-bold text-foreground">Format</p>
                <p className="text-muted">{event.mode}</p>
              </div>
            </li>
          </ul>

          <p className="mt-8 text-base leading-relaxed text-muted">{event.description}</p>

          {isAdmissionsRelated ? (
            <div className="mt-10 rounded-2xl border border-accent-green/30 bg-accent-green-soft/40 p-6">
              <p className="font-bold text-primary">Applying to Mbale School of Nursing and Midwifery?</p>
              <p className="mt-1 text-sm text-muted">
                Review entry requirements and submit your application before orientation week.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/admissions#apply" variant="green">
                  Apply online
                </Button>
                <Button href="/admissions" variant="ghost">
                  Admissions info
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
            <Button href="/events" variant="ghost">
              ← All events
            </Button>
            <Button href="/contact" variant="ghost">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
