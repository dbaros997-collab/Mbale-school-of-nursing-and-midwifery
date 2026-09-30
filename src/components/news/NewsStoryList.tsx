import Link from "next/link";
import { newsHref, type NewsItem } from "@/lib/data";
import { formatMakNewsDate } from "@/lib/format-display-date";
import { cn } from "@/lib/utils";

type NewsStoryListProps = {
  items: readonly NewsItem[];
  className?: string;
  headingLevel?: "h2" | "h3";
};

export function NewsStoryList({ items, className, headingLevel = "h3" }: NewsStoryListProps) {
  const TitleTag = headingLevel;

  return (
    <ul className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <li key={item.id} className="py-5 first:pt-0 last:pb-0">
          <time dateTime={item.date} className="text-sm font-medium text-muted">
            {formatMakNewsDate(item.date)}
          </time>
          <TitleTag className="mt-1.5 font-display text-xl font-semibold leading-snug text-foreground sm:text-[1.35rem]">
            <Link href={newsHref(item.id)} className="transition hover:text-primary hover:underline">
              {item.title}
            </Link>
          </TitleTag>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}
