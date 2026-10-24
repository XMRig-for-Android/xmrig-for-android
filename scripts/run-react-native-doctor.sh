#!/usr/bin/env bash
# Run React Native doctor with ANDROID_HOME / JAVA_HOME configured for this project.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=/dev/null
source "$ROOT_DIR/scripts/setup-android-env.sh" --quiet
# shellcheck source=/dev/null
source "$ROOT_DIR/scripts/setup-java-env.sh" --quiet

cd "$ROOT_DIR"
exec npx react-native doctor "$@"
