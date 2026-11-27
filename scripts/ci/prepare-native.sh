#!/usr/bin/env bash
# Prepara o projeto nativo (android ou ios) a partir do build web já existente em /dist.
# Se a pasta nativa não existir no repositório, é criada aqui (não é preciso versioná-la).
set -euo pipefail

PLATFORM="${1:?Uso: prepare-native.sh android|ios}"

if [ ! -f dist/index.html ]; then
  echo "::error::dist/index.html não existe. Corre 'npm run build' antes."
  exit 1
fi

# A interface TEM de ir dentro da app. server.url faria a app depender de um site remoto.
node -e "
const c = require('./capacitor.config.json');
if (c.server && c.server.url) {
  console.error('capacitor.config.json define server.url: a app carregaria a interface de um servidor remoto.');
  process.exit(1);
}"

if [ ! -d "$PLATFORM" ]; then
  echo "A criar o projeto nativo '$PLATFORM' (cap add)..."
  npx cap add "$PLATFORM"
fi

# Ícones e splash nativos a partir de /assets (não bloqueia o build se falhar)
npx capacitor-assets generate "--$PLATFORM" || echo "::warning::Falhou a geração de ícones/splash; a usar os predefinidos do Capacitor."

# Copia /dist para dentro do projeto nativo e atualiza plugins
npx cap sync "$PLATFORM"

case "$PLATFORM" in
  android) BUNDLED="android/app/src/main/assets/public/index.html" ;;
  ios)     BUNDLED="ios/App/App/public/index.html" ;;
esac
if [ ! -f "$BUNDLED" ]; then
  echo "::error::A interface não foi copiada para o projeto nativo ($BUNDLED em falta)."
  exit 1
fi
echo "OK: interface incluída no projeto nativo ($BUNDLED)."
