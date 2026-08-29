# Coolify production — pulls the pre-built image from GitHub Actions (GHCR).
# SOURCE_COMMIT must match the git SHA (Coolify sets this automatically).
# Using :latest alone can serve a stale cached image on the VPS.
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
