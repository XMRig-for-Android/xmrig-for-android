#!/usr/bin/env bash

set -e

source script/env.sh

# NDK r19+ ships a usable LLVM toolchain. make_standalone_toolchain.py and the
# GCC 4.9 headers it used to patch no longer exist on NDK r25+.
if [ ! -x "$TOOLCHAINS_PATH/bin/clang" ] && [ ! -x "$TOOLCHAINS_PATH/bin/clang++" ]; then
  echo "NDK LLVM toolchain was not found at $TOOLCHAINS_PATH" >&2
  exit 1
fi

echo "Using NDK $NDK_VERSION toolchain at $TOOLCHAINS_PATH"
echo "Using CMake at $ANDROID_CMAKE"
