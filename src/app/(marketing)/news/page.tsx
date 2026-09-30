import Image from "next/image";
import Link from "next/link";
import { newsHref, newsItems } from "@/lib/data";
import { formatDisplayDate } from "@/lib/format-display-date";
import { marketingPageMetadata } from "@/lib/seo";
import { PageBanner } from "@/components/ui/PageBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = marketingPageMetadata("/news", {
  title: "Campus News",
  description:
    "Stories, announcements, and updates from Mbale School of Nursing and Midwifery — admissions, graduations, and campus life.",
});

export default function NewsIndexPage() {
  const sorted = [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div>
      <PageBanner
        breadcrumb="Campus News"
        title="News & stories"
        subtitle="Admissions updates, graduations, clinical training, and campus improvements from MBSNM."
        image="/images/campus-news/graduation-parade-mbale.jpg"
      />

      <section className="section-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Latest"
            title="All campus news"
            description="Select a story to read the full update."
          />

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((item) => (
              <li key={item.id}>
                <Link
                  href={newsHref(item.id)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-panel shadow-sm transition hover:border-primary/30 hover:shadow-md focus-ring"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-accent-green-soft px-2 py-0.5 font-semibold text-primary">
                        {item.category}
                      </span>
                      <time dateTime={item.date} className="text-muted">
                        {formatDisplayDate(item.date)}
                      </time>
                    </div>
                    <h2 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                      {item.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-primary">Read story →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
