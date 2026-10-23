#!/usr/bin/env bash
set -euo pipefail

LIBUV_VERSION="${LIBUV_VERSION:-v1.53.0}"
HWLOC_VERSION="${HWLOC_VERSION:-v2.15}"
OPENSSL_VERSION="${OPENSSL_VERSION:-3.6.5}"
XMRIG_VERSION="${XMRIG_VERSION:-v6.26.0}"
XMRIG_MO_VERSION="${XMRIG_MO_VERSION:-v6.26.0-mo5}"

ANDROID_API="${ANDROID_API:-29}"
ANDROID_PLATFORM="android-${ANDROID_API}"
ABIS="${ABIS:-armeabi-v7a arm64-v8a x86 x86_64}"
JOBS="${JOBS:-$(getconf _NPROCESSORS_ONLN 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)}"

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$BASE_DIR/../.." && pwd)"
BUILD_ROOT="${EXTERNAL_LIBS_BUILD:-$BASE_DIR/build}"
SRC_DIR="${EXTERNAL_LIBS_BUILD_ROOT:-$BUILD_ROOT/src}"
PREFIX_DIR="${EXTERNAL_LIBS_ROOT:-$BUILD_ROOT/build}"
JNI_LIBS_DIR="$ROOT_DIR/android/app/src/main/jniLibs"

setup_toolchain() {
  if [ -z "${ANDROID_HOME:-}" ]; then
    for candidate in "${ANDROID_SDK_ROOT:-}" "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do
      if [ -n "$candidate" ] && [ -d "$candidate" ]; then
        export ANDROID_HOME="$candidate"
        break
      fi
    done
  fi

  if [ -z "${ANDROID_NDK_ROOT:-}" ]; then
    if [ -n "${ANDROID_NDK_HOME:-}" ] && [ -d "$ANDROID_NDK_HOME" ]; then
      ANDROID_NDK_ROOT="$ANDROID_NDK_HOME"
    elif [ -n "${ANDROID_HOME:-}" ] && [ -d "$ANDROID_HOME/ndk" ]; then
      NDK_VERSION="$(ls "$ANDROID_HOME/ndk" | sort -V | tail -n 1)"
      ANDROID_NDK_ROOT="$ANDROID_HOME/ndk/$NDK_VERSION"
    fi
  fi

  if [ -z "${ANDROID_NDK_ROOT:-}" ] || [ ! -d "$ANDROID_NDK_ROOT" ]; then
    echo "Error: Android NDK not found. Set ANDROID_NDK_ROOT or ANDROID_HOME." >&2
    exit 1
  fi
  export ANDROID_NDK_ROOT="$(cd "$ANDROID_NDK_ROOT" && pwd)"

  TOOLCHAINS_PATH="$(ls -d "$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt/"* 2>/dev/null | head -n 1 || true)"
  if [ -z "$TOOLCHAINS_PATH" ] || [ ! -x "$TOOLCHAINS_PATH/bin/clang" ]; then
    echo "Error: NDK LLVM toolchain not found under $ANDROID_NDK_ROOT" >&2
    exit 1
  fi

  if [ -z "${ANDROID_CMAKE:-}" ] && [ -n "${ANDROID_HOME:-}" ] && [ -d "$ANDROID_HOME/cmake" ]; then
    CMAKE_VER="$(ls "$ANDROID_HOME/cmake" | sort -V | tail -n 1)"
    [ -n "$CMAKE_VER" ] && ANDROID_CMAKE="$ANDROID_HOME/cmake/$CMAKE_VER/bin/cmake"
  fi
  CMAKE="${ANDROID_CMAKE:-$(command -v cmake || true)}"
  if [ -z "$CMAKE" ] || [ ! -x "$CMAKE" ]; then
    echo "Error: cmake not found in Android SDK or PATH." >&2
    exit 1
  fi

  TOOLCHAIN_FILE="$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake"
  export PATH="$TOOLCHAINS_PATH/bin:$PATH"
}

set_abi_vars() {
  case "$1" in
    armeabi-v7a)
      TARGET_HOST="arm-linux-androideabi"
      CLANG_PREFIX="armv7a-linux-androideabi${ANDROID_API}"
      OPENSSL_ARCH="android-arm"
      ARM_TARGET=7
      ;;
    arm64-v8a)
      TARGET_HOST="aarch64-linux-android"
      CLANG_PREFIX="aarch64-linux-android${ANDROID_API}"
      OPENSSL_ARCH="android-arm64"
      ARM_TARGET=8
      ;;
    x86)
      TARGET_HOST="i686-linux-android"
      CLANG_PREFIX="i686-linux-android${ANDROID_API}"
      OPENSSL_ARCH="android-x86"
      ARM_TARGET=0
      ;;
    x86_64)
      TARGET_HOST="x86_64-linux-android"
      CLANG_PREFIX="x86_64-linux-android${ANDROID_API}"
      OPENSSL_ARCH="android-x86_64"
      ARM_TARGET=0
      ;;
    *)
      echo "Unsupported ABI: $1" >&2
      exit 1
      ;;
  esac
}

fetch_git() {
  local name="$1" url="$2" ref="$3"
  mkdir -p "$SRC_DIR"
  if [ ! -d "$SRC_DIR/$name/.git" ]; then
    rm -rf "$SRC_DIR/$name"
    git clone --depth 1 --branch "$ref" "$url" "$SRC_DIR/$name"
  else
    git -C "$SRC_DIR/$name" fetch --depth 1 origin tag "$ref"
    git -C "$SRC_DIR/$name" checkout -f FETCH_HEAD
  fi
}

build_libuv() {
  setup_toolchain
  fetch_git libuv https://github.com/libuv/libuv.git "$LIBUV_VERSION"

  for abi in $ABIS; do
    local target_dir="$PREFIX_DIR/libuv/$abi"
    [ -f "$target_dir/lib/libuv_a.a" ] && continue

    echo "==> Building libuv ($abi)"
    local build_dir="$SRC_DIR/libuv/build/$abi"
    mkdir -p "$build_dir" "$target_dir"

    "$CMAKE" -S "$SRC_DIR/libuv" -B "$build_dir" \
      -DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
      -DANDROID_ABI="$abi" \
      -DANDROID_PLATFORM="$ANDROID_PLATFORM" \
      -DCMAKE_INSTALL_PREFIX="$target_dir" \
      -DBUILD_SHARED_LIBS=OFF \
      -DLIBUV_BUILD_SHARED=OFF \
      -DBUILD_TESTING=OFF \
      -DLIBUV_BUILD_TESTS=OFF
    "$CMAKE" --build "$build_dir" -j "$JOBS"
    "$CMAKE" --install "$build_dir"

    if [ -f "$target_dir/lib/libuv_a.a" ] && [ ! -f "$target_dir/lib/libuv.a" ]; then
      cp "$target_dir/lib/libuv_a.a" "$target_dir/lib/libuv.a"
    elif [ -f "$target_dir/lib/libuv.a" ] && [ ! -f "$target_dir/lib/libuv_a.a" ]; then
      cp "$target_dir/lib/libuv.a" "$target_dir/lib/libuv_a.a"
    fi
  done
}

build_hwloc() {
  setup_toolchain
  fetch_git hwloc https://github.com/open-mpi/hwloc.git "$HWLOC_VERSION"

  cd "$SRC_DIR/hwloc"
  [ -x configure ] || ./autogen.sh

  for abi in $ABIS; do
    set_abi_vars "$abi"
    local target_dir="$PREFIX_DIR/hwloc/$abi"
    [ -f "$target_dir/lib/libhwloc.a" ] && continue

    echo "==> Building hwloc ($abi)"
    mkdir -p "$target_dir"
    [ -x configure ] || ./autogen.sh

    CC="${CLANG_PREFIX}-clang" \
    CXX="${CLANG_PREFIX}-clang++" \
    AR="llvm-ar" \
    RANLIB="llvm-ranlib" \
    STRIP="llvm-strip" \
    ./configure \
      --prefix="$target_dir" \
      --host="$TARGET_HOST" \
      --enable-static \
      --disable-shared
    make -j "$JOBS"
    make install
    make distclean
  done
}

build_openssl() {
  setup_toolchain
  mkdir -p "$SRC_DIR"

  if [ ! -f "$SRC_DIR/openssl/Configure" ]; then
    echo "==> Fetching OpenSSL $OPENSSL_VERSION"
    rm -rf "$SRC_DIR/openssl"
    local url="https://github.com/openssl/openssl/releases/download/openssl-${OPENSSL_VERSION}/openssl-${OPENSSL_VERSION}.tar.gz"
    if command -v curl >/dev/null 2>&1; then
      curl -fsSL "$url" | tar -xz -C "$SRC_DIR"
    else
      wget -qO- "$url" | tar -xz -C "$SRC_DIR"
    fi
    mv "$SRC_DIR/openssl-${OPENSSL_VERSION}" "$SRC_DIR/openssl"
  fi

  cd "$SRC_DIR/openssl"
  for abi in $ABIS; do
    set_abi_vars "$abi"
    local target_dir="$PREFIX_DIR/openssl/$abi"
    [ -f "$target_dir/lib/libssl.a" ] && [ -f "$target_dir/lib/libcrypto.a" ] && continue

    echo "==> Building OpenSSL ($abi)"
    mkdir -p "$target_dir"

    ./Configure "$OPENSSL_ARCH" \
      -D__ANDROID_API__="$ANDROID_API" \
      --prefix="$target_dir" \
      --libdir=lib \
      no-shared no-asm no-zlib no-comp no-dgram no-filenames no-cms
    make -j "$JOBS"
    make install_sw
    make distclean || make clean
  done
}

build_xmrig_variant() {
  local name="$1" url="$2" version="$3" patch_file="${4:-}"
  setup_toolchain
  fetch_git "$name" "$url" "$version"

  local src_dir="$SRC_DIR/$name"
  if [ -n "$patch_file" ]; then
    patch -d "$src_dir" -p1 --forward --input="$patch_file"
  fi

  sed -i.bak 's/pthread rt dl log/dl/g' "$src_dir/CMakeLists.txt"
  rm -f "$src_dir/CMakeLists.txt.bak"

  if [ -f "$src_dir/src/crypto/flex/flex_keccak.c" ]; then
    sed -i.bak -e 's/flex_u32/sph_u32/g' -e 's/flex_enc32le_aligned/sph_enc32le_aligned/g' "$src_dir/src/crypto/flex/flex_keccak.c"
    rm -f "$src_dir/src/crypto/flex/flex_keccak.c.bak"
  fi

  for abi in $ABIS; do
    set_abi_vars "$abi"
    local build_dir="$src_dir/build/$abi"
    [ -f "$build_dir/xmrig" ] && continue

    echo "==> Building $name ($abi)"
    mkdir -p "$build_dir"

    "$CMAKE" -S "$src_dir" -B "$build_dir" \
      -DCMAKE_TOOLCHAIN_FILE="$TOOLCHAIN_FILE" \
      -DANDROID_ABI="$abi" \
      -DANDROID_PLATFORM="$ANDROID_PLATFORM" \
      -DANDROID_CROSS_COMPILE=ON \
      -DBUILD_SHARED_LIBS=OFF \
      -DWITH_OPENCL=OFF \
      -DWITH_CUDA=OFF \
      -DBUILD_STATIC=OFF \
      -DWITH_TLS=ON \
      -DWITH_HWLOC=ON \
      -DARM_TARGET="$ARM_TARGET" \
      -DCMAKE_EXE_LINKER_FLAGS="-Wl,-z,max-page-size=16384" \
      -DHWLOC_LIBRARY="$PREFIX_DIR/hwloc/$abi/lib/libhwloc.a" \
      -DHWLOC_INCLUDE_DIR="$PREFIX_DIR/hwloc/$abi/include" \
      -DUV_LIBRARY="$PREFIX_DIR/libuv/$abi/lib/libuv_a.a" \
      -DUV_INCLUDE_DIR="$PREFIX_DIR/libuv/$abi/include" \
      -DOPENSSL_SSL_LIBRARY="$PREFIX_DIR/openssl/$abi/lib/libssl.a" \
      -DOPENSSL_CRYPTO_LIBRARY="$PREFIX_DIR/openssl/$abi/lib/libcrypto.a" \
      -DOPENSSL_INCLUDE_DIR="$PREFIX_DIR/openssl/$abi/include"
    "$CMAKE" --build "$build_dir" -j "$JOBS"
  done
}

build_xmrig() {
  build_xmrig_variant xmrig https://github.com/xmrig/xmrig.git "$XMRIG_VERSION" "$BASE_DIR/xmrig.patch"
}

build_xmrig_mo() {
  build_xmrig_variant xmrig-mo https://github.com/MoneroOcean/xmrig.git "$XMRIG_MO_VERSION"
}

install_bins() {
  for abi in $ABIS; do
    mkdir -p "$JNI_LIBS_DIR/$abi"
    rm -rf "$JNI_LIBS_DIR/$abi/"*
    cp "$SRC_DIR/xmrig/build/$abi/xmrig" "$JNI_LIBS_DIR/$abi/libxmrig.so"
    cp "$SRC_DIR/xmrig-mo/build/$abi/xmrig" "$JNI_LIBS_DIR/$abi/libxmrig-mo.so"
  done
  echo "==> Installed binaries to $JNI_LIBS_DIR"
}

clean() {
  rm -rf "$BUILD_ROOT"
}

for cmd in "${@:-all}"; do
  case "$cmd" in
    toolchain) setup_toolchain && echo "Using NDK at $ANDROID_NDK_ROOT and CMake at $CMAKE" ;;
    libuv)     build_libuv ;;
    hwloc)     build_hwloc ;;
    openssl)   build_openssl ;;
    xmrig)     build_xmrig ;;
    xmrig-mo)  build_xmrig_mo ;;
    install)   install_bins ;;
    clean)     clean ;;
    all)       clean && build_libuv && build_hwloc && build_openssl && build_xmrig && build_xmrig_mo && install_bins ;;
    *)
      echo "Usage: $0 {all|toolchain|libuv|hwloc|openssl|xmrig|xmrig-mo|install|clean}" >&2
      exit 1
      ;;
  esac
done
