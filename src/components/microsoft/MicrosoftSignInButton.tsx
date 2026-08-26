"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { isMicrosoftClientConfigured } from "@/lib/microsoft/config";
import { loginWithMicrosoftRedirect } from "@/lib/microsoft/msal-browser";

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

type MicrosoftSignInButtonProps = {
  onError?: (message: string) => void;
  className?: string;
  /** Override button label */
  label?: string;
  /** Compact label for header/toolbar placement */
  size?: "default" | "compact" | "lg";
  /** Light = navy pill; header = white on dark nav; portal = Microsoft-style on login card */
  surface?: "light" | "header" | "portal";
};

export function MicrosoftSignInButton({
  onError,
  className,
  label: labelOverride,
  size = "default",
  surface = "light",
}: MicrosoftSignInButtonProps) {
  const [busy, setBusy] = useState(false);
  const configured = isMicrosoftClientConfigured();

  async function handleClick() {
    if (!configured) {
      onError?.(
        "Microsoft 365 sign-in is not configured. Add Azure AD environment variables to enable SSO.",
      );
      return;
    }

    setBusy(true);
    try {
      await loginWithMicrosoftRedirect();
    } catch (err) {
      setBusy(false);
      onError?.(
        err instanceof Error
          ? err.message
          : "Microsoft sign-in could not start. Check your connection and try again.",
      );
    }
  }

  const compact = size === "compact";
  const large = size === "lg";
  const defaultLabel = compact
    ? "Microsoft 365"
    : surface === "portal"
      ? "Sign in with Microsoft 365"
      : "Sign in with Microsoft School Account";
  const label = labelOverride ?? defaultLabel;
  const onDarkSurface = surface === "header";
  const portalSurface = surface === "portal";

  return (
    <Button
      type="button"
      variant={onDarkSurface || portalSurface ? "ghost" : "navy"}
      size={compact ? "sm" : large ? "lg" : "md"}
      className={cn(
        onDarkSurface &&
          "border border-white/75 bg-white text-primary shadow-sm hover:border-white hover:bg-brand-sky-soft",
        portalSurface &&
          "border border-[#8c8c8c] bg-white text-[#5e5e5e] shadow-sm hover:border-[#8c8c8c] hover:bg-[#f3f3f3]",
        className,
      )}
      disabled={busy}
      onClick={() => void handleClick()}
      ariaLabel="Sign in with Microsoft 365"
    >
      {busy ? (
        <Loader2
          className={compact ? "h-4 w-4 animate-spin" : large ? "h-5 w-5 animate-spin" : "h-5 w-5 animate-spin"}
          aria-hidden
        />
      ) : (
        <MicrosoftLogo className={compact ? "h-4 w-4" : large ? "h-5 w-5" : "h-5 w-5"} />
      )}
      {label}
    </Button>
  );
}
