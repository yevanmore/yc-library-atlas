#!/bin/zsh
set -euo pipefail

PORT=8123
PIDS=$(lsof -ti tcp:$PORT || true)

if [[ -z "$PIDS" ]]; then
  echo "No YC Library Atlas server is running on port $PORT."
  exit 0
fi

echo "$PIDS" | xargs kill
echo "Stopped YC Library Atlas server on port $PORT."
