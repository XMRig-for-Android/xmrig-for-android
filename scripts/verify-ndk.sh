#!/usr/bin/env bash
# Verify the side-by-side NDK used by this project (see android/build.gradle).
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NDK_VERSION="${NDK_VERSION:-27.1.12297006}"

if [ -z "${ANDROID_HOME:-}" ]; then
  # shellcheck source=/dev/null
  source "$ROOT_DIR/scripts/setup-android-env.sh" --quiet || true
fi

if [ -z "${ANDROID_HOME:-}" ]; then
  echo "Error: ANDROID_HOME is not set." >&2
  exit 1
fi

NDK_ROOT="${ANDROID_NDK_HOME:-$ANDROID_HOME/ndk/$NDK_VERSION}"
if [ ! -d "$NDK_ROOT" ]; then
  echo "Error: NDK $NDK_VERSION not found at $NDK_ROOT" >&2
  echo "Install via Android Studio → SDK Manager → SDK Tools → NDK (Side by side)." >&2
  exit 1
fi

find_libcxx_shared() {
  find "$NDK_ROOT" -path '*aarch64*' -name 'libc++_shared.so' 2>/dev/null | head -n 1
}

LIB="$(find_libcxx_shared)"
if [ -n "$LIB" ]; then
  echo "OK: NDK $NDK_VERSION at $NDK_ROOT"
  echo "OK: arm64 libc++_shared at $LIB"
  exit 0
fi

echo "Error: NDK $NDK_VERSION at $NDK_ROOT is incomplete (missing arm64 libc++_shared.so)." >&2
echo "This breaks native modules such as react-native-reanimated (ld.lld: unable to find library -lc++_shared)." >&2
echo "" >&2
echo "Fix:" >&2
echo "  1. Run: bash scripts/reinstall-ndk.sh" >&2
echo "  2. Or Android Studio → Settings → Android SDK → SDK Tools:" >&2
echo "     uncheck NDK $NDK_VERSION → Apply, then check it again → Apply." >&2
echo "  3. Or: rm -rf \"$NDK_ROOT\" and reinstall from SDK Manager." >&2
exit 1
