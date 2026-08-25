"use client";

import { acquireMicrosoftTokenSilent } from "@/lib/microsoft/msal-browser";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";

/** Sync a fresh MSAL access token to the server session (SPA tokens are refreshed in-browser). */
export async function syncMicrosoftAccessTokenToServer(): Promise<boolean> {
  const result = await acquireMicrosoftTokenSilent();
  if (!result?.accessToken) return false;

  const response = await fetchWithTimeout("/api/auth/microsoft/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: result.accessToken,
      expiresIn: result.expiresOn
        ? Math.max(60, Math.floor((result.expiresOn.getTime() - Date.now()) / 1000))
        : 3600,
    }),
    timeoutMs: 10_000,
  });

  return response.ok;
}

export async function refreshMicrosoftTokenIfNeeded() {
  const sessionRes = await fetchWithTimeout("/api/auth/microsoft/session", {
    cache: "no-store",
    timeoutMs: 8_000,
  });
  if (!sessionRes.ok) return;

  const session = (await sessionRes.json()) as { authenticated: boolean; expiresAt?: number };
  if (!session.authenticated) return;

  const expiresAt = session.expiresAt ?? 0;
  const needsRefresh = Date.now() >= expiresAt - 60_000;
  if (!needsRefresh) return;

  await syncMicrosoftAccessTokenToServer();
}
