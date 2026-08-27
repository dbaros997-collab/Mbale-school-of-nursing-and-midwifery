# syntax=docker/dockerfile:1
# Coolify may inject SOURCE_COMMIT (git SHA). Falls back to :latest from GHCR.
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
# Image is built on GitHub Actions (Dockerfile.build). Redeploy only after Actions succeeds.
