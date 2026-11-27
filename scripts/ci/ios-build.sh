#!/usr/bin/env bash
# Compila o projeto iOS.
#   ios-build.sh simulator            -> .app para simulador (sem conta Apple; só corre num Mac)
#   ios-build.sh export <método>      -> IPA assinado (development | ad-hoc | app-store-connect)
# Variáveis: VERSION, BUILD  (+ IOS_CERTIFICATE_P12_BASE64, IOS_CERTIFICATE_PASSWORD, IOS_PROVISIONING_PROFILE_BASE64 no modo export)
set -euo pipefail

MODE="${1:?simulator|export}"
METHOD="${2:-development}"
VERSION="${VERSION:?}"
BUILD="${BUILD:?}"
ROOT="$(pwd)"
OUT="$ROOT/build/ios"
mkdir -p "$OUT"

cd ios/App
if [ -d App.xcworkspace ]; then TARGET=(-workspace App.xcworkspace); else TARGET=(-project App.xcodeproj); fi
VERSIONS=(CURRENT_PROJECT_VERSION="$BUILD" MARKETING_VERSION="$VERSION")

if [ "$MODE" = "simulator" ]; then
  xcodebuild "${TARGET[@]}" -scheme App -configuration Debug \
    -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
    -derivedDataPath "$OUT/derived" CODE_SIGNING_ALLOWED=NO "${VERSIONS[@]}" build
  APP="$OUT/derived/Build/Products/Debug-iphonesimulator/App.app"
  [ -d "$APP/public" ] || { echo "::error::A interface não está dentro do .app"; exit 1; }
  ditto -c -k --keepParent "$APP" "$OUT/SeuCarrinho-ios-simulator.zip"
  echo "Gerado: $OUT/SeuCarrinho-ios-simulator.zip"
  exit 0
fi

# ---- Modo export: assinatura e IPA ----
: "${IOS_CERTIFICATE_P12_BASE64:?}" "${IOS_CERTIFICATE_PASSWORD:?}" "${IOS_PROVISIONING_PROFILE_BASE64:?}"
TMP="${RUNNER_TEMP:-/tmp}"
KEYCHAIN="$TMP/build.keychain-db"
KEYCHAIN_PASSWORD="$(uuidgen)"

echo "$IOS_CERTIFICATE_P12_BASE64" | base64 --decode > "$TMP/cert.p12"
echo "$IOS_PROVISIONING_PROFILE_BASE64" | base64 --decode > "$TMP/profile.mobileprovision"

security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security set-keychain-settings -lut 21600 "$KEYCHAIN"
security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security import "$TMP/cert.p12" -P "$IOS_CERTIFICATE_PASSWORD" -A -t cert -f pkcs12 -k "$KEYCHAIN"
security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN" >/dev/null
security list-keychains -d user -s "$KEYCHAIN" login.keychain

PROFILE_PLIST="$TMP/profile.plist"
security cms -D -i "$TMP/profile.mobileprovision" > "$PROFILE_PLIST"
PROFILE_UUID="$(/usr/libexec/PlistBuddy -c 'Print :UUID' "$PROFILE_PLIST")"
PROFILE_NAME="$(/usr/libexec/PlistBuddy -c 'Print :Name' "$PROFILE_PLIST")"
TEAM_ID="$(/usr/libexec/PlistBuddy -c 'Print :TeamIdentifier:0' "$PROFILE_PLIST")"
mkdir -p "$HOME/Library/MobileDevice/Provisioning Profiles"
cp "$TMP/profile.mobileprovision" "$HOME/Library/MobileDevice/Provisioning Profiles/$PROFILE_UUID.mobileprovision"

BUNDLE_ID="$(node -p "require('$ROOT/capacitor.config.json').appId")"
if [ "$METHOD" = "development" ]; then IDENTITY="Apple Development"; else IDENTITY="Apple Distribution"; fi

cat > "$OUT/ExportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>$METHOD</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>signingStyle</key><string>manual</string>
  <key>provisioningProfiles</key>
  <dict><key>$BUNDLE_ID</key><string>$PROFILE_NAME</string></dict>
</dict>
</plist>
PLIST

xcodebuild "${TARGET[@]}" -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$OUT/App.xcarchive" \
  CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM="$TEAM_ID" \
  PROVISIONING_PROFILE_SPECIFIER="$PROFILE_NAME" CODE_SIGN_IDENTITY="$IDENTITY" \
  "${VERSIONS[@]}" archive

xcodebuild -exportArchive -archivePath "$OUT/App.xcarchive" \
  -exportPath "$OUT/ipa" -exportOptionsPlist "$OUT/ExportOptions.plist"

IPA="$(find "$OUT/ipa" -name '*.ipa' | head -n1)"
cp "$IPA" "$OUT/SeuCarrinho-$VERSION-b$BUILD-$METHOD.ipa"
echo "Gerado: $OUT/SeuCarrinho-$VERSION-b$BUILD-$METHOD.ipa"

security delete-keychain "$KEYCHAIN" || true
