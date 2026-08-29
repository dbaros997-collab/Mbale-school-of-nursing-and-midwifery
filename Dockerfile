# Coolify production — pulls the pre-built image from GitHub Actions (GHCR).
# Coolify passes SOURCE_COMMIT as a build arg; defaults to latest.
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
