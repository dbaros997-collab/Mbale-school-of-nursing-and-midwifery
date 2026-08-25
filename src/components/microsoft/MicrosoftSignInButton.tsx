"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  /** Compact label for header/toolbar placement */
  size?: "default" | "compact";
};

export function MicrosoftSignInButton({
  onError,
  className,
  size = "default",
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
  const label = compact ? "Microsoft 365" : "Sign in with Microsoft School Account";

  return (
    <Button
      type="button"
      variant="navy"
      size={compact ? "sm" : "md"}
      className={className}
      disabled={busy}
      onClick={() => void handleClick()}
      ariaLabel="Sign in with Microsoft School Account"
    >
      {busy ? (
        <Loader2 className={compact ? "h-4 w-4 animate-spin" : "h-5 w-5 animate-spin"} aria-hidden />
      ) : (
        <MicrosoftLogo className={compact ? "h-4 w-4" : "h-5 w-5"} />
      )}
      {label}
    </Button>
  );
}
