import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsById, newsHref, newsItems, SCHOOL } from "@/lib/data";
import { formatDisplayDate } from "@/lib/format-display-date";
import { marketingPageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = getNewsById(id);
  if (!item) {
    return marketingPageMetadata(`/news/${id}`, {
      title: "Story not found",
    });
  }
  return marketingPageMetadata(newsHref(id), {
    title: item.title,
    description: item.excerpt,
  });
}

export default async function NewsStoryPage({ params }: PageProps) {
  const { id } = await params;
  const item = getNewsById(id);
  if (!item) notFound();

  return (
    <div>
      <PageBanner
        breadcrumb="Campus News"
        title={item.title}
        subtitle={`${item.category} · ${formatDisplayDate(item.date)}`}
        image={item.image}
      />

      <article className="section-surface py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <div className="prose prose-neutral max-w-none">
            {item.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          {item.category === "Admissions" ? (
            <div className="mt-10 rounded-2xl border border-accent-green/30 bg-accent-green-soft/40 p-6">
              <p className="font-bold text-primary">Ready to apply?</p>
              <p className="mt-1 text-sm text-muted">
                Start your application for the {SCHOOL.shortName} nursing or midwifery programme online.
              </p>
              <Button href="/admissions#apply" variant="green" className="mt-4">
                Apply now
              </Button>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
            <Button href="/news" variant="ghost">
              ← All campus news
            </Button>
            <Button href="/contact" variant="ghost">
              Contact us
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
