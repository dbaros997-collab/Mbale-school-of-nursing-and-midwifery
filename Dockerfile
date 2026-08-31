# Coolify — pull the GHCR image built by GitHub Actions for this exact commit.
# SOURCE_COMMIT is injected by Coolify on git deploy (matches the :SHA tag on GHCR).
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:${SOURCE_COMMIT}
