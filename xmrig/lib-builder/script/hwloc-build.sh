#!/bin/bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT/hwloc"

if [ ! -f "configure" ]; then
  ./autogen.sh
fi

compiler_for_arch() {
    case "$1" in
        "arm")
            echo "armv7a-linux-androideabi${ANDROID_API}-clang"
            ;;
        "arm64")
            echo "aarch64-linux-android${ANDROID_API}-clang"
            ;;
        "x86")
            echo "i686-linux-android${ANDROID_API}-clang"
            ;;
        "x86_64")
            echo "x86_64-linux-android${ANDROID_API}-clang"
            ;;
    esac
}

archs=(arm arm64 x86 x86_64)
for arch in ${archs[@]}; do
    case ${arch} in
        "arm")
            target_host=arm-linux-androideabi
            ANDROID_ABI="armeabi-v7a"
            ;;
        "arm64")
            target_host=aarch64-linux-android
            ANDROID_ABI="arm64-v8a"
            ;;
        "x86")
            target_host=i686-linux-android
            ANDROID_ABI="x86"
            ;;
        "x86_64")
            target_host=x86_64-linux-android
            ANDROID_ABI="x86_64"
            ;;
        *)
            exit 16
            ;;
    esac

    TARGET_DIR="$EXTERNAL_LIBS_ROOT/hwloc/$ANDROID_ABI"

    if [ -f "$TARGET_DIR/lib/libhwloc.a" ]; then
      continue
    fi

    if [ ! -f "configure" ]; then
      ./autogen.sh
    fi

    mkdir -p "$TARGET_DIR"
    echo "building hwloc for ${arch}"

    CC_BIN="$(compiler_for_arch "$arch")"
    PATH="$TOOLCHAINS_PATH/bin:$PATH" \
        CC="$CC_BIN" \
        CXX="${CC_BIN}++" \
        AR="llvm-ar" \
        RANLIB="llvm-ranlib" \
        STRIP="llvm-strip" \
        ./configure \
        --prefix="${TARGET_DIR}" \
        --host="${target_host}" \
        --enable-static \
        --disable-shared \
        && make -j 4 \
        && make install \
        && make distclean
done

exit 0
