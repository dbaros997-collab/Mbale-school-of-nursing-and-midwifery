"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Department", href: "/academics/nursing" },
  { label: "Programmes", href: "/academics/nursing/programs" },
  { label: "Curriculum", href: "/academics/nursing/curriculum" },
  { label: "Clinical Placements", href: "/academics/nursing/clinical-placements" },
] as const;

export function NursingSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Department of Nursing"
      className="flex flex-wrap gap-2 rounded-2xl content-panel p-2"
    >
      {links.map(({ label, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition focus-ring",
              active
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface hover:text-primary",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
