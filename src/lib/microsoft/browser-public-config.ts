"use client";

import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "./config";

export type MicrosoftBrowserPublicConfig = {
  clientId: string;
  tenantId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
};

export type MicrosoftClientConfigResponse = MicrosoftBrowserPublicConfig & {
  configured: boolean;
};

let cachedConfig: Promise<MicrosoftBrowserPublicConfig> | null = null;

async function fetchClientConfigFromServer(): Promise<MicrosoftBrowserPublicConfig> {
  const response = await fetch("/api/auth/microsoft/client-config", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load Microsoft sign-in settings.");
  }
  const payload = (await response.json()) as MicrosoftClientConfigResponse;
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
}

function loadFromBakedEnv(): MicrosoftBrowserPublicConfig | null {
  if (!isMicrosoftClientConfigured()) return null;
  const baked = getMicrosoftPublicConfig();
  if (!baked.clientId || !baked.tenantId) return null;
  return {
    clientId: baked.clientId,
    tenantId: baked.tenantId,
    authority: baked.authority,
    redirectUri: baked.redirectUri,
    scopes: [...baked.scopes],
  };
}

/** MSAL settings: server runtime env first, then build-time NEXT_PUBLIC_* in the bundle. */
export function loadMicrosoftBrowserPublicConfig(): Promise<MicrosoftBrowserPublicConfig> {
  if (cachedConfig) return cachedConfig;

  cachedConfig = (async () => {
    try {
      return await fetchClientConfigFromServer();
    } catch (err) {
      const baked = loadFromBakedEnv();
      if (baked) return baked;
      cachedConfig = null;
      throw err;
    }
  })();

  return cachedConfig;
}

/** Probe whether sign-in can start (uses the same client-config API as MSAL). */
export async function probeMicrosoftClientConfigured(): Promise<boolean> {
  try {
    await loadMicrosoftBrowserPublicConfig();
    return true;
  } catch {
    return false;
  }
}

export function isMicrosoftBrowserPublicConfigReady(): boolean {
  return isMicrosoftClientConfigured();
}
