# syntax=docker/dockerfile:1
# Coolify injects SOURCE_COMMIT (full git SHA) on each deploy.
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
# Pull-only — full build runs on GitHub Actions (Dockerfile.build).
# Redeploy in Coolify only AFTER Actions "Publish Docker image" succeeds for this commit.
