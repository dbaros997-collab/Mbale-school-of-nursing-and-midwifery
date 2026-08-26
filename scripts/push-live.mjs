/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
 *
 * IMPORTANT — Coolify setup (do once):
 * 1. Coolify → Keys & Tokens → add GitHub Container Registry (ghcr.io)
 *    Username: your GitHub username
 *    Password: GitHub PAT with read:packages
 * 2. Coolify → your app → General → set Build Pack to "Docker Image"
 * 3. Image: ghcr.io/dbaros997-collab/mbale-school:latest
 * 4. Health check path: /api/health
 *
 * GitHub Actions builds the image (fast, 7 GB RAM). Coolify only pulls it —
 * no more stuck "Building docker image" on the VPS.
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

Next steps:
  1. GitHub → Actions → wait for "Publish Docker image" to finish (~5 min)
  2. Coolify → Redeploy (or it auto-deploys if webhook is set)
  3. Hard refresh the site: Ctrl+Shift+R

If Coolify still builds on the VPS and hangs, switch to Docker Image deploy:
  Image: ghcr.io/dbaros997-collab/mbale-school:latest
`);
