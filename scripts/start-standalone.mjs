/**
 * Start the Next.js standalone server on all network interfaces.
 *
 * Docker and Coolify inject HOSTNAME=<container-id> at runtime. Next.js
 * standalone reads process.env.HOSTNAME for the bind address, so without
 * this override the server listens on loopback and reverse-proxy / mobile
 * requests time out.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

process.env.HOSTNAME = "0.0.0.0";

if (!process.env.PORT?.trim()) {
  process.env.PORT = "3000";
}

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const serverEntry = [
  join(rootDir, "server.js"),
  join(rootDir, ".next", "standalone", "server.js"),
].find(existsSync);

if (!serverEntry) {
  console.error("Standalone server not found. Run `npm run build` first.");
  process.exit(1);
}

createRequire(import.meta.url)(serverEntry);
