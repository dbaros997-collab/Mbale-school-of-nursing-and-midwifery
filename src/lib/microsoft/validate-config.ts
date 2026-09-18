import {
  getAllowedStudentEmailDomains,
  getMicrosoftPublicConfig,
  getMicrosoftServerConfig,
  isMicrosoftClientConfigured,
  isMicrosoftConfidentialClientConfigured,
} from "./config";
import {
  MICROSOFT_AUTH_CALLBACK_PATH,
  MICROSOFT_ENV,
  MICROSOFT_PRODUCTION_CALLBACK_URL,
} from "./env-vars";
import { OFFICIAL_SITE_URL } from "@/lib/site-url";
import { isMicrosoftEnvPlaceholder, readRuntimeEnv, readRuntimeEnvFirst } from "./read-env";

export type MicrosoftConfigIssueLevel = "error" | "warning";

export type MicrosoftConfigIssue = {
  level: MicrosoftConfigIssueLevel;
  code: string;
  message: string;
};

const isPlaceholder = isMicrosoftEnvPlaceholder;

function parseRedirectUri(raw: string | undefined): URL | null {
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export type MicrosoftConfigValidation = {
  /** Server can verify tokens and create Microsoft sessions. */
  serverConfigured: boolean;
  /** Browser can start MSAL redirect login. */
  clientConfigured: boolean;
  redirectUri: string;
  allowedStudentDomains: string[];
  issues: MicrosoftConfigIssue[];
};

/**
 * Validates Microsoft 365 deployment settings (no secrets returned).
 * Pass `production: true` when checking Coolify / mbaleschoolofnursing.ac.ug.
 */
export function validateMicrosoftDeploymentConfig(options?: {
  production?: boolean;
}): MicrosoftConfigValidation {
  const production = options?.production ?? process.env.NODE_ENV === "production";
  const issues: MicrosoftConfigIssue[] = [];

  const publicConfig = getMicrosoftPublicConfig();
  const serverConfig = getMicrosoftServerConfig();
  const allowedStudentDomains = getAllowedStudentEmailDomains();

  const clientIdPublic = readRuntimeEnv(MICROSOFT_ENV.clientId[0]);
  const clientIdServer = readRuntimeEnv(MICROSOFT_ENV.clientId[1]);
  const tenantIdPublic = readRuntimeEnv(MICROSOFT_ENV.tenantId[0]);
  const tenantIdServer = readRuntimeEnv(MICROSOFT_ENV.tenantId[1]);

  if (clientIdPublic && clientIdServer && clientIdPublic !== clientIdServer) {
    issues.push({
      level: "error",
      code: "client_id_mismatch",
      message:
        "NEXT_PUBLIC_AZURE_CLIENT_ID and MICROSOFT_CLIENT_ID must be the same Azure app registration ID.",
    });
  }

  if (tenantIdPublic && tenantIdServer && tenantIdPublic !== tenantIdServer) {
    issues.push({
      level: "error",
      code: "tenant_id_mismatch",
      message:
        "NEXT_PUBLIC_AZURE_TENANT_ID and MICROSOFT_TENANT_ID must be the same directory (tenant) ID.",
    });
  }

  if (isPlaceholder(publicConfig.clientId)) {
    issues.push({
      level: "error",
      code: "client_id_missing",
      message: `Set ${MICROSOFT_ENV.clientId.join(" and ")} to your Entra app (client) ID.`,
    });
  }

  if (isPlaceholder(publicConfig.tenantId)) {
    issues.push({
      level: "error",
      code: "tenant_id_missing",
      message: `Set ${MICROSOFT_ENV.tenantId.join(" and ")} to your Entra directory (tenant) ID.`,
    });
  }

  if (isPlaceholder(serverConfig.clientSecret)) {
    issues.push({
      level: isMicrosoftClientConfigured() ? "warning" : "error",
      code: "client_secret_missing",
      message: `Set ${MICROSOFT_ENV.clientSecret.join(" or ")} for Graph/refresh (optional for basic Microsoft sign-in).`,
    });
  }

  if (isPlaceholder(serverConfig.sessionSecret)) {
    issues.push({
      level: production ? "error" : "warning",
      code: "session_secret_weak",
      message: `Set ${MICROSOFT_ENV.sessionSecret[0]} to a long random string (e.g. openssl rand -base64 32).`,
    });
  }

  const redirectRaw =
    readRuntimeEnv(MICROSOFT_ENV.redirectUri[0]) ?? publicConfig.redirectUri;
  const redirect = parseRedirectUri(redirectRaw);

  if (!redirect) {
    issues.push({
      level: "error",
      code: "redirect_invalid",
      message: `${MICROSOFT_ENV.redirectUri[0]} must be a valid absolute URL.`,
    });
  } else if (redirect.pathname.replace(/\/+$/, "") !== MICROSOFT_AUTH_CALLBACK_PATH) {
    issues.push({
      level: "error",
      code: "redirect_path",
      message: `Redirect URI path must be ${MICROSOFT_AUTH_CALLBACK_PATH} (got ${redirect.pathname}).`,
    });
  }

  if (production && redirect) {
    const expectedHost = new URL(OFFICIAL_SITE_URL).host;
    if (redirect.host !== expectedHost) {
      issues.push({
        level: "error",
        code: "redirect_host",
        message: `Production redirect should use ${expectedHost}. Register ${MICROSOFT_PRODUCTION_CALLBACK_URL} in Entra ID.`,
      });
    }
    if (redirect.protocol !== "https:") {
      issues.push({
        level: "error",
        code: "redirect_https",
        message: "Production redirect URI must use https.",
      });
    }
  }

  if (production && !readRuntimeEnv(MICROSOFT_ENV.redirectUri[0])) {
    issues.push({
      level: "warning",
      code: "redirect_build_time",
      message: `${MICROSOFT_ENV.redirectUri[0]} should be set at Docker build (GitHub Actions var) to ${MICROSOFT_PRODUCTION_CALLBACK_URL}.`,
    });
  }

  const siteUrl = readRuntimeEnvFirst([...MICROSOFT_ENV.siteUrl]);
  if (production) {
    if (!siteUrl) {
      issues.push({
        level: "warning",
        code: "site_url_missing",
        message: `${MICROSOFT_ENV.siteUrl[0]} should be ${OFFICIAL_SITE_URL} at Docker build time.`,
      });
    } else {
      try {
        const site = new URL(siteUrl);
        const official = new URL(OFFICIAL_SITE_URL);
        if (site.host !== official.host) {
          issues.push({
            level: "error",
            code: "site_url_host",
            message: `${MICROSOFT_ENV.siteUrl[0]} should be ${OFFICIAL_SITE_URL} in production (got ${site.host}).`,
          });
        }
        if (site.protocol !== "https:") {
          issues.push({
            level: "error",
            code: "site_url_https",
            message: "Production site URL must use https.",
          });
        }
      } catch {
        issues.push({
          level: "error",
          code: "site_url_invalid",
          message: `${readRuntimeEnvFirst([...MICROSOFT_ENV.siteUrl])} is not a valid URL.`,
        });
      }
    }
  }

  if (
    !readRuntimeEnv(MICROSOFT_ENV.allowedStudentDomains[0]) &&
    !readRuntimeEnv(MICROSOFT_ENV.allowedEmailDomain[0])
  ) {
    issues.push({
      level: "warning",
      code: "allowed_domain_default",
      message: `No ${MICROSOFT_ENV.allowedEmailDomain[0]} set — using code default plus legacy UPN domains during migration.`,
    });
  }

  return {
    serverConfigured: isMicrosoftConfidentialClientConfigured(),
    clientConfigured: isMicrosoftClientConfigured(),
    redirectUri: publicConfig.redirectUri,
    allowedStudentDomains,
    issues,
  };
}

export function microsoftConfigHasErrors(validation: MicrosoftConfigValidation): boolean {
  return validation.issues.some((issue) => issue.level === "error");
}
