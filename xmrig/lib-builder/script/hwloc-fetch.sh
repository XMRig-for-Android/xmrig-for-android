#!/usr/bin/env bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT"

version="v2.15"

if [ ! -d "hwloc" ]; then
  git clone https://github.com/open-mpi/hwloc.git -b "${version}"
else
  git -C hwloc fetch --tags
  git -C hwloc checkout "${version}"
fi
