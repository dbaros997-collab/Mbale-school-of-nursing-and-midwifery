"use client";

import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { MICROSOFT_SCOPES } from "./config";
import { loadMicrosoftBrowserPublicConfig } from "./browser-public-config";
import {
  MICROSOFT_POST_LOGOUT_PATH,
  MICROSOFT_PRODUCTION_POST_LOGOUT_URL,
} from "./env-vars";

let msalInstance: PublicClientApplication | null = null;
let initPromise: Promise<void> | null = null;
let msalConfigKey = "";

async function buildMsalConfig() {
  const { clientId, authority, redirectUri } = await loadMicrosoftBrowserPublicConfig();
  return {
    auth: {
      clientId,
      authority,
      redirectUri,
      postLogoutRedirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}${MICROSOFT_POST_LOGOUT_PATH}`
          : MICROSOFT_PRODUCTION_POST_LOGOUT_URL,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: "sessionStorage" as const,
      storeAuthStateInCookie: false,
    },
  };
}

export async function getMsalInstance(): Promise<PublicClientApplication> {
  if (typeof window === "undefined") {
    throw new Error("MSAL is only available in the browser.");
  }

  const config = await buildMsalConfig();
  const nextKey = `${config.auth.clientId}|${config.auth.authority}|${config.auth.redirectUri}`;

  if (!msalInstance || msalConfigKey !== nextKey) {
    msalConfigKey = nextKey;
    msalInstance = new PublicClientApplication(config);
    initPromise = msalInstance.initialize();
  }

  if (initPromise) {
    await initPromise;
  }

  return msalInstance;
}

export async function loginWithMicrosoftRedirect() {
  const msal = await getMsalInstance();
  await msal.loginRedirect({
    scopes: [...MICROSOFT_SCOPES],
    prompt: "select_account",
  });
}

export async function handleMicrosoftRedirectCallback(): Promise<AuthenticationResult | null> {
  const msal = await getMsalInstance();
  const result = await msal.handleRedirectPromise();

  if (result?.account) {
    msal.setActiveAccount(result.account);
    return result;
  }

  const accounts = msal.getAllAccounts();
  if (accounts.length > 0) {
    msal.setActiveAccount(accounts[0]);
  }

  return result;
}

export async function acquireMicrosoftTokenSilent(): Promise<AuthenticationResult | null> {
  const msal = await getMsalInstance();
  const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0];

  if (!account) return null;

  try {
    return await msal.acquireTokenSilent({
      scopes: [...MICROSOFT_SCOPES],
      account,
    });
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await msal.acquireTokenRedirect({
        scopes: [...MICROSOFT_SCOPES],
        account,
      });
    }
    return null;
  }
}

export async function logoutMicrosoftClient() {
  const msal = await getMsalInstance();
  const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0];
  if (account) {
    await msal.logoutRedirect({ account });
  }
}

export function getActiveMicrosoftAccount(): AccountInfo | null {
  if (!msalInstance) return null;
  return msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0] ?? null;
}
