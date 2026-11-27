#!/usr/bin/env bash
# Define versionCode (tem de subir a cada build para o Android aceitar atualizações) e versionName.
set -euo pipefail
CODE="${1:?versionCode}"
NAME="${2:?versionName}"
FILE="android/app/build.gradle"

perl -0pi -e "s/versionCode\s*=?\s*\d+/versionCode $CODE/; s/versionName\s*=?\s*\"[^\"]*\"/versionName \"$NAME\"/" "$FILE"

grep -qE "versionCode $CODE" "$FILE" && grep -qE "versionName \"$NAME\"" "$FILE" \
  || { echo "::error::Não foi possível definir a versão em $FILE"; exit 1; }
echo "Versão Android: $NAME ($CODE)"
