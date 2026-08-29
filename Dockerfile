# Coolify production — pulls the pre-built image from GitHub Actions.
# No `next build` on the VPS (avoids out-of-memory failures on small servers).
#
# GitHub Actions builds with Dockerfile.build and pushes to GHCR.
# Redeploy Coolify after Actions finishes so :latest includes your commit.
FROM ghcr.io/dbaros997-collab/mbale-school:latest
