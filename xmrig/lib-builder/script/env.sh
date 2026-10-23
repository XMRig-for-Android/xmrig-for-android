#!/usr/bin/env bash

realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

if [ -z "${ANDROID_HOME:-}" ]; then
  if [ -n "${ANDROID_SDK_ROOT:-}" ]; then
    export ANDROID_HOME="$ANDROID_SDK_ROOT"
  elif [ -d "$HOME/Library/Android/sdk" ]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
  else
    echo "ANDROID_HOME is not set and no Android SDK was found" >&2
    exit 1
  fi
fi

detect_ndk_version() {
  if [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --list_installed 2>/dev/null \
      | grep "ndk;" \
      | head -n 1 \
      | sed -E 's/.*ndk\/([0-9][^ ]*).*/\1/' \
      | xargs || true
    return
  fi
  if [ -d "$ANDROID_HOME/ndk" ]; then
    ls "$ANDROID_HOME/ndk" | sort -V | tail -n 1
  fi
}

export NDK_VERSION="$(detect_ndk_version)"
if [ -z "$NDK_VERSION" ]; then
  echo "Could not detect an installed Android NDK under $ANDROID_HOME/ndk" >&2
  exit 1
fi

export ANDROID_NDK_HOME="${ANDROID_HOME}/ndk/${NDK_VERSION}"
export ANDROID_NDK_ROOT="$(realpath "$ANDROID_NDK_HOME")"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export TOOLCHAINS_PATH="$(python3 "$SCRIPT_DIR/toolchains_path.py" --ndk "$ANDROID_NDK_ROOT")"

if [ -d "$ANDROID_HOME/cmake" ]; then
  CMAKE_VERSION="$(ls "$ANDROID_HOME/cmake" | sort -V | tail -n 1)"
  if [ -n "$CMAKE_VERSION" ] && [ -x "$ANDROID_HOME/cmake/$CMAKE_VERSION/bin/cmake" ]; then
    export ANDROID_CMAKE="$ANDROID_HOME/cmake/$CMAKE_VERSION/bin/cmake"
  fi
fi
if [ -z "${ANDROID_CMAKE:-}" ] || [ ! -x "$ANDROID_CMAKE" ]; then
  export ANDROID_CMAKE="$(command -v cmake || true)"
fi
if [ -z "$ANDROID_CMAKE" ]; then
  echo "cmake was not found in the Android SDK or on PATH" >&2
  exit 1
fi

DEFAULT_EXTERNAL_LIBS_BUILD="$(pwd)/build/"
EXTERNAL_LIBS_BUILD="${EXTERNAL_LIBS_BUILD:-${DEFAULT_EXTERNAL_LIBS_BUILD}}"
export EXTERNAL_LIBS_BUILD=${EXTERNAL_LIBS_BUILD%/}

DEFAULT_EXTERNAL_LIBS_BUILD_ROOT=${EXTERNAL_LIBS_BUILD}/src/
EXTERNAL_LIBS_BUILD_ROOT="${EXTERNAL_LIBS_BUILD_ROOT:-${DEFAULT_EXTERNAL_LIBS_BUILD_ROOT}}"
export EXTERNAL_LIBS_BUILD_ROOT=${EXTERNAL_LIBS_BUILD_ROOT%/}

DEFAULT_EXTERNAL_LIBS_ROOT=${EXTERNAL_LIBS_BUILD}/build/
EXTERNAL_LIBS_ROOT="${EXTERNAL_LIBS_ROOT:-${DEFAULT_EXTERNAL_LIBS_ROOT}}"
export EXTERNAL_LIBS_ROOT=${EXTERNAL_LIBS_ROOT%/}

DEFAULT_NDK_TOOL_DIR=${EXTERNAL_LIBS_BUILD}/tool/
NDK_TOOL_DIR="${NDK_TOOL_DIR:-${DEFAULT_NDK_TOOL_DIR}}"
export NDK_TOOL_DIR=${NDK_TOOL_DIR%/}

export ANDROID_API=29
export ANDROID_PLATFORM="android-${ANDROID_API}"
