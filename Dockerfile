FROM ghcr.io/dbaros997-collab/mbale-school:latest
# Coolify pull-only — keep FROM on line 1 (Coolify injects build args after this line).
# Full Next.js build runs on GitHub Actions via Dockerfile.build, NOT on the VPS.
# If deploy fails: wait for Actions "Publish Docker image" to finish, then Redeploy.
