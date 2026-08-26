# syntax=docker/dockerfile:1
# Coolify pull-only — pins to the commit SHA built on GitHub Actions (falls back to latest).
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
