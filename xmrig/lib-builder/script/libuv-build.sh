#!/bin/bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT/libuv"

TOOLCHAIN="$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake"
CMAKE="$ANDROID_CMAKE"

archs=(arm arm64 x86 x86_64)
for arch in ${archs[@]}; do
    case ${arch} in
        "arm")
            ANDROID_ABI="armeabi-v7a"
            ;;
        "arm64")
            ANDROID_ABI="arm64-v8a"
            ;;
        "x86")
            ANDROID_ABI="x86"
            ;;
        "x86_64")
            ANDROID_ABI="x86_64"
            ;;
        *)
            exit 16
            ;;
    esac

    TARGET_DIR="$EXTERNAL_LIBS_ROOT/libuv/$ANDROID_ABI"
    if [ -f "$TARGET_DIR/lib/libuv.a" ] || [ -f "$TARGET_DIR/lib/libuv_a.a" ]; then
      continue
    fi

    BUILD_DIR="$EXTERNAL_LIBS_BUILD_ROOT/libuv/build/$ANDROID_ABI"
    mkdir -p "$BUILD_DIR"
    cd "$BUILD_DIR"

    mkdir -p "$TARGET_DIR"
    echo "- Building libuv for ${arch} (${ANDROID_ABI})"

    "$CMAKE" -DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN" \
        -DANDROID_ABI="$ANDROID_ABI" \
        -DANDROID_PLATFORM="$ANDROID_PLATFORM" \
        -DCMAKE_INSTALL_PREFIX="$TARGET_DIR" \
        -DBUILD_SHARED_LIBS=OFF \
        -DLIBUV_BUILD_SHARED=OFF \
        -DBUILD_TESTING=OFF \
        -DLIBUV_BUILD_TESTS=OFF \
        ../.. \
        && make -j 4 \
        && make install

    if [ -f "$TARGET_DIR/lib/libuv_a.a" ] && [ ! -f "$TARGET_DIR/lib/libuv.a" ]; then
      cp "$TARGET_DIR/lib/libuv_a.a" "$TARGET_DIR/lib/libuv.a"
    fi
    if [ -f "$TARGET_DIR/lib/libuv.a" ] && [ ! -f "$TARGET_DIR/lib/libuv_a.a" ]; then
      cp "$TARGET_DIR/lib/libuv.a" "$TARGET_DIR/lib/libuv_a.a"
    fi
done

exit 0
