import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { events } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function eventParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: d.toLocaleString("en-UG", { month: "short" }),
  };
}

const dateBadgeColors = [
  "bg-primary group-hover:bg-brand-green",
  "bg-brand-green group-hover:bg-brand-sky",
  "bg-brand-sky text-primary group-hover:bg-brand-yellow group-hover:text-primary",
] as const;

function DateBadge({
  iso,
  className = "",
  colorIndex = 0,
}: {
  iso: string;
  className?: string;
  colorIndex?: number;
}) {
  const { day, month } = eventParts(iso);
  const colorClass = dateBadgeColors[colorIndex % dateBadgeColors.length];
  return (
    <div
      className={`flex h-[90px] w-[90px] shrink-0 flex-col items-center justify-center rounded-2xl text-white transition-colors duration-300 ${colorClass} ${className}`}
    >
      <span className="text-5xl font-semibold leading-none">{day}</span>
      <span className="mt-0.5 text-sm font-medium uppercase tracking-wide">{month}</span>
    </div>
  );
}

export function UpcomingEvents() {
  const [lead, ...rest] = events;

  return (
    <section id="events" className="scroll-mt-24 section-sky py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Calendar"
            title="Upcoming Events & Activities"
            description={
              <>
                View more upcoming events at our{" "}
                <Link href="/contact" className="font-semibold text-primary underline-offset-2 hover:underline">
                  Events Portal
                </Link>
              </>
            }
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          <ScrollReveal direction="left">
            <article className="group overflow-hidden rounded-3xl border border-border bg-panel shadow-sm">
              <div className="grid md:grid-cols-2 md:min-h-[420px] lg:min-h-[480px]">
                <Link
                  href="/admissions"
                  className="relative min-h-[240px] overflow-hidden md:min-h-full"
                  aria-label={`Open ${lead.title}`}
                >
                  <Image
                    src={lead.image}
                    alt="MBSNM staff team in front of the campus building"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <span className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-panel text-foreground shadow-md transition group-hover:bg-accent-green group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" aria-hidden />
                  </span>
                </Link>

                <div className="flex flex-col bg-brand-yellow-soft p-8 sm:p-10 md:min-h-full md:justify-center">
                  <DateBadge iso={lead.date} colorIndex={0} />
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-muted">
                    {lead.mode}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-foreground sm:text-[2rem]">
                    <Link href="/admissions" className="transition hover:text-primary">
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-muted">{lead.location}</p>
                  <Link
                    href="/admissions"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
                  >
                    View Details
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>

          <div className="flex flex-col justify-center gap-5 sm:gap-6">
            {rest.map((event, i) => (
              <ScrollReveal key={event.id} direction="right" delay={i * 0.1}>
                <article className="group grid grid-cols-[90px_1fr] items-start gap-4 sm:gap-5">
                  <DateBadge iso={event.date} colorIndex={i + 1} />
                  <div className="min-w-0 pt-1">
                    <p className="text-sm font-medium uppercase tracking-[0.08em] text-muted">
                      {event.mode}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
                      <Link href="/admissions" className="transition hover:text-primary">
                        {event.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-muted">{event.location}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
