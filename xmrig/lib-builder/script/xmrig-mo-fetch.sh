#!/usr/bin/env bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT"

version="v6.26.0-mo5"

if [ ! -d "xmrig-mo" ]; then
  git clone https://github.com/MoneroOcean/xmrig.git -b "${version}" xmrig-mo
else
  git -C xmrig-mo fetch --tags
  git -C xmrig-mo checkout "${version}"
fi
