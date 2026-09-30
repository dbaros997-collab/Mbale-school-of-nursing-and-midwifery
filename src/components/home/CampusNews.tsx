import Link from "next/link";
import { newsItems } from "@/lib/data";
import { EventsSidebar } from "@/components/news/EventsSidebar";
import { NewsStoryList } from "@/components/news/NewsStoryList";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

function sortedNews() {
  return [...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function CampusNews() {
  const stories = sortedNews().slice(0, 5);

  return (
    <section id="campus-news" className="scroll-mt-24 bg-panel py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
              Happening around Campus
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
              Stories about people, training, innovations, and opportunities across the{" "}
              <span className="font-semibold text-foreground">Mbale School of Nursing and Midwifery</span> community.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-12">
          <ScrollReveal direction="left">
            <div>
              <NewsStoryList items={stories} headingLevel="h3" />
              <Link
                href="/news"
                className="mt-6 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                More campus stories
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <EventsSidebar limit={4} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
