/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
 *
 * DEPLOY PIPELINE (set up once in Coolify — stops VPS build hangs forever):
 *
 * 1. Cancel any stuck deployment in Coolify.
 *
 * 2. GitHub → repo → Settings → Secrets → add (optional, enables auto-redeploy):
 *      COOLIFY_WEBHOOK  = Deploy webhook URL from Coolify app → Webhooks
 *      COOLIFY_TOKEN    = Coolify API token with deploy permission
 *
 * 3. GitHub → repo → Packages → mbale-school → Package settings → Change visibility → Public
 *    (Or add ghcr.io credentials in Coolify → Keys & Tokens with a PAT that has read:packages)
 *
 * 4. Coolify → your app → General:
 *      Build Pack: Docker Compose  (NOT Dockerfile — that rebuilds on the VPS and hangs)
 *      Docker Compose file: compose.yaml
 *      Enable "Always pull latest image"
 *
 * 5. Coolify → Health check (if not inherited from compose.yaml):
 *      Path: /api/health   Port: 3000
 *
 * After setup, every `npm run push:live`:
 *   GitHub Actions builds the image (~5 min, 7 GB RAM) → pushes to GHCR →
 *   Coolify pulls the image (~30 s). No more "Building docker image" on the VPS.
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

Next:
  1. GitHub → Actions → wait for "Publish Docker image" (~5 min)
  2. Coolify redeploys automatically if COOLIFY_WEBHOOK is set; otherwise click Redeploy
  3. Hard refresh the site: Ctrl+Shift+R

If Coolify still says "Building docker image", switch Build Pack to Docker Compose
and point it at compose.yaml (pull-only — no VPS build).
`);
