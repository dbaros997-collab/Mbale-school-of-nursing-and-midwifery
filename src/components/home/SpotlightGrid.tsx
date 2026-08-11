import Image from "next/image";
import Link from "next/link";
import { spotlightArticles } from "@/lib/data";

export function SpotlightGrid() {
  return (
    <section id="spotlight" className="scroll-mt-24 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Campus & Clinical Excellence
            </h2>
            <p className="mt-2 text-muted">
              Articles about training, facilities & community impact at MBSNM |{" "}
              <Link href="/academics" className="font-semibold text-primary hover:underline">
                More articles
              </Link>
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spotlightArticles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold uppercase tracking-wide text-accent-gold">
                  {article.category}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-primary">
                  <Link href={article.href} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>
                <Link
                  href={article.href}
                  className="mt-3 inline-block text-sm font-semibold text-primary/80 hover:text-accent-gold"
                >
                  Continue Reading
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
