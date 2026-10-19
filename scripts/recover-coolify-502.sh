#!/usr/bin/env bash
# Recover Coolify UI (502 Bad Gateway) after a heavy Railpack/Next build OOM on a small VPS.
# Run on the DigitalOcean droplet as root (Console or SSH):
#   curl -fsSL https://raw.githubusercontent.com/dbaros997-collab/Mbale-school-of-nursing-and-midwifery/main/scripts/recover-coolify-502.sh | bash
# Or clone the repo and: bash scripts/recover-coolify-502.sh

set -euo pipefail

COOLIFY_DIR="${COOLIFY_DIR:-/data/coolify/source}"

log() { printf '\n==> %s\n' "$*"; }

log "Stopping stuck build containers (free RAM)"
docker ps -a --format '{{.Names}}' | grep -E 'build-|coolify-helper|coolify-build' | while read -r name; do
  docker stop "$name" 2>/dev/null || true
  docker rm "$name" 2>/dev/null || true
done || true
docker builder prune -af 2>/dev/null || true

if ! swapon --show | grep -q .; then
  log "Adding 2G swap (one-time; survives reboot if added to fstab)"
  if [[ ! -f /swapfile ]]; then
    fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile 2>/dev/null || true
  grep -q '/swapfile' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

sysctl -w vm.swappiness=10 2>/dev/null || true
sysctl -w vm.overcommit_memory=1 2>/dev/null || true

log "Restart Coolify core containers"
for c in coolify coolify-proxy coolify-redis coolify-db; do
  docker restart "$c" 2>/dev/null || true
done

if [[ -d "$COOLIFY_DIR" ]]; then
  log "Compose up from $COOLIFY_DIR"
  cd "$COOLIFY_DIR"
  docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d
fi

sleep 15

log "Health"
docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E 'coolify|NAMES' || true
curl -sS -o /dev/null -w 'Coolify /login -> HTTP %{http_code}\n' http://127.0.0.1:8000/login || true

log "Done. Open http://157.245.47.90:8000/login — then set Build Pack to Dockerfile (not Railpack) and Deploy."
