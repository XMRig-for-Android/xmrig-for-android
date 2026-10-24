#!/usr/bin/env bash
# Start Metro (if needed), wire adb to port 8081, install debug app.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
METRO_PORT="${RCT_METRO_PORT:-8081}"

# shellcheck source=/dev/null
source "$ROOT_DIR/scripts/setup-android-env.sh" --quiet

cd "$ROOT_DIR"

if ! curl -fsS "http://127.0.0.1:${METRO_PORT}/status" 2>/dev/null | grep -q 'packager-status:running'; then
  echo "Starting Metro on port ${METRO_PORT} ..."
  yarn start --port "$METRO_PORT" &
  METRO_PID=$!
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${METRO_PORT}/status" 2>/dev/null | grep -q 'packager-status:running'; then
      break
    fi
    sleep 1
  done
  if ! curl -fsS "http://127.0.0.1:${METRO_PORT}/status" 2>/dev/null | grep -q 'packager-status:running'; then
    kill "$METRO_PID" 2>/dev/null || true
    echo "Error: Metro did not start on port ${METRO_PORT}." >&2
    exit 1
  fi
else
  echo "Metro already running on port ${METRO_PORT}."
fi

if command -v adb >/dev/null 2>&1; then
  adb reverse "tcp:${METRO_PORT}" "tcp:${METRO_PORT}" 2>/dev/null || true
fi

exec npx react-native run-android --port "$METRO_PORT" "$@"
