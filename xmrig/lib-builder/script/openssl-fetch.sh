#!/usr/bin/env bash

set -e

source script/env.sh

cd "$EXTERNAL_LIBS_BUILD_ROOT"

OPENSSL_VERSION="3.6.5"

if [ -f "openssl/VERSION.dat" ] && grep -q "MAJOR=3" openssl/VERSION.dat && grep -q "MINOR=6" openssl/VERSION.dat && grep -q "PATCH=5" openssl/VERSION.dat; then
  exit 0
fi

rm -rf openssl openssl.tar.gz
wget "https://github.com/openssl/openssl/releases/download/openssl-${OPENSSL_VERSION}/openssl-${OPENSSL_VERSION}.tar.gz" -O openssl.tar.gz
tar -xvf openssl.tar.gz
mv "openssl-${OPENSSL_VERSION}" openssl
rm -f openssl.tar.gz
