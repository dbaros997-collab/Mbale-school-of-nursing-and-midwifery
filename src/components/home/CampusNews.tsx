import Image from "next/image";
import Link from "next/link";
import { newsItems } from "@/lib/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CampusNews() {
  const featured = newsItems.filter((n) => n.featured).slice(0, 2);
  const side = newsItems.filter((n) => !n.featured).slice(0, 3);

  return (
    <section id="campus-news" className="scroll-mt-24 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Happening around Campus
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Stories about people, training, opportunities across the MBSNM community
            </p>
          </div>
          <Link
            href="/admissions"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View more stories from MBSNM
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-8">
            {featured.map((item) => (
              <article key={item.id} className="grid gap-4 sm:grid-cols-[220px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg sm:aspect-auto sm:min-h-[150px]">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="220px" />
                </div>
                <div>
                  <time dateTime={item.date} className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {formatDate(item.date)}
                  </time>
                  <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-primary">
                    <Link href="/admissions" className="hover:text-primary-light">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-5 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            {side.map((item) => (
              <article key={item.id} className="border-b border-border pb-5 last:border-0">
                <span className="text-xs font-bold uppercase tracking-wide text-accent-gold">
                  {item.category}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-primary">
                  <Link href="/academics" className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <Link
                  href="/academics"
                  className="mt-2 inline-block text-sm font-semibold text-primary/80 hover:text-accent-gold"
                >
                  Continue Reading
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
