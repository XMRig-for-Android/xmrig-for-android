#!/bin/bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT/openssl"

export ANDROID_NDK_ROOT
export PATH="$TOOLCHAINS_PATH/bin:$PATH"

archs=(arm arm64 x86 x86_64)
for arch in ${archs[@]}; do
    case ${arch} in
        "arm")
            architecture=android-arm
            ANDROID_ABI="armeabi-v7a"
            ;;
        "arm64")
            architecture=android-arm64
            ANDROID_ABI="arm64-v8a"
            ;;
        "x86")
            architecture=android-x86
            ANDROID_ABI="x86"
            ;;
        "x86_64")
            architecture=android-x86_64
            ANDROID_ABI="x86_64"
            ;;
        *)
            exit 16
            ;;
    esac

    TARGET_DIR="$EXTERNAL_LIBS_ROOT/openssl/$ANDROID_ABI"

    if [ -f "$TARGET_DIR/lib/libssl.a" ] && [ -f "$TARGET_DIR/lib/libcrypto.a" ]; then
      continue
    fi

    mkdir -p "$TARGET_DIR"
    echo "building OpenSSL for ${arch}"

    ./Configure "${architecture}" \
        -D__ANDROID_API__="$ANDROID_API" \
        --prefix="${TARGET_DIR}" \
        --libdir=lib \
        no-shared \
        no-asm \
        no-zlib \
        no-comp \
        no-dgram \
        no-filenames \
        no-cms

    make -j 4
    make install_sw
    make distclean || make clean
done

exit 0
