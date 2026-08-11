import Link from "next/link";
import { Megaphone } from "lucide-react";
import type { Announcement } from "@/lib/portal/schema";

export function AnnouncementTicker({ items }: { items: Announcement[] }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Notice board
          </h2>
        </div>
        <Link
          href="/portal/notices"
          className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
        >
          View all
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
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
    </div>
  );
}
