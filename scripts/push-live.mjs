/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
 *
 * DEPLOY PIPELINE:
 *   1. push:live → GitHub Actions builds Dockerfile.build (~5 min)
 *   2. Actions pushes ghcr.io/.../mbale-school:<sha> and :latest
 *   3. Coolify redeploys that commit (Dockerfile pulls by SOURCE_COMMIT)
 *
 * IMPORTANT: Redeploy in Coolify only AFTER Actions shows green — not on git push alone.
 * Optional: GitHub repo Secrets → COOLIFY_WEBHOOK (+ COOLIFY_TOKEN) for auto-redeploy.
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

  1. GitHub → Actions → wait for "Publish Docker image" (~5 min)
  2. Coolify → Redeploy commit ${sha} (pulls ghcr.io/.../mbale-school:${sha})
  3. Hard refresh: Ctrl+Shift+R

Do not redeploy in Coolify until step 1 finishes — otherwise Coolify serves a stale cached image.
`);
