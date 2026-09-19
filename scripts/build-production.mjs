/**
 * Production build wrapper — streams progress for Coolify/Docker logs
 * and keeps memory use low on small VPS hosts.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextCli = join(root, "node_modules", "next", "dist", "bin", "next");

console.log(`[build] MBSNM production build starting — ${new Date().toISOString()}`);

const iconScript = join(root, "scripts", "generate-site-icons.mjs");
console.log("[build] Regenerating crest PNGs and favicons from source…");
const icons = spawnSync(process.execPath, [iconScript], {
  stdio: "inherit",
  cwd: root,
});
if (icons.status !== 0) {
  console.error(`[build] Logo generation failed with exit code ${icons.status ?? 1}`);
  process.exit(icons.status ?? 1);
}

const result = spawnSync(
  process.execPath,
  [nextCli, "build", "--webpack"],
  {
    stdio: "inherit",
    cwd: root,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      CI: "true",
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=1024",
    },
  },
);

if (result.status !== 0) {
  console.error(`[build] FAILED with exit code ${result.status ?? 1}`);
  process.exit(result.status ?? 1);
}

console.log(`[build] Next.js compile finished — ${new Date().toISOString()}`);
