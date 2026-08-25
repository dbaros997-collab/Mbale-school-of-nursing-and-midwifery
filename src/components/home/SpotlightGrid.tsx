import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { spotlightArticles } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SpotlightGrid() {
  const stories = spotlightArticles.slice(0, 2);

  return (
    <section id="spotlight" className="scroll-mt-24 section-green py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Excellence"
            title="Campus & Clinical Excellence"
            description="Articles about training, facilities & community impact at MBSNM"
            align="center"
          />
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2">
          {stories.map((article, i) => (
            <ScrollReveal key={article.id} direction="right" delay={i * 0.12}>
              <Link
                href={article.href}
                className="group relative block aspect-[16/11] min-h-[260px] overflow-hidden rounded-3xl focus-ring sm:min-h-[320px]"
              >
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-4 p-5 sm:p-7 lg:p-8">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium uppercase tracking-wide text-white/90">
                      {article.category}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white sm:text-2xl lg:text-[1.65rem]">
                      {article.title}
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
              href="/academics"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              More articles
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
