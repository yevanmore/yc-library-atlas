#!/bin/zsh
set -euo pipefail

ROOT="/Users/evanmore/Documents/codex/yc-library-map"
URL="http://127.0.0.1:8123/index.html"
LOG_FILE="/tmp/yc-library-atlas.log"

if curl -sf "$URL" >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

cd "$ROOT"
python3 "$ROOT/server.py" >"$LOG_FILE" 2>&1 &

for _ in {1..30}; do
  if curl -sf "$URL" >/dev/null 2>&1; then
    open "$URL"
    exit 0
  fi
  sleep 0.2
done

echo "YC Library Atlas server did not start. Check $LOG_FILE" >&2
exit 1
