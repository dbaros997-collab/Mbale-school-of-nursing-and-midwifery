# Coolify — pull the pre-built GHCR image (built by GitHub Actions on every push to main).
# Always use :latest so Coolify never serves a stale commit-tagged cache on the VPS.
ARG SOURCE_COMMIT=latest
FROM ghcr.io/dbaros997-collab/mbale-school:latest
ARG SOURCE_COMMIT
# Changing layer busts Docker cache so Coolify recreates the container each deploy.
RUN echo "deploy-${SOURCE_COMMIT}" > /tmp/.deploy-marker
