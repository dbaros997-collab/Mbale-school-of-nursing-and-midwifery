#!/usr/bin/env bash
# Repair Coolify UI blank /projects screen (Redis, compose stack, logs).
# Run on the VPS as root: bash scripts/fix-coolify-dashboard.sh

set -euo pipefail

COOLIFY_DIR="${COOLIFY_DIR:-/data/coolify/source}"

log() { printf '\n==> %s\n' "$*"; }

log "Container status"
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E 'coolify|NAMES' || true

log "Recent coolify logs"
docker logs coolify --tail 80 2>&1 || true

log "Recent coolify-redis logs"
docker logs coolify-redis --tail 40 2>&1 || true

REDIS_BAD=0
if ! docker ps --format '{{.Names}} {{.Status}}' | grep -q 'coolify-redis.*Up'; then
  REDIS_BAD=1
fi
if docker logs coolify --tail 200 2>&1 | grep -qiE 'redis|connection refused|READONLY'; then
  REDIS_BAD=1
fi

if [[ "$REDIS_BAD" -eq 1 ]]; then
  log "Redis unhealthy — resetting coolify-redis volume (known Coolify fix)"
  systemctl stop docker.socket docker 2>/dev/null || true
  rm -f /var/lib/docker/volumes/coolify-redis/_data/* 2>/dev/null || true
  systemctl start docker
  sysctl -w vm.overcommit_memory=1 2>/dev/null || true
fi

if [[ ! -d "$COOLIFY_DIR" ]]; then
  echo "Coolify source not found at $COOLIFY_DIR" >&2
  exit 1
fi

log "Restarting Coolify stack from $COOLIFY_DIR"
cd "$COOLIFY_DIR"
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d

sleep 20

log "Status after restart"
docker ps -a --format 'table {{.Names}}\t{{.Status}}' | grep coolify || true

log "HTTP checks (localhost)"
curl -sS -o /dev/null -w '/login -> %{http_code}\n' http://127.0.0.1:8000/login || true
curl -sS -o /dev/null -w '/up -> %{http_code}\n' http://127.0.0.1:8000/up || true

log "Done. Open http://YOUR_IP:8000/login and hard-refresh (Ctrl+Shift+R)."
