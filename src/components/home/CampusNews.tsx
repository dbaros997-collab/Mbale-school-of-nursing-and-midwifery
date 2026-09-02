import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { newsItems } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Bust browser cache when a new build deploys. */
const NEWS_ASSET_VERSION =
  process.env.NEXT_PUBLIC_LOGO_VERSION?.trim() || "news-v1";

function newsImage(path: string) {
  return `${path}?v=${NEWS_ASSET_VERSION}`;
}

export function CampusNews() {
  const stories = newsItems.filter((n) => n.featured).slice(0, 2);

  return (
    <section id="campus-news" className="scroll-mt-24 section-gold py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Campus life"
            title="What happens at campus"
            description="Stories about people, training, opportunities across the MBSNM community"
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
          {stories.map((item, i) => (
            <ScrollReveal key={item.id} direction="right" delay={i * 0.12}>
              <Link
                href="/admissions"
                className="group relative block aspect-[16/11] min-h-[260px] overflow-hidden rounded-3xl focus-ring sm:min-h-[320px]"
              >
                <Image
                  src={newsImage(item.image)}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-4 p-5 sm:p-7 lg:p-8">
                  <div className="min-w-0 pr-2">
                    <time
                      dateTime={item.date}
                      className="text-sm font-medium text-white/90"
                    >
                      {formatDate(item.date)}
                    </time>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[1.65rem]">
                      {item.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="mb-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center text-white transition group-hover:scale-110"
                  >
                    <Plus className="h-7 w-7 stroke-[1.5]" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="mt-8 text-center">
            <Link
              href="/admissions"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View more stories from MBSNM
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
