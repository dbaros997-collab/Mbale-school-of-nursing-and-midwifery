"use client";

import Link from "next/link";
import { statusBarUpdates } from "@/lib/data";

export function SiteStatusBar() {
  const track = [...statusBarUpdates, ...statusBarUpdates];

  return (
    <div
      className="site-status-bar fixed inset-x-0 top-0 z-[70] flex h-[var(--site-status-bar-height)] items-stretch border-b border-white/10 bg-primary text-white shadow-[0_2px_12px_rgba(22,53,127,0.25)]"
      role="region"
      aria-label="School status"
    >
      <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
        <div className="site-status-marquee flex h-full w-max max-w-none items-center">
          {track.map((item, index) => (
            <span
              key={`${item.id}-${index}`}
              className="inline-flex shrink-0 items-center whitespace-nowrap text-sm font-medium text-white/95 sm:text-base"
            >
              <Link
                href={item.href}
                className="rounded-sm px-0.5 transition hover:text-brand-yellow focus-ring"
              >
                {item.text}
              </Link>
              <span className="mx-5 text-brand-yellow/90" aria-hidden>
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
