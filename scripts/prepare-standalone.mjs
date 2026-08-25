/**
 * Copies static assets into `.next/standalone` after `next build`.
 * Required for `node .next/standalone/server.js` (Coolify / Docker).
 */
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = join(".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.log("Standalone output not found — skipping asset copy.");
  process.exit(0);
}

cpSync(".next/static", join(standaloneDir, ".next", "static"), { recursive: true });

if (existsSync("public")) {
  cpSync("public", join(standaloneDir, "public"), { recursive: true });
}

console.log("Standalone assets copied.");
