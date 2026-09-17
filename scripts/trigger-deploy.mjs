/**
 * Trigger a Coolify redeploy by pushing an empty commit to main.
 * Coolify must have a GitHub webhook on this repo (push → main).
 */
import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const branch = run("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") {
  console.error(`Switch to main first (currently on "${branch}").`);
  process.exit(1);
}

const sha = run("git rev-parse --short HEAD");
console.log(`Triggering Coolify deploy for ${sha}...`);

execSync(
  'git commit --allow-empty -m "Trigger Coolify redeploy." -m "Empty commit to fire the GitHub → Coolify webhook and restore the live site."',
  { stdio: "inherit" },
);
execSync("git push origin main", { stdio: "inherit" });

console.log(`
Deploy triggered.

  1. Coolify → Deployments — watch for a new build (~5–6 min)
  2. GitHub → Actions — "Publish Docker image" runs in parallel
  3. Live site: https://dpai6rjxhncrqnwnfqeydq2m.146.190.214.147.sslip.io
  4. Head of Midwifery: /academics/midwifery
  5. Hard refresh when done: Ctrl+Shift+R
`);
