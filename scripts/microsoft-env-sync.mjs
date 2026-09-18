/**
 * Normalize Microsoft / Azure env names before Next.js standalone boots.
 * Coolify and GitHub often use different key names; sync pairs and aliases here.
 */
import { env as nodeEnv } from "node:process";

const PAIRS = [
  ["MICROSOFT_CLIENT_ID", "NEXT_PUBLIC_AZURE_CLIENT_ID"],
  ["MICROSOFT_TENANT_ID", "NEXT_PUBLIC_AZURE_TENANT_ID"],
];

const ALIASES = [
  ["AZURE_CLIENT_ID", "MICROSOFT_CLIENT_ID"],
  ["AZURE_TENANT_ID", "MICROSOFT_TENANT_ID"],
  ["AZURE_AD_CLIENT_ID", "MICROSOFT_CLIENT_ID"],
  ["AZURE_AD_TENANT_ID", "MICROSOFT_TENANT_ID"],
  ["AZURE_CLIENT_SECRET", "MICROSOFT_CLIENT_SECRET"],
  ["MICROSOFT_SECRET", "MICROSOFT_CLIENT_SECRET"],
  ["IRON_SESSION_PASSWORD", "SESSION_SECRET"],
];

function copyIfMissing(targetKey, sourceKey) {
  const source = nodeEnv[sourceKey]?.trim();
  if (!source) return;
  if (!nodeEnv[targetKey]?.trim()) {
    nodeEnv[targetKey] = source;
  }
}

export function syncMicrosoftEnvAliases() {
  for (const [a, b] of ALIASES) {
    copyIfMissing(a, b);
    copyIfMissing(b, a);
  }

  for (const [serverKey, publicKey] of PAIRS) {
    copyIfMissing(publicKey, serverKey);
    copyIfMissing(serverKey, publicKey);
  }

  if (!nodeEnv.NEXT_PUBLIC_AZURE_REDIRECT_URI?.trim()) {
    nodeEnv.NEXT_PUBLIC_AZURE_REDIRECT_URI =
      "https://mbaleschoolofnursing.ac.ug/auth/microsoft/callback";
  }

  if (!nodeEnv.NEXT_PUBLIC_SITE_URL?.trim()) {
    nodeEnv.NEXT_PUBLIC_SITE_URL = "https://mbaleschoolofnursing.ac.ug";
  }

  if (!nodeEnv.ALLOWED_EMAIL_DOMAIN?.trim()) {
    nodeEnv.ALLOWED_EMAIL_DOMAIN = "mbaleschoolofnursing.ac.ug";
  }
}

export function publishRuntimeEnvSnapshot() {
  globalThis.__MBSNM_RUNTIME_ENV = { ...nodeEnv };
}
