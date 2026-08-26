/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
 *
 * DEPLOY PIPELINE:
 *   GitHub Actions builds with Dockerfile.build (~5 min) → pushes to GHCR →
 *   Coolify Dockerfile only pulls ghcr.io/.../mbale-school:latest (~30 s).
 *
 * Optional once: GitHub repo Secrets → COOLIFY_WEBHOOK (+ COOLIFY_TOKEN) so
 * Coolify redeploys automatically after the image is ready.
 */
import { execSync } from "node:child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const branch = run("git rev-parse --abbrev-ref HEAD");
if (branch !== "main") {
  console.error(
    `\nDeploy branch is "main" (Coolify source). You are on "${branch}".\n` +
      `  git checkout main\n` +
      `  npm run push:live\n`,
  );
  process.exit(1);
}

const dirty = run("git status --porcelain");
if (dirty) {
  console.error("\nCommit or stash changes before pushing to production.\n");
  process.exit(1);
}

console.log("Pushing to origin/main...");
execSync("git push origin main", { stdio: "inherit" });
console.log(`
Done.

  1. GitHub → Actions → wait for "Publish Docker image" (~5 min)
  2. Coolify → Redeploy (or wait for COOLIFY_WEBHOOK auto-deploy)
  3. Hard refresh: Ctrl+Shift+R

Coolify must NOT run npm build on the VPS — root Dockerfile is pull-only from GHCR.
`);
