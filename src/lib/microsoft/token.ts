import { createRemoteJWKSet, jwtVerify, type JWTPayload, type RemoteJWKSet } from "jose";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { getMicrosoftPublicConfig, getMicrosoftServerConfig } from "./config";
import { resolveInstitutionalRole } from "./roles";
import type { MicrosoftUserProfile, MicrosoftVerifiedIdentity } from "./types";

let msalClient: ConfidentialClientApplication | null = null;
let cachedJwks: RemoteJWKSet | null = null;
let cachedJwksTenantId: string | null = null;

function getMicrosoftJwks(tenantId: string): RemoteJWKSet {
  if (cachedJwks && cachedJwksTenantId === tenantId) {
    return cachedJwks;
  }

  cachedJwks = createRemoteJWKSet(
    new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`),
  );
  cachedJwksTenantId = tenantId;
  return cachedJwks;
}

function getMsalClient() {
  if (msalClient) return msalClient;
  const { clientId, clientSecret, authority } = {
    ...getMicrosoftPublicConfig(),
    ...getMicrosoftServerConfig(),
  };
  msalClient = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority,
    },
  });
  return msalClient;
}

export async function verifyMicrosoftIdToken(idToken: string): Promise<MicrosoftVerifiedIdentity> {
  const { clientId, tenantId } = getMicrosoftPublicConfig();
  if (!clientId || !tenantId) {
    throw new Error("Microsoft 365 is not configured on this server.");
  }

  const jwks = getMicrosoftJwks(tenantId);

  let payload: JWTPayload;
  try {
    ({ payload } = await jwtVerify(idToken, jwks, {
      issuer: [
        `https://login.microsoftonline.com/${tenantId}/v2.0`,
        `https://sts.windows.net/${tenantId}/`,
      ],
      audience: clientId,
    }));
  } catch (firstError) {
    // Some tenants register an Application ID URI — retry with that audience shape.
    try {
      ({ payload } = await jwtVerify(idToken, jwks, {
        issuer: [
          `https://login.microsoftonline.com/${tenantId}/v2.0`,
          `https://sts.windows.net/${tenantId}/`,
        ],
        audience: [`api://${clientId}`, clientId],
      }));
    } catch {
      throw firstError;
    }
  }

  const email = String(
    payload.preferred_username ?? payload.email ?? payload.upn ?? "",
  ).toLowerCase();
  const displayName = String(payload.name ?? email);
  const id = String(payload.oid ?? payload.sub ?? "");

  if (!email || !id) {
    throw new Error("Microsoft token is missing required profile claims.");
  }

  const groupIds = Array.isArray(payload.groups)
    ? payload.groups.map((group) => String(group))
    : undefined;

  const profile: MicrosoftUserProfile = {
    id,
    email,
    displayName,
    givenName: payload.given_name ? String(payload.given_name) : undefined,
    surname: payload.family_name ? String(payload.family_name) : undefined,
    jobTitle: payload.jobTitle ? String(payload.jobTitle) : undefined,
    institutionalRole: resolveInstitutionalRole(payload),
    groupIds,
  };

  return {
    profile,
    idTokenPayload: payload,
  };
}

export async function refreshMicrosoftAccessToken(refreshToken: string) {
  const client = getMsalClient();
  const { scopes } = getMicrosoftPublicConfig();

  const result = await client.acquireTokenByRefreshToken({
    refreshToken,
    scopes: [...scopes],
  });

  if (!result?.accessToken) {
    throw new Error("Unable to refresh Microsoft access token.");
  }

  return {
    accessToken: result.accessToken,
    refreshToken,
    expiresAt: result.expiresOn?.getTime() ?? Date.now() + 3600 * 1000,
  };
}

export function isAccessTokenExpired(expiresAt: number, skewMs = 60_000) {
  return Date.now() >= expiresAt - skewMs;
}
