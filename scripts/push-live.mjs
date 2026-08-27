/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
 *
 * DEPLOY: Coolify builds the root Dockerfile from your git commit (~5–6 min).
 * Verify at /api/health — "build" should match your commit SHA after deploy.
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

const sha = run("git rev-parse --short HEAD");
console.log(`Pushing ${sha} to origin/main...`);
execSync("git push origin main", { stdio: "inherit" });
console.log(`
Done.

  1. Coolify → Deployments — wait for build to finish (~5–6 min)
  2. Logs should show "MBSNM build ${sha} start" then "build done"
  3. Check https://YOUR-SITE/api/health — build should be "${sha}" or full SHA
  4. Hard refresh: Ctrl+Shift+R

Cancel any quick 30-second deploy — that was a stale cached image, not a real build.
`);
