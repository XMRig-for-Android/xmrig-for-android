#!/usr/bin/env bash
# Reinstall the NDK version pinned in android/build.gradle (requires network).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NDK_VERSION="${NDK_VERSION:-27.1.12297006}"
CMDLINE_TOOLS_ZIP="${CMDLINE_TOOLS_ZIP:-commandlinetools-mac-11076708_latest.zip}"
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/${CMDLINE_TOOLS_ZIP}"

# shellcheck source=/dev/null
source "$ROOT_DIR/scripts/setup-android-env.sh" --quiet

SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
if [ ! -x "$SDKMANAGER" ]; then
  echo "Installing Android SDK command-line tools under $ANDROID_HOME/cmdline-tools/latest ..."
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' EXIT
  curl -fsSL "$CMDLINE_TOOLS_URL" -o "$tmp_dir/cmdline-tools.zip"
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  unzip -q "$tmp_dir/cmdline-tools.zip" -d "$tmp_dir/extract"
  rm -rf "$ANDROID_HOME/cmdline-tools/latest"
  mv "$tmp_dir/extract/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
fi

pick_java_home() {
  local candidate
  for candidate in \
    "$(/usr/libexec/java_home -v 21 2>/dev/null || true)" \
    "$(/usr/libexec/java_home -v 17 2>/dev/null || true)" \
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
    "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home" \
    "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"; do
    if [ -n "$candidate" ] && [ -x "$candidate/bin/java" ]; then
      if "$candidate/bin/java" -version 2>&1 | grep -qE 'version "(17|21)\.'; then
        printf '%s\n' "$candidate"
        return 0
      fi
    fi
  done
  return 1
}

JAVA_HOME="$(pick_java_home || true)"
if [ -z "$JAVA_HOME" ]; then
  echo "Error: sdkmanager needs JDK 17 or 21 (JDK 23 is not supported)." >&2
  echo "Install Android Studio, or: brew install openjdk@17" >&2
  exit 1
fi
export JAVA_HOME

NDK_DIR="$ANDROID_HOME/ndk/$NDK_VERSION"
if [ -d "$NDK_DIR" ]; then
  echo "Removing incomplete NDK at $NDK_DIR ..."
  rm -rf "$NDK_DIR"
fi

echo "Installing NDK $NDK_VERSION (this may take a few minutes) ..."
yes | "$SDKMANAGER" --sdk_root="$ANDROID_HOME" "ndk;$NDK_VERSION"

bash "$ROOT_DIR/scripts/verify-ndk.sh"
