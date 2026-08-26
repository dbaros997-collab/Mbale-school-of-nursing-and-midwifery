FROM ghcr.io/dbaros997-collab/mbale-school:latest
# Coolify pull-only — keep FROM on line 1 (Coolify injects build args after this line).
# The full Next.js build lives in Dockerfile.build and runs on GitHub Actions, not on the VPS.
# If this fails: wait for GitHub Actions "Publish Docker image", then Redeploy in Coolify.
