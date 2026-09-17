import { OFFICIAL_EMAIL_DOMAIN, OFFICIAL_SITE_URL } from "@/lib/site-url";

/** OAuth callback path (append to site origin). Must match Azure Entra redirect URI registration. */
export const MICROSOFT_AUTH_CALLBACK_PATH = "/auth/microsoft/callback";

export const MICROSOFT_PRODUCTION_CALLBACK_URL = `${OFFICIAL_SITE_URL}${MICROSOFT_AUTH_CALLBACK_PATH}`;

export const MICROSOFT_LOCAL_DEV_CALLBACK_URL = `http://localhost:5173${MICROSOFT_AUTH_CALLBACK_PATH}`;

/**
 * Environment variable names used by Microsoft 365 SSO.
 * See `.env.example` for descriptions and production values.
 */
export const MICROSOFT_ENV = {
  /** Server + build: Azure app (client) ID. Must match NEXT_PUBLIC_AZURE_CLIENT_ID. */
  clientId: ["NEXT_PUBLIC_AZURE_CLIENT_ID", "MICROSOFT_CLIENT_ID"] as const,
  /** Server + build: Azure directory (tenant) ID. Must match NEXT_PUBLIC_AZURE_TENANT_ID. */
  tenantId: ["NEXT_PUBLIC_AZURE_TENANT_ID", "MICROSOFT_TENANT_ID"] as const,
  /** Build-time: full redirect URL registered in Entra (SPA platform). */
  redirectUri: ["NEXT_PUBLIC_AZURE_REDIRECT_URI"] as const,
  /** Server only: client secret from Entra app registration. */
  clientSecret: ["MICROSOFT_CLIENT_SECRET", "AZURE_CLIENT_SECRET"] as const,
  /** Server only: iron-session encryption secret (32+ random bytes, base64). */
  sessionSecret: ["SESSION_SECRET"] as const,
  /** Site origin for SSR redirect fallback. */
  siteUrl: ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_URL"] as const,
  /** Primary student mailbox domain for portal access policy. */
  allowedEmailDomain: ["ALLOWED_EMAIL_DOMAIN"] as const,
  /** Optional CSV override for allowed student sign-in domains. */
  allowedStudentDomains: ["MICROSOFT_ALLOWED_STUDENT_DOMAINS"] as const,
  includeLegacyStudentDomains: ["MICROSOFT_INCLUDE_LEGACY_STUDENT_DOMAINS"] as const,
  legacyStudentEmailDomains: ["MICROSOFT_LEGACY_STUDENT_EMAIL_DOMAINS"] as const,
  blockedEmailDomains: ["MICROSOFT_BLOCKED_EMAIL_DOMAINS"] as const,
  studentSecurityGroupIds: ["MICROSOFT_STUDENT_SECURITY_GROUP_IDS"] as const,
  blockedSecurityGroupIds: ["MICROSOFT_BLOCKED_SECURITY_GROUP_IDS"] as const,
  sharePointSiteId: ["MICROSOFT_SHAREPOINT_SITE_ID"] as const,
  sharePointDriveId: ["MICROSOFT_SHAREPOINT_DRIVE_ID"] as const,
  noticesListId: ["MICROSOFT_NOTICES_LIST_ID"] as const,
  curriculumFolderPath: ["MICROSOFT_CURRICULUM_FOLDER_PATH"] as const,
} as const;

export const MICROSOFT_OFFICIAL_STUDENT_DOMAIN = OFFICIAL_EMAIL_DOMAIN;
