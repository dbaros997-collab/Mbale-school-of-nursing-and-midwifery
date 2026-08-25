"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { MicrosoftSignInButton } from "@/components/microsoft/MicrosoftSignInButton";
import { cn } from "@/lib/utils";

type HeaderPortalActionsProps = {
  /** Glass-style header on the homepage hero */
  glassHome?: boolean;
  /** Stack vertically inside mega-menu featured panels */
  layout?: "inline" | "stacked";
  onNavigate?: () => void;
};

export function HeaderPortalActions({
  glassHome = false,
  layout = "inline",
  onNavigate,
}: HeaderPortalActionsProps) {
  const portalLinkClass = cn(
    "btn-pill inline-flex items-center justify-center gap-1.5 rounded-full border font-bold transition focus-ring",
    layout === "stacked" ? "w-full px-4 py-2.5 text-sm" : "px-3 py-2 text-xs lg:px-4 lg:text-sm",
    glassHome || layout === "stacked"
      ? "border-white/70 bg-white/10 text-white hover:bg-white/20"
      : "border-white/50 bg-white/10 text-white hover:bg-white/20",
  );

  function handleMicrosoftError() {
    window.location.assign("/portal");
  }

  return (
    <div
      className={cn(
        layout === "stacked"
          ? "relative mt-5 flex flex-col gap-2.5"
          : "ml-2 flex shrink-0 items-center gap-2 lg:ml-3 lg:gap-2.5",
      )}
    >
      <Link href="/portal" className={portalLinkClass} onClick={onNavigate}>
        <LogIn className="h-4 w-4 shrink-0" aria-hidden />
        Student Portal
      </Link>
      <MicrosoftSignInButton
        surface="header"
        size="compact"
        className={layout === "stacked" ? "w-full" : "shrink-0 whitespace-nowrap"}
        onError={handleMicrosoftError}
      />
    </div>
  );
}
