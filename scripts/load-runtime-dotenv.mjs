/**
 * Load optional env files for Coolify/Docker (runtime only, not committed).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { env as nodeEnv } from "node:process";

function applyLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eq = trimmed.indexOf("=");
  if (eq <= 0) return;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (!nodeEnv[key]?.trim()) {
    nodeEnv[key] = value;
  }
}

export function loadRuntimeDotenv(rootDir) {
  const candidates = [
    join(rootDir, ".env.production.local"),
    join(rootDir, ".env.local"),
    join(rootDir, ".env.production"),
    join(rootDir, ".env"),
    join(rootDir, "config", "microsoft.env"),
    "/app/config/microsoft.env",
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const text = readFileSync(path, "utf8");
      for (const line of text.split(/\r?\n/)) {
        applyLine(line);
      }
    } catch {
      // ignore unreadable env files
    }
  }
}
