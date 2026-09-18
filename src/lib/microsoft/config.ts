/** Microsoft 365 environment configuration — all secrets via process.env */

import {
  MICROSOFT_AUTH_CALLBACK_PATH,
  MICROSOFT_ENV,
  MICROSOFT_LOCAL_DEV_CALLBACK_URL,
  MICROSOFT_PRODUCTION_CALLBACK_URL,
} from "./env-vars";
import { getPublicSiteUrl, OFFICIAL_EMAIL_DOMAIN } from "@/lib/site-url";
import {
  isMicrosoftEnvPlaceholder,
  readRuntimeEnv,
  readRuntimeEnvFirst,
} from "./read-env";

export {
  MICROSOFT_AUTH_CALLBACK_PATH,
  MICROSOFT_ENV,
  MICROSOFT_LOCAL_DEV_CALLBACK_URL,
  MICROSOFT_PRODUCTION_CALLBACK_URL,
} from "./env-vars";

export const MICROSOFT_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "User.Read",
  "Calendars.Read",
  "Sites.Read.All",
  "Files.Read.All",
  "GroupMember.Read.All",
] as const;

const SERVER_CLIENT_ID_KEYS = ["MICROSOFT_CLIENT_ID", "NEXT_PUBLIC_AZURE_CLIENT_ID"] as const;
const SERVER_TENANT_ID_KEYS = ["MICROSOFT_TENANT_ID", "NEXT_PUBLIC_AZURE_TENANT_ID"] as const;
const BROWSER_CLIENT_ID_KEYS = ["NEXT_PUBLIC_AZURE_CLIENT_ID", "MICROSOFT_CLIENT_ID"] as const;
const BROWSER_TENANT_ID_KEYS = ["NEXT_PUBLIC_AZURE_TENANT_ID", "MICROSOFT_TENANT_ID"] as const;

function readMicrosoftClientId(): string | undefined {
  const keys =
    typeof window === "undefined" ? SERVER_CLIENT_ID_KEYS : BROWSER_CLIENT_ID_KEYS;
  return readRuntimeEnvFirst(keys);
}

function readMicrosoftTenantId(): string | undefined {
  const keys =
    typeof window === "undefined" ? SERVER_TENANT_ID_KEYS : BROWSER_TENANT_ID_KEYS;
  return readRuntimeEnvFirst(keys);
}

export function getMicrosoftPublicConfig() {
  const clientId = readMicrosoftClientId();
  const tenantId = readMicrosoftTenantId();
  return {
    clientId: clientId ?? "",
    tenantId: tenantId ?? "",
    redirectUri: getMicrosoftRedirectUri(),
    authority: tenantId
      ? `https://login.microsoftonline.com/${tenantId}`
      : "https://login.microsoftonline.com/common",
    scopes: [...MICROSOFT_SCOPES],
  };
}

function parseCsvEnv(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim().replace(/^@/, "").toLowerCase())
    .filter(Boolean);
}

/** Default legacy UPN suffix while Azure AD migrates mailboxes to the official domain. */
const DEFAULT_LEGACY_STUDENT_EMAIL_DOMAINS = ["student.mbsnm.org"] as const;

/**
 * Domains that qualify for student portal Microsoft sign-in.
 * Env overrides the base list; legacy UPN domains are merged unless disabled.
 */
export function getAllowedStudentEmailDomains(): string[] {
  const fromEnv = parseCsvEnv(
    readRuntimeEnvFirst(["MICROSOFT_ALLOWED_STUDENT_DOMAINS", "ALLOWED_EMAIL_DOMAIN"]),
  );
  const base = fromEnv.length > 0 ? fromEnv : [OFFICIAL_EMAIL_DOMAIN.toLowerCase()];

  if (readRuntimeEnv("MICROSOFT_INCLUDE_LEGACY_STUDENT_DOMAINS") === "false") {
    return [...new Set(base)];
  }

  const legacy = parseCsvEnv(
    readRuntimeEnv("MICROSOFT_LEGACY_STUDENT_EMAIL_DOMAINS") ??
      DEFAULT_LEGACY_STUDENT_EMAIL_DOMAINS.join(","),
  );

  return [...new Set([...base, ...legacy])];
}

function getMicrosoftRedirectUri(): string {
  const explicit = readRuntimeEnv(MICROSOFT_ENV.redirectUri[0]);
  if (explicit) return explicit;

  if (typeof window !== "undefined") {
    return `${window.location.origin}${MICROSOFT_AUTH_CALLBACK_PATH}`;
  }

  if (process.env.NODE_ENV === "production") {
    return MICROSOFT_PRODUCTION_CALLBACK_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return MICROSOFT_LOCAL_DEV_CALLBACK_URL;
  }

  return `${getPublicSiteUrl()}${MICROSOFT_AUTH_CALLBACK_PATH}`;
}

export function getMicrosoftServerConfig() {
  const publicConfig = getMicrosoftPublicConfig();
  const allowedStudentDomains = getAllowedStudentEmailDomains();
  const studentSecurityGroupIds = parseCsvEnv(readRuntimeEnv("MICROSOFT_STUDENT_SECURITY_GROUP_IDS"));
  const blockedSecurityGroupIds = parseCsvEnv(readRuntimeEnv("MICROSOFT_BLOCKED_SECURITY_GROUP_IDS"));
  const blockedEmailDomains = parseCsvEnv(
    readRuntimeEnv("MICROSOFT_BLOCKED_EMAIL_DOMAINS") ?? "staff.mbsnm.org,mbsnm.org",
  );

  return {
    ...publicConfig,
    clientSecret:
      readRuntimeEnvFirst(["AZURE_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET"]) ?? "",
    sessionSecret: readRuntimeEnv("SESSION_SECRET") ?? "",
    sharePointSiteId: readRuntimeEnv("MICROSOFT_SHAREPOINT_SITE_ID") ?? "",
    sharePointDriveId: readRuntimeEnv("MICROSOFT_SHAREPOINT_DRIVE_ID") ?? "",
    curriculumFolderPath: readRuntimeEnv("MICROSOFT_CURRICULUM_FOLDER_PATH") ?? "/Curriculum",
    noticesListId: readRuntimeEnv("MICROSOFT_NOTICES_LIST_ID") ?? "",
    accessPolicy: {
      allowedStudentDomains,
      studentSecurityGroupIds,
      blockedSecurityGroupIds,
      blockedEmailDomains,
    },
  };
}

export function isMicrosoftConfigured(): boolean {
  const { clientId, tenantId } = getMicrosoftPublicConfig();
  const { clientSecret, sessionSecret } = getMicrosoftServerConfig();
  return Boolean(clientId && tenantId && clientSecret && sessionSecret);
}

export function isMicrosoftClientConfigured(): boolean {
  const clientId = readMicrosoftClientId();
  const tenantId = readMicrosoftTenantId();
  return !isMicrosoftEnvPlaceholder(clientId) && !isMicrosoftEnvPlaceholder(tenantId);
}
