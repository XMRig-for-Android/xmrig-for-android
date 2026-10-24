#!/usr/bin/env bash
# Discover the Android SDK on this machine and export ANDROID_HOME / ANDROID_SDK_ROOT.
# Usage:
#   source scripts/setup-android-env.sh
#   eval "$(scripts/setup-android-env.sh --print)"

set -eo pipefail

if [ -n "${BASH_VERSION:-}" ]; then
  _SETUP_ANDROID_ENV="${BASH_SOURCE[0]}"
elif [ -n "${ZSH_VERSION:-}" ]; then
  _SETUP_ANDROID_ENV="${(%):-%x}"
else
  _SETUP_ANDROID_ENV="$0"
fi
SCRIPT_DIR="$(cd "$(dirname "$_SETUP_ANDROID_ENV")" && pwd)"
unset _SETUP_ANDROID_ENV
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOCAL_PROPERTIES="$REPO_ROOT/android/local.properties"

is_android_sdk() {
  local dir="${1%/}"
  [ -n "$dir" ] && [ -d "$dir" ] && [ -d "$dir/platform-tools" ]
}

sdk_from_local_properties() {
  [ -f "$LOCAL_PROPERTIES" ] || return 1
  local line sdk_dir
  line="$(grep -E '^[[:space:]]*sdk\.dir=' "$LOCAL_PROPERTIES" | tail -n 1 || true)"
  [ -n "$line" ] || return 1
  sdk_dir="${line#sdk.dir=}"
  sdk_dir="${sdk_dir//\\:/:}"
  if [[ "$sdk_dir" != /* ]]; then
    sdk_dir="$REPO_ROOT/android/$sdk_dir"
  fi
  sdk_dir="$(cd "$sdk_dir" 2>/dev/null && pwd)" || return 1
  is_android_sdk "$sdk_dir" && printf '%s\n' "$sdk_dir"
}

sdk_from_android_studio_config() {
  local config_root config_dir file
  case "$(uname -s)" in
    Darwin)
      config_root="$HOME/Library/Application Support/Google"
      ;;
    Linux)
      config_root="${XDG_CONFIG_HOME:-$HOME/.config}/Google"
      ;;
    *)
      return 1
      ;;
  esac

  [ -d "$config_root" ] || return 1
  while IFS= read -r config_dir; do
    for file in "$config_dir/options/jdk.table.xml" "$config_dir/options/other.xml"; do
      [ -f "$file" ] || continue
      if grep -q 'android-sdk' "$file" 2>/dev/null; then
        local path
        path="$(grep -Eo 'file://[^"<]+android-sdk[^"<]*' "$file" 2>/dev/null | head -n 1 | sed 's|^file://||' || true)"
        if [ -n "$path" ] && is_android_sdk "$path"; then
          printf '%s\n' "$path"
          return 0
        fi
      fi
    done
  done < <(find "$config_root" -maxdepth 1 -type d -name 'AndroidStudio*' 2>/dev/null | sort -r)
  return 1
}

sdk_from_common_paths() {
  local candidate
  local candidates=()
  if [ -n "${ANDROID_HOME:-}" ]; then candidates+=("$ANDROID_HOME"); fi
  if [ -n "${ANDROID_SDK_ROOT:-}" ]; then candidates+=("$ANDROID_SDK_ROOT"); fi
  candidates+=(
    "$HOME/Library/Android/sdk"
    "$HOME/Android/Sdk"
    "$HOME/android-sdk"
    "/usr/local/lib/android/sdk"
    "/usr/local/share/android-sdk"
    "/opt/android-sdk"
  )
  if [ -n "${LOCALAPPDATA:-}" ]; then
    candidates+=("$LOCALAPPDATA/Android/Sdk")
  fi

  for candidate in "${candidates[@]}"; do
    if is_android_sdk "$candidate"; then
      printf '%s\n' "$(cd "$candidate" && pwd)"
      return 0
    fi
  done
  return 1
}

find_android_sdk() {
  local found=""
  found="$(sdk_from_local_properties 2>/dev/null || true)"
  [ -n "$found" ] && { printf '%s\n' "$found"; return 0; }
  found="$(sdk_from_android_studio_config 2>/dev/null || true)"
  [ -n "$found" ] && { printf '%s\n' "$found"; return 0; }
  sdk_from_common_paths
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

SDK_PATH="$(find_android_sdk || true)"
if [ -z "$SDK_PATH" ]; then
  echo "Error: Android SDK not found. Install Android Studio or set ANDROID_HOME." >&2
  exit 1
fi

export ANDROID_HOME="$SDK_PATH"
export ANDROID_SDK_ROOT="$SDK_PATH"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

if [ "$PRINT_ONLY" -eq 1 ]; then
  printf 'export ANDROID_HOME=%q\n' "$ANDROID_HOME"
  printf 'export ANDROID_SDK_ROOT=%q\n' "$ANDROID_SDK_ROOT"
  printf 'export PATH=%q\n' "$PATH"
  exit 0
fi

if [ "$QUIET" -eq 0 ]; then
  echo "ANDROID_HOME=$ANDROID_HOME"
  echo "ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"
fi
