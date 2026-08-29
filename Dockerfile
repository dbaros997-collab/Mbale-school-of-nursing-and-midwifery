# syntax=docker/dockerfile:1.4
# Coolify production — pulls the pre-built image from GitHub Actions (GHCR).
# --pull=always prevents the VPS from serving a stale cached :latest layer.
ARG SOURCE_COMMIT=latest
FROM --pull=always ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
