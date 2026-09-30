import Image from "next/image";
import Link from "next/link";
import { newsHref, type NewsItem } from "@/lib/data";
import { formatMakNewsDate } from "@/lib/format-display-date";

type NewsLeadFeatureProps = {
  item: NewsItem;
};

export function NewsLeadFeature({ item }: NewsLeadFeatureProps) {
  return (
    <Link
      href={newsHref(item.id)}
      className="group relative block min-h-[280px] overflow-hidden rounded-2xl focus-ring sm:min-h-[360px] lg:min-h-[420px]"
    >
      <Image
        src={item.image}
        alt=""
        fill
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 1280px"
        priority
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-yellow">{item.category}</p>
        <time dateTime={item.date} className="mt-2 block text-sm text-white/90">
          {formatMakNewsDate(item.date)}
        </time>
        <h2 className="mt-2 max-w-4xl font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
          {item.title}
        </h2>
        <p className="mt-3 max-w-3xl line-clamp-2 text-sm leading-relaxed text-white/85 sm:text-base">
          {item.excerpt}
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-brand-sky group-hover:underline">
          Read full story
        </span>
      </div>
    </Link>
  );
}
