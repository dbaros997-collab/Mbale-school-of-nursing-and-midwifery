"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackToWebsiteProps = {
  variant?: "topbar" | "topbar-dark" | "sidebar" | "page";
  onClick?: () => void;
};

export function BackToWebsite({ variant = "topbar", onClick }: BackToWebsiteProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Back to website"
      className={cn(
        "inline-flex items-center gap-2 font-semibold transition focus-ring",
        variant === "topbar" &&
          "relative z-[61] shrink-0 rounded-md border border-border bg-white px-3 py-2 text-sm text-primary hover:bg-surface",
        variant === "topbar-dark" &&
          "btn-pill relative z-[61] shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20",
        variant === "sidebar" &&
          "w-full rounded-lg px-3 py-2.5 text-sm text-white/85 hover:bg-white/10",
        variant === "page" &&
          "rounded-md px-1 py-1 text-sm text-primary hover:underline",
      )}
    >
      <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
      <span className={cn((variant === "topbar" || variant === "topbar-dark") && "hidden sm:inline")}>
        Back to website
      </span>
      {variant === "topbar" || variant === "topbar-dark" ? (
        <span className="sm:hidden">Website</span>
      ) : null}
    </Link>
  );
}
