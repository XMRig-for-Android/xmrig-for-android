#!/bin/bash

set -e

source script/env.sh

prepare_sources() {
    local src_dir="$1"
    cd "$src_dir"
    if [ ! -f CMakeLists.txt.orig ]; then
      cp CMakeLists.txt CMakeLists.txt.orig
    fi
    sed -e "s/pthread rt dl log/dl/g" CMakeLists.txt.orig > CMakeLists.txt
}

build_xmrig() {
    local name="$1"
    local src_dir="$EXTERNAL_LIBS_BUILD_ROOT/$name"
    prepare_sources "$src_dir"

    TOOLCHAIN="$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake"
    CMAKE="$ANDROID_CMAKE"

    archs=(arm arm64 x86 x86_64)
    for arch in ${archs[@]}; do
        case ${arch} in
            "arm")
                ANDROID_ABI="armeabi-v7a"
                ARM_TARGET=7
                ;;
            "arm64")
                ANDROID_ABI="arm64-v8a"
                ARM_TARGET=8
                ;;
            "x86")
                ANDROID_ABI="x86"
                ARM_TARGET=0
                ;;
            "x86_64")
                ANDROID_ABI="x86_64"
                ARM_TARGET=0
                ;;
            *)
                exit 16
                ;;
        esac

        TARGET_DIR="$EXTERNAL_LIBS_ROOT/$name/$ANDROID_ABI"
        BUILD_DIR="$src_dir/build/$ANDROID_ABI"

        if [ -f "$BUILD_DIR/$name" ] || [ -f "$BUILD_DIR/xmrig" ]; then
          continue
        fi

        mkdir -p "$BUILD_DIR" "$TARGET_DIR"
        cd "$BUILD_DIR"
        echo "building ${name} for ${arch}"

        "$CMAKE" -DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN" \
            -DANDROID_ABI="$ANDROID_ABI" \
            -DANDROID_PLATFORM="$ANDROID_PLATFORM" \
            -DCMAKE_INSTALL_PREFIX="$TARGET_DIR" \
            -DANDROID_CROSS_COMPILE=ON \
            -DBUILD_SHARED_LIBS=OFF \
            -DWITH_OPENCL=OFF \
            -DWITH_CUDA=OFF \
            -DBUILD_STATIC=OFF \
            -DWITH_TLS=ON \
            -DWITH_HWLOC=ON \
            -DARM_TARGET="$ARM_TARGET" \
            -DCMAKE_EXE_LINKER_FLAGS="-Wl,-z,max-page-size=16384" \
            -DHWLOC_LIBRARY="$EXTERNAL_LIBS_ROOT/hwloc/$ANDROID_ABI/lib/libhwloc.a" \
            -DHWLOC_INCLUDE_DIR="$EXTERNAL_LIBS_ROOT/hwloc/$ANDROID_ABI/include" \
            -DUV_LIBRARY="$EXTERNAL_LIBS_ROOT/libuv/$ANDROID_ABI/lib/libuv_a.a" \
            -DUV_INCLUDE_DIR="$EXTERNAL_LIBS_ROOT/libuv/$ANDROID_ABI/include" \
            -DOPENSSL_SSL_LIBRARY="$EXTERNAL_LIBS_ROOT/openssl/$ANDROID_ABI/lib/libssl.a" \
            -DOPENSSL_CRYPTO_LIBRARY="$EXTERNAL_LIBS_ROOT/openssl/$ANDROID_ABI/lib/libcrypto.a" \
            -DOPENSSL_INCLUDE_DIR="$EXTERNAL_LIBS_ROOT/openssl/$ANDROID_ABI/include" \
            ../.. \
            && make -j 4
    done
}

build_xmrig xmrig
exit 0
