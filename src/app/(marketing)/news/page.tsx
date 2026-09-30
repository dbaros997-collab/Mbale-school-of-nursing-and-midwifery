import Link from "next/link";
import { newsItems } from "@/lib/data";
import { marketingPageMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/ui/PageBanner";
import { EventsSidebar } from "@/components/news/EventsSidebar";
import { NewsLeadFeature } from "@/components/news/NewsLeadFeature";
import { NewsStoryList } from "@/components/news/NewsStoryList";
import { Button } from "@/components/ui/Button";

export const metadata = marketingPageMetadata("/news", {
  title: "Campus News",
  description:
    "Happening around campus — stories, announcements, and updates from Mbale School of Nursing and Midwifery.",
});

function sortedNews() {
  return [...newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

type NewsIndexPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewsIndexPage({ searchParams }: NewsIndexPageProps) {
  const { category } = await searchParams;
  const sorted = sortedNews();
  const filtered = category
    ? sorted.filter((item) => item.category.toLowerCase() === category.toLowerCase())
    : sorted;
  const [lead, ...rest] = filtered;
  const categories = [...new Set(sorted.map((item) => item.category))];

  return (
    <div>
      <PageBanner
        breadcrumb="News & Events"
        title="Happening around Campus"
        subtitle="Stories about people, training, innovations, and opportunities across the MBSNM community."
        image="/images/campus-news/graduation-parade-mbale.jpg"
      />

      <section className="section-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {category ? (
            <p className="mb-6 text-sm text-muted">
              Showing stories in{" "}
              <span className="font-semibold text-primary">{category}</span>.{" "}
              <Link href="/news" className="font-semibold text-primary underline-offset-2 hover:underline">
                View all
              </Link>
            </p>
          ) : null}

          {lead && !category ? <NewsLeadFeature item={lead} /> : null}

          <div className={lead && !category ? "mt-12" : "mt-0"}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">
                {category ? `${category} stories` : "More stories"}
              </h2>
              <NewsStoryList
                items={category ? filtered : rest}
                className="mt-4"
                headingLevel="h3"
              />
            </div>

            <div className="space-y-6">
              <EventsSidebar limit={5} />

              <div className="rounded-2xl border border-border bg-panel p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-primary">Browse by topic</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {categories.map((topic) => (
                    <li key={topic}>
                      <Link
                        href={`/news?category=${encodeURIComponent(topic)}`}
                        className={
                          category?.toLowerCase() === topic.toLowerCase()
                            ? "inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                            : "inline-block rounded-md bg-accent-green-soft px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-accent-green/20"
                        }
                      >
                        {topic}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-accent-green/30 bg-accent-green-soft/40 p-5 sm:p-6">
                <p className="font-bold text-primary">Apply for the next intake</p>
                <p className="mt-1 text-sm text-muted">
                  See entry requirements and submit your application online.
                </p>
                <Button href="/admissions#apply" variant="green" size="sm" className="mt-4">
                  Apply now
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
