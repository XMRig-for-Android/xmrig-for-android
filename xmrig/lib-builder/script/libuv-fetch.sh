#!/usr/bin/env bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT"

version="v1.53.0"

if [ ! -d "libuv" ]; then
  git clone https://github.com/libuv/libuv.git -b "${version}"
else
  git -C libuv fetch --tags
  git -C libuv checkout "${version}"
fi
