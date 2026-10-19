/**
 * Start the Next.js standalone server on all network interfaces.
 *
 * Docker/Coolify inject HOSTNAME=<container-id> at runtime. Next.js standalone
 * uses process.env.HOSTNAME as the bind address — must be 0.0.0.0 behind a proxy.
 *
 * Docker images copy standalone to /app (server.js at repo root). Nixpacks/Railpack
 * keep output under .next/standalone — we spawn server.js from that directory.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { loadRuntimeDotenv } from "./load-runtime-dotenv.mjs";
import { publishRuntimeEnvSnapshot, syncMicrosoftEnvAliases } from "./microsoft-env-sync.mjs";

function forceNetworkBind() {
  process.env.HOSTNAME = "0.0.0.0";
  process.env.HOST = "0.0.0.0";
  if (!process.env.PORT?.trim()) {
    process.env.PORT = "3000";
  }
}

forceNetworkBind();

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
loadRuntimeDotenv(rootDir);
syncMicrosoftEnvAliases();
publishRuntimeEnvSnapshot();
forceNetworkBind();
warnProductionDatabaseEnv();

function warnProductionDatabaseEnv() {
  if (process.env.NODE_ENV !== "production") return;
  const supabaseRest =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (supabaseRest) return;
  const direct =
    process.env.DIRECT_DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_DIRECT_URL?.trim();
  const pooler =
    process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_POOLER_URL?.trim();
  if (direct && !pooler) {
    console.warn(
      "[db] DIRECT_DATABASE_URL is set without DATABASE_URL / SUPABASE_DB_POOLER_URL. " +
        "Use the Supavisor pooler for app traffic to avoid connection saturation.",
    );
  }
}

const dockerServer = join(rootDir, "server.js");
const standaloneDir = join(rootDir, ".next", "standalone");
const standaloneServer = join(standaloneDir, "server.js");

function logBindTarget(layout) {
  console.log(
    `[start-standalone] ${layout} → http://${process.env.HOSTNAME}:${process.env.PORT} (PORT=${process.env.PORT})`,
  );
}

if (existsSync(dockerServer)) {
  logBindTarget("Docker / GHCR layout");
  try {
    createRequire(import.meta.url)(dockerServer);
  } catch (error) {
    console.error("[start-standalone] Failed to start Next.js server:", error);
    process.exit(1);
  }
} else if (existsSync(standaloneServer)) {
  logBindTarget("Railpack standalone layout");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: standaloneDir,
    env: process.env,
    stdio: "inherit",
  });
  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[start-standalone] Server stopped (${signal})`);
      process.exit(1);
    }
    process.exit(code ?? 1);
  });
} else {
  console.error(
    "Standalone server not found. Run `npm run build` first (expected server.js or .next/standalone/server.js).",
  );
  process.exit(1);
}
