/** Read env at call time — never cache `process.env` on a module-level variable (Next inlines that snapshot). */
export function readRuntimeEnv(key: string): string | undefined {
  try {
    if (typeof process === "undefined" || !process.env) {
      return undefined;
    }
    const raw = process.env[key];
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
