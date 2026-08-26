/**
 * Push the current commit to origin/main — the branch Coolify deploys.
 * Run after committing: npm run push:live
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

console.log("Pushing to origin/main (Coolify auto-deploy)...");
execSync("git push origin main", { stdio: "inherit" });
console.log("\nDone. Watch Coolify → Deployment logs for the new build.");
