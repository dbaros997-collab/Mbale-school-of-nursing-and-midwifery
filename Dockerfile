# syntax=docker/dockerfile:1.4
# Coolify fallback when configured for Dockerfile (not compose) deployments.
# Prefer docker-compose.yml — it pulls the GHCR image directly without a local build step.
ARG SOURCE_COMMIT=latest
FROM --pull=always ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
