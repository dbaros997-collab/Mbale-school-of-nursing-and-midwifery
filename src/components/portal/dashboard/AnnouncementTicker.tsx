import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { Announcement } from "@/lib/portal/schema";
import { DataCard } from "@/components/ui/DataCard";

export function AnnouncementTicker({ items }: { items: Announcement[] }) {
  return (
    <DataCard
      title={
        <span className="flex w-full items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2">
            <Megaphone className="h-4 w-4" aria-hidden />
            Notice board
          </span>
          <Link
            href="/portal/notices"
            className="text-xs font-semibold text-brand-sky underline-offset-2 hover:underline"
          >
            View all
          </Link>
        </span>
      }
    >
      <ul className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border bg-surface/50 px-3 py-3"
          >
            <p className="text-sm font-bold text-primary">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted">
              {new Date(item.publishedAt).toLocaleDateString("en-UG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </li>
        ))}
      </ul>
    </DataCard>
  );
}
