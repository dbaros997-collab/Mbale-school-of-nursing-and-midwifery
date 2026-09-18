declare global {
  // Populated in scripts/start-standalone.mjs before the Next server loads.
  var __MBSNM_RUNTIME_ENV: Record<string, string | undefined> | undefined;
}

function envStore(): Record<string, string | undefined> {
  if (typeof globalThis !== "undefined" && globalThis.__MBSNM_RUNTIME_ENV) {
    return globalThis.__MBSNM_RUNTIME_ENV;
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env as Record<string, string | undefined>;
  }
  return {};
}

/** Read env at call time (prefer runtime snapshot from standalone bootstrap). */
export function readRuntimeEnv(key: string): string | undefined {
  try {
    const raw = envStore()[key];
    if (typeof raw !== "string") return undefined;
    const value = raw.trim();
    return value || undefined;
  } catch {
    return undefined;
  }
}

export function readRuntimeEnvFirst(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = readRuntimeEnv(key);
    if (value) return value;
  }
  return undefined;
}

export function isMicrosoftEnvPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.startsWith("your_") ||
    lower.includes("change-before-production") ||
    lower === "unknown"
  );
}

/** Non-secret keys present at runtime (for operator diagnostics). */
export function listMicrosoftEnvKeyPresence(): string[] {
  const store = envStore();
  const patterns = [
    /^MICROSOFT_/i,
    /^NEXT_PUBLIC_AZURE_/i,
    /^AZURE_/i,
    /^SESSION_SECRET$/i,
    /^ALLOWED_EMAIL_DOMAIN$/i,
  ];
  return Object.keys(store)
    .filter((key) => patterns.some((re) => re.test(key)) && Boolean(store[key]?.trim()))
    .sort();
}
