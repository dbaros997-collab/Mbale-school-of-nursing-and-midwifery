"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { handleMicrosoftRedirectCallback } from "@/lib/microsoft/msal-browser";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";
import { mapMicrosoftProfileToPortalSession } from "@/lib/microsoft/portal-bridge";
import type { MicrosoftUserProfile } from "@/lib/microsoft/types";

export function MicrosoftAuthCallbackHandler() {
  const router = useRouter();
  const { applyMicrosoftSession } = useAuth();
  const [message, setMessage] = useState("Completing Microsoft sign-in…");

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      try {
        const result = await handleMicrosoftRedirectCallback();
        if (!result?.idToken || !result.accessToken) {
          if (!cancelled) {
            setMessage("No Microsoft account was returned. Redirecting to sign-in…");
            setTimeout(() => router.replace("/portal"), 2000);
          }
          return;
        }

        const response = await fetchWithTimeout("/api/auth/microsoft/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: result.idToken,
            accessToken: result.accessToken,
            expiresIn: result.expiresOn
              ? Math.max(60, Math.floor((result.expiresOn.getTime() - Date.now()) / 1000))
              : 3600,
          }),
          timeoutMs: 15_000,
        });

        const payload = (await response.json()) as {
          ok: boolean;
          message: string;
          profile?: MicrosoftUserProfile;
        };

        if (!response.ok || !payload.ok || !payload.profile) {
          throw new Error(payload.message || "Microsoft sign-in failed.");
        }

        const portalSession = mapMicrosoftProfileToPortalSession(payload.profile);
        applyMicrosoftSession({
          ...portalSession,
          microsoftProfile: payload.profile,
        });

        if (!cancelled) {
          router.replace("/portal/dashboard");
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(
            err instanceof Error
              ? err.message
              : "Microsoft sign-in could not be completed. Try again.",
          );
          setTimeout(() => router.replace("/portal"), 4000);
        }
      }
    }

    void completeSignIn();
    return () => {
      cancelled = true;
    };
  }, [applyMicrosoftSession, router]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-surface px-4 py-16 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <p className="mt-4 max-w-md text-sm text-muted" role="status">
        {message}
      </p>
    </div>
  );
}
