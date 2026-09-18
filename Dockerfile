# Pull-only image for Coolify — always use :latest built by GitHub Actions (Publish Docker image).
# Do not pin to a short SHA here; that caused extra git pushes and overlapping redeploys.
FROM ghcr.io/dbaros997-collab/mbale-school:latest
