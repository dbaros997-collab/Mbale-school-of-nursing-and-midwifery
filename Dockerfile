# syntax=docker/dockerfile:1.4
# Coolify production — pulls the pre-built image from GitHub Actions (GHCR).
# Default SOURCE_COMMIT pins a known-good GHCR tag (avoids stale :latest cache on the VPS).
# Coolify can override SOURCE_COMMIT at build time with the git SHA.
ARG SOURCE_COMMIT=a3d858940cbc0e2994d055e45c24d33629467a3a
FROM --pull=always ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
