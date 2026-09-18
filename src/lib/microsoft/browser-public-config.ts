"use client";

import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "./config";

export type MicrosoftBrowserPublicConfig = {
  clientId: string;
  tenantId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
};

let cachedConfig: Promise<MicrosoftBrowserPublicConfig> | null = null;

/** MSAL settings: use build-time env when present, otherwise fetch from the server at runtime. */
export function loadMicrosoftBrowserPublicConfig(): Promise<MicrosoftBrowserPublicConfig> {
  if (cachedConfig) return cachedConfig;

  if (isMicrosoftClientConfigured()) {
    const baked = getMicrosoftPublicConfig();
    cachedConfig = Promise.resolve({
      clientId: baked.clientId,
      tenantId: baked.tenantId,
      authority: baked.authority,
      redirectUri: baked.redirectUri,
      scopes: [...baked.scopes],
    });
    return cachedConfig;
  }

  cachedConfig = fetch("/api/auth/microsoft/client-config", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Unable to load Microsoft sign-in settings.");
      }
      const payload = (await response.json()) as MicrosoftBrowserPublicConfig & {
        configured: boolean;
      };
      if (!payload.configured || !payload.clientId || !payload.tenantId) {
        throw new Error(
          "Microsoft 365 sign-in is not configured. Add Azure AD environment variables to enable SSO.",
        );
      }
      return {
        clientId: payload.clientId,
        tenantId: payload.tenantId,
        authority: payload.authority,
        redirectUri: payload.redirectUri,
        scopes: payload.scopes,
      };
    })
    .catch((err) => {
      cachedConfig = null;
      throw err;
    });

  return cachedConfig;
}

export function isMicrosoftBrowserPublicConfigReady(): boolean {
  return isMicrosoftClientConfigured();
}
