/** Dynamic process.env reads so Next.js does not bake empty build-time values over Coolify runtime env. */
const runtimeEnv = process.env;

export function readRuntimeEnv(key: string): string | undefined {
  const raw = runtimeEnv[key];
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  return value || undefined;
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
