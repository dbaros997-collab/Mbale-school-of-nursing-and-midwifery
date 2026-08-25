/** Microsoft 365 environment configuration — all secrets via process.env */

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

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function readEnvFirst(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = readEnv(key);
    if (value) return value;
  }
  return undefined;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getAppOrigin(): string {
  const fromEnv = readEnvFirst("NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SITE_URL");
  if (fromEnv) return trimTrailingSlash(fromEnv);

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:5173";
}

export function getMicrosoftPublicConfig() {
  const clientId = readEnvFirst("NEXT_PUBLIC_AZURE_CLIENT_ID", "MICROSOFT_CLIENT_ID");
  const tenantId = readEnvFirst("NEXT_PUBLIC_AZURE_TENANT_ID", "MICROSOFT_TENANT_ID");
  const redirectUri =
    readEnv("NEXT_PUBLIC_AZURE_REDIRECT_URI") ?? `${getAppOrigin()}/auth/microsoft/callback`;

  return {
    clientId: clientId ?? "",
    tenantId: tenantId ?? "",
    redirectUri,
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
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getMicrosoftServerConfig() {
  const publicConfig = getMicrosoftPublicConfig();
  const allowedStudentDomains = parseCsvEnv(
    readEnvFirst("MICROSOFT_ALLOWED_STUDENT_DOMAINS", "ALLOWED_EMAIL_DOMAIN") ??
      "student.mbsnm.org",
  );
  const studentSecurityGroupIds = parseCsvEnv(readEnv("MICROSOFT_STUDENT_SECURITY_GROUP_IDS"));
  const blockedSecurityGroupIds = parseCsvEnv(readEnv("MICROSOFT_BLOCKED_SECURITY_GROUP_IDS"));
  const blockedEmailDomains = parseCsvEnv(
    readEnv("MICROSOFT_BLOCKED_EMAIL_DOMAINS") ?? "staff.mbsnm.org,mbsnm.org",
  );

  return {
    ...publicConfig,
    clientSecret: readEnvFirst("AZURE_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET") ?? "",
    sessionSecret: readEnv("SESSION_SECRET") ?? "",
    sharePointSiteId: readEnv("MICROSOFT_SHAREPOINT_SITE_ID") ?? "",
    sharePointDriveId: readEnv("MICROSOFT_SHAREPOINT_DRIVE_ID") ?? "",
    curriculumFolderPath: readEnv("MICROSOFT_CURRICULUM_FOLDER_PATH") ?? "/Curriculum",
    noticesListId: readEnv("MICROSOFT_NOTICES_LIST_ID") ?? "",
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
  const { clientId, tenantId } = getMicrosoftPublicConfig();
  const placeholder =
    !clientId ||
    !tenantId ||
    clientId.startsWith("your_") ||
    tenantId.startsWith("your_");
  return !placeholder;
}
