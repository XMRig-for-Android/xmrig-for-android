#!/usr/bin/env bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT"

version="v6.26.0"
LIB_BUILDER_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "xmrig" ]; then
  git clone https://github.com/xmrig/xmrig.git -b "${version}"
else
  git -C xmrig fetch --tags
  git -C xmrig checkout "${version}"
fi

# Re-apply on a clean tree so a previous forced patch cannot stack.
git -C xmrig checkout -- src/net/strategies/DonateStrategy.cpp
patch -d xmrig -p1 --forward --input="$LIB_BUILDER_DIR/xmrig.patch"
