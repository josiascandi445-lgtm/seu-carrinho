# Distribuição: GitHub, GitHub Actions, Cloudflare Pages e Firebase

Objetivo: **atualizar o código no GitHub e receber um APK novo, sem Android Studio nem ambiente local.**

```
GitHub (código)
  ├─ GitHub Actions ─► Android: APK debug (+ APK/AAB assinados) ─► Artifacts / Releases
  ├─ GitHub Actions ─► iOS:     .app simulador (+ IPA assinado)  ─► Artifacts
  └─ Cloudflare Pages ─► versão web (build automático a cada push)
Firebase ─► backend (Authentication + Firestore), usado pela web e pelas apps
```

A app Android/iOS **não depende do Cloudflare**: o `npm run build` gera a interface em `dist/`, o
`cap sync` copia-a para dentro do projeto nativo e o workflow confirma que o `index.html` está dentro
do APK. O script `scripts/ci/prepare-native.sh` até **falha o build** se o `capacitor.config.json`
tiver `server.url` (que faria a app carregar a interface de um servidor remoto).

> A raiz do repositório tem de ser **esta pasta** (a que contém `package.json` e `.github/`), não a pasta acima.

---

## 1. Primeiro uso

1. Cria um repositório no GitHub (privado ou público) e envia o conteúdo do projeto.
   Sem PC, as opções comuns são o Termux (Android) com `git`, ou o GitHub Codespaces no navegador.
2. Em **Settings → Secrets and variables → Actions → Variables**, cria as variáveis da secção 3.
3. Faz um *push* para `main` (ou **Actions → Android → Run workflow**).
4. Quando terminar (±8–15 min na primeira vez), abre a execução e descarrega o artifact (secção 2).

Os workflows **criam as pastas `android/` e `ios/` automaticamente** quando elas não existem no
repositório (`cap add`), geram os ícones e o splash a partir de `assets/` e sincronizam o Capacitor.
Não precisas de as versionar.

## 2. Obter os ficheiros compilados

| Quero… | Onde |
|---|---|
| APK de teste | **Actions → Android → (última execução) → Artifacts → `seu-carrinho-android-debug-apk`** |
| APK/AAB assinados | Mesmos Artifacts: `…-release-apk` e `…-release-aab` (só existem com keystore configurada) |
| Link direto de download | Cria uma *Release* com uma tag `v0.1.0` (Releases → Draft a new release). O workflow anexa os ficheiros à Release |
| iOS | **Actions → iOS → Artifacts** (`…-ios-simulator` ou `…-ios-ipa`) |

- Os artifacts vêm num `.zip` (descomprime para obter o `.apk`). Ficam disponíveis 30 dias.
- No telemóvel, abre o repositório no navegador (modo "versão para computador" se necessário).
- Para instalar um APK: permite "instalar apps de fontes desconhecidas" para o navegador/gestor de ficheiros.
- Cada execução mostra um **resumo** a dizer se o build foi assinado e como descarregar.

### Atualizar por cima da versão instalada
O Android só aceita atualizar se a **assinatura** for igual e o `versionCode` for maior.
- `versionCode` = número da execução do workflow (+ `ANDROID_VERSION_CODE_OFFSET`, opcional). Sobe sozinho.
- APK de **debug**: a chave de debug é guardada na cache do GitHub para se manter entre builds, mas a
  cache pode ser apagada (por exemplo após 7 dias sem builds). Se a instalação por cima falhar,
  desinstala a versão antiga. Para uma assinatura permanente, usa a keystore (secção 4).

## 3. Variáveis e segredos

**Variáveis** (Settings → Secrets and variables → Actions → *Variables*). A configuração web do Firebase é
pública por desenho (a segurança está nas regras do Firestore), por isso são variáveis, não segredos.

| Nome | Para quê |
|---|---|
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` | Configuração do projeto Firebase (Consola → Definições do projeto → As tuas apps) |
| `VITE_ENABLE_STORAGE` | `false` no plano Spark; `true` só com Blaze |
| `VITE_ENABLE_FUNCTIONS` | `false` no plano Spark; `true` só com Blaze |
| `VITE_SHOW_DESIGN_SYSTEM` | `true`/`false`: mostra a Biblioteca de componentes no Perfil |
| `ANDROID_VERSION_CODE_OFFSET` | (opcional) número somado ao `versionCode` |
| `IOS_BUILD_OFFSET` | (opcional) número somado ao número de build iOS |

**Segredos** (*Secrets*; nunca no repositório):

| Nome | Conteúdo |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Keystore em base64 |
| `ANDROID_KEYSTORE_PASSWORD` | Palavra-passe da keystore |
| `ANDROID_KEY_ALIAS` | Alias da chave |
| `ANDROID_KEY_PASSWORD` | Palavra-passe da chave |
| `IOS_CERTIFICATE_P12_BASE64` | Certificado Apple (.p12) em base64 |
| `IOS_CERTIFICATE_PASSWORD` | Palavra-passe do .p12 |
| `IOS_PROVISIONING_PROFILE_BASE64` | Perfil de aprovisionamento (.mobileprovision) em base64 |

Se uma variável não existir, a app usa o valor por defeito (Spark, sem Storage/Functions). Sem as
variáveis `VITE_FIREBASE_*`, o Firebase não é inicializado e a app só permite explorar sem conta.
Configuração passo a passo do Firebase: `docs/FIREBASE.md`.
Nunca coloques *service accounts*, chaves de admin ou `.env` no repositório (o `.gitignore` bloqueia os padrões comuns).

## 4. Assinar o Android (APK/AAB para distribuição)

1. **Actions → "Android — gerar keystore" → Run workflow** (uma única vez).
2. Abre a execução e descarrega o artifact `keystore-secrets` (válido 1 dia). Contém `release.keystore` e `keystore-secrets.txt`.
3. Copia os 4 valores de `keystore-secrets.txt` para os segredos do GitHub (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
4. **Guarda uma cópia do `release.keystore` e das palavras-passe num sítio seguro** (gestor de palavras-passe, não no GitHub) e apaga o artifact.
   Se perderes a keystore não poderás atualizar uma app já publicada com a mesma assinatura.
5. A partir da próxima execução do workflow Android, saem **APK e AAB assinados**.

Para a Google Play: faz upload do **AAB** e ativa o *Play App Signing*. A tua chave passa a ser a *chave de upload*.

## 5. iOS

- Sem conta de programador Apple (99 USD/ano) só se consegue o `.app` de **simulador**, que serve apenas para confirmar
  que o projeto compila (corre num Mac com Xcode, não num iPhone).
- Para instalar num iPhone, TestFlight ou App Store é preciso conta Apple, certificado, *App ID* e perfil de aprovisionamento.
  Sem Mac, o certificado pode ser criado com OpenSSL:
  ```bash
  openssl genrsa -out ios.key 2048
  openssl req -new -key ios.key -out ios.csr -subj "/emailAddress=EMAIL/CN=NOME/C=AO"
  # Apple Developer → Certificates → "+" → Apple Development (ou Apple Distribution) → envia ios.csr → descarrega o .cer
  openssl x509 -inform DER -in certificado.cer -out certificado.pem
  openssl pkcs12 -export -inkey ios.key -in certificado.pem -out ios.p12 -passout pass:UMA_SENHA
  base64 -w0 ios.p12        # (no macOS: base64 -i ios.p12)  -> IOS_CERTIFICATE_P12_BASE64
  ```
  Depois: *Identifiers* → regista o *App ID* `com.bugshop.seucarrinho` (o mesmo `appId` do `capacitor.config.json`),
  *Devices* (UDID, para development/ad-hoc), *Profiles* → cria o perfil → descarrega e converte para base64
  (`IOS_PROVISIONING_PROFILE_BASE64`). A palavra-passe do .p12 vai em `IOS_CERTIFICATE_PASSWORD`.
- **Actions → iOS → Run workflow** e escolhe `development`, `ad-hoc` ou `app-store-connect`.
- O workflow iOS não corre a cada push (os minutos macOS custam 10×): só manualmente ou ao criar uma tag `v*`.
- **Estado:** o workflow iOS ainda não foi executado. A parte de assinatura/exportação em particular
  é nova e pode precisar de ajustes na primeira execução. Envia-me o log do passo que falhar.

## 6. Cloudflare Pages (versão web)

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** e escolhe o repositório.
2. Configuração:
   - *Framework preset*: **React (Vite)** (ou None)
   - *Build command*: `npm run build`
   - *Build output directory*: `dist`
   - *Root directory*: vazio (raiz do repositório)
3. Em **Settings → Environment variables** (Production e Preview) adiciona:
   - `NODE_VERSION` = `22`
   - as mesmas variáveis `VITE_*` da secção 3.
4. Cada *push* para `main` publica; os outros ramos geram *previews*.
5. No Firebase Authentication → *Settings → Authorized domains*, adiciona o domínio `*.pages.dev` (e o teu domínio, se tiveres).

O ficheiro `public/_headers` já define cabeçalhos de segurança e de cache. A app não usa rotas do navegador,
por isso não é preciso `_redirects`.

## 7. Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `npm install` falha | Verifica `package.json`; sem `package-lock.json` as versões são resolvidas a cada build |
| Falha ao compilar Android com erro de Java/SDK | Capacitor 8 exige JDK 21 e SDK 36; o workflow já os configura |
| "App não instalada" ao atualizar | Assinatura diferente da versão instalada: desinstala a antiga ou configura a keystore |
| Ícone ou splash predefinidos | Aviso `Falhou a geração de ícones`: ver o log do passo "Preparar projeto" |
| iOS: erro de perfil/certificado | Confirma `appId`, tipo de perfil (development/ad-hoc/app-store) e o certificado correspondente |

## 8. Segurança

- Nenhum ficheiro com credenciais vai para o repositório (`*.keystore`, `*.p12`, `*.mobileprovision` estão no `.gitignore`).
- Os segredos só existem nos *Secrets* do GitHub e são injetados durante o build; a keystore é apagada do runner no fim do passo de assinatura.
- Mantém o repositório privado enquanto os artifacts contiverem builds de debug com dados de configuração.
- Recomenda-se gerar e versionar um `package-lock.json` assim que possível, para builds reproduzíveis (`npm ci`).
