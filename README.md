# Seu Carrinho

Aplicativo mobile de compras (React + Vite + Capacitor + Firebase), criado pela **Bug Shop** como demonstração comercial.
Moeda: Kz · Idioma: Português · Identidade: verde-lima, branco suave, carvão.

> **Estado: etapa 1 de 6 (base do aplicativo).** Ainda não há autenticação, produtos reais, carrinho nem painel admin.
> Ver `docs/ARQUITETURA.md` para decisões e limitações.

## Requisitos

- Node.js **22+** e npm (exigido pelo Capacitor 8)
- Android Studio (para Android) · Mac com Xcode (para iOS)

## Comandos

```bash
npm install                 # instalar dependências
npm run dev                 # executar localmente (http://localhost:5173)
npm run build               # gerar build web em /dist
npm run preview             # servir o build

# Capacitor
npm run cap:add:android     # criar a pasta android/ (só uma vez)
npm run cap:add:ios         # criar a pasta ios/ (só uma vez, em Mac)
npm run assets              # gerar ícones e splash nativos a partir de /assets
npm run cap:sync            # build web + sincronizar com as plataformas
npm run cap:open:android    # abrir no Android Studio
npm run cap:open:ios        # abrir no Xcode
npm run android:run         # build + executar num dispositivo/emulador Android
```

Ordem recomendada na primeira vez: `npm install` → `npm run cap:add:android` → `npm run assets` → `npm run cap:sync` → `npm run cap:open:android`.
Para gerar APK/AAB: Android Studio → *Build > Generate Signed Bundle / APK* (requer a tua keystore; não incluída).

## Compilar sem PC (GitHub Actions)

Os workflows em `.github/workflows` compilam o Android (APK/AAB) e o iOS automaticamente a partir do GitHub,
e o Cloudflare Pages publica a versão web. Guia completo, variáveis, assinatura e downloads:
**`docs/DISTRIBUICAO.md`**.

## Configuração

Copia `.env.example` para `.env.local`. As variáveis `VITE_FIREBASE_*` são a configuração **pública** do Firebase.
Nunca coloques service accounts nem chaves privadas no repositório (o `.gitignore` já bloqueia os padrões comuns).

Identificador da app: `com.bugshop.seucarrinho` (em `capacitor.config.json`; altera antes de `cap add` se quiseres outro).

## Estrutura

```
src/
  admin/        área administrativa (etapa 5), separada da área do cliente
  components/   componentes reutilizáveis (um por pasta: .jsx + .module.css)
  config/       identidade da app e interruptores de funcionalidades (Spark/Blaze)
  contexts/     tema e notificações curtas (toasts)
  firebase/     configuração e inicialização preguiçosa do Firebase
  hooks/        hooks (teclado)
  navigation/   navegação própria por separadores e pilhas, transições, Screen
  pages/        ecrãs da área do cliente (+ dev/ biblioteca de componentes)
  services/     Capacitor (barras do sistema, splash, voltar), tátil, proteções mobile
  styles/       tokens de design, base, animações
  utils/        formatação (Kz) e utilitários
assets/         ícone e splash de origem (para @capacitor/assets)
```

## Biblioteca de componentes

Perfil → *Biblioteca de componentes* mostra todos os componentes com dados fictícios. Desliga com `VITE_SHOW_DESIGN_SYSTEM=false`.
