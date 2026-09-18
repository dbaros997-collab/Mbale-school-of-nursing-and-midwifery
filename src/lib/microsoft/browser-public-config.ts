"use client";

import { getMicrosoftPublicConfig, isMicrosoftClientConfigured } from "./config";
import type { MicrosoftClientConfigPayload } from "./client-config-response";

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

/** Primary path avoids "microsoft" — Brave/Shields often block those fetch URLs. */
const CLIENT_CONFIG_PATHS = ["/api/portal/entra-config", "/api/auth/microsoft/client-config"] as const;

const NOT_CONFIGURED_MESSAGE =
  "Microsoft 365 sign-in is not configured. Add Azure AD environment variables to enable SSO.";

const REACHABILITY_MESSAGE =
  "Unable to load Microsoft sign-in settings. Check your connection, allow this site in your browser shields, then try again.";

let cachedConfig: Promise<MicrosoftBrowserPublicConfig> | null = null;

function payloadToBrowserConfig(
  payload: MicrosoftClientConfigPayload,
): MicrosoftBrowserPublicConfig | null {
  if (!payload.configured || !payload.clientId || !payload.tenantId) {
    return null;
  }
  return {
    clientId: payload.clientId,
    tenantId: payload.tenantId,
    authority: payload.authority,
    redirectUri: payload.redirectUri,
    scopes: payload.scopes,
  };
}

async function tryFetchClientConfig(path: string): Promise<{
  payload: MicrosoftClientConfigPayload | null;
  reachable: boolean;
}> {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      return { payload: null, reachable: true };
    }
    const payload = (await response.json()) as MicrosoftClientConfigPayload;
    return { payload, reachable: true };
  } catch {
    return { payload: null, reachable: false };
  }
}

async function fetchClientConfigFromServer(): Promise<{
  config: MicrosoftBrowserPublicConfig | null;
  anyReachable: boolean;
}> {
  let anyReachable = false;

  for (const path of CLIENT_CONFIG_PATHS) {
    const { payload, reachable } = await tryFetchClientConfig(path);
    if (reachable) anyReachable = true;
    if (!payload) continue;
    const config = payloadToBrowserConfig(payload);
    if (config) return { config, anyReachable: true };
  }

  return { config: null, anyReachable };
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
    const { config: fromServer, anyReachable } = await fetchClientConfigFromServer();
    if (fromServer) return fromServer;

    const baked = loadFromBakedEnv();
    if (baked) return baked;

    cachedConfig = null;
    throw new Error(anyReachable ? NOT_CONFIGURED_MESSAGE : REACHABILITY_MESSAGE);
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
