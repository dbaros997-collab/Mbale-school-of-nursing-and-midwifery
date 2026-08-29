"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { statusBarUpdates } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SiteStatusBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const track = [...statusBarUpdates, ...statusBarUpdates];

  return (
    <div
      className={cn(
        "site-status-bar fixed inset-x-0 top-0 z-[70] flex h-[var(--site-status-bar-height)] items-stretch text-white",
        isHome
          ? "site-status-bar--glass border-b border-white/10"
          : "border-b border-white/10 bg-primary shadow-[0_2px_12px_rgba(22,53,127,0.25)]",
      )}
      role="region"
      aria-label="School status"
    >
      <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
        <div className="site-status-marquee flex h-full w-max max-w-none items-center">
          {track.map((item, index) => (
            <span
              key={`${item.id}-${index}`}
              className={cn(
                "inline-flex shrink-0 items-center whitespace-nowrap text-sm font-medium sm:text-base",
                isHome ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]" : "text-white/95",
              )}
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
