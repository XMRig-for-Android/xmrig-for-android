#!/usr/bin/env bash
# Prefer JDK 23 (also accepts 21 or 17) for Gradle / Android builds.
# Usage:
#   source scripts/setup-java-env.sh
#   eval "$(scripts/setup-java-env.sh --print)"

set -eo pipefail

find_java_home() {
  local version home
  if [ -n "${JAVA_HOME:-}" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    version="$("$JAVA_HOME/bin/java" -version 2>&1 | head -n 1 || true)"
    if echo "$version" | grep -qE 'version "(17|21|23)\.'; then
      printf '%s\n' "$JAVA_HOME"
      return 0
    fi
  fi

  if [ "$(uname -s)" = "Darwin" ] && [ -x /usr/libexec/java_home ]; then
    for version in 23 21 17; do
      home="$(/usr/libexec/java_home -v "$version" 2>/dev/null || true)"
      if [ -n "$home" ] && [ -x "$home/bin/java" ]; then
        printf '%s\n' "$home"
        return 0
      fi
    done
  fi

  local java_bin
  java_bin="$(command -v java || true)"
  if [ -n "$java_bin" ]; then
    home="$(cd "$(dirname "$java_bin")/.." && pwd)"
    if [ -x "$home/bin/java" ]; then
      printf '%s\n' "$home"
      return 0
    fi
  fi

  return 1
}

PRINT_ONLY=0
QUIET=0
while [ $# -gt 0 ]; do
  case "$1" in
    --print)
      PRINT_ONLY=1
      shift
      ;;
    --quiet)
      QUIET=1
      shift
      ;;
    -h|--help)
      sed -n '2,6p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

JAVA_HOME_PATH="$(find_java_home || true)"
if [ -z "$JAVA_HOME_PATH" ]; then
  echo "Error: JDK 17, 21, or 23 not found. Install JDK 23 (recommended) or set JAVA_HOME." >&2
  exit 1
fi

export JAVA_HOME="$JAVA_HOME_PATH"
export PATH="$JAVA_HOME/bin:$PATH"

if [ "$PRINT_ONLY" -eq 1 ]; then
  printf 'export JAVA_HOME=%q\n' "$JAVA_HOME"
  printf 'export PATH=%q\n' "$PATH"
  exit 0
fi

if [ "$QUIET" -eq 0 ]; then
  echo "JAVA_HOME=$JAVA_HOME"
  "$JAVA_HOME/bin/java" -version 2>&1 | head -n 1
fi
