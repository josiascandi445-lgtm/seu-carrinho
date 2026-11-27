# Arquitetura — etapas 1 e 2

## Roteiro
1. **Base** (esta etapa): estrutura, tema, componentes, navegação, comportamento mobile, Capacitor.
2. Splash, onboarding, autenticação (Firebase Auth), conclusão de perfil.
3. Seed do Firestore, Home, Explorar, Detalhes, Favoritos.
4. Carrinho persistente, checkout demonstrativo, pedidos, notificações, avaliações.
5. Painel administrativo.
6. Regras de segurança, Functions (preparadas), documentação final, guia Android/iOS.

## Arranque e autenticação (etapa 2)
`App.jsx` decide a fase a mostrar: splash animado (mín. 1,6 s) → introdução (só na 1.ª vez; repetível em Perfil → *Ver introdução*)
→ autenticação → conclusão de perfil → aplicação. A sessão é restaurada pelo Firebase (IndexedDB), por isso a app abre logo na conta.
- **Autenticação:** Firebase Auth (email/palavra-passe), mensagens de erro em português, validação de email e palavra-passe
  (mín. 8, letras e números), mostrar/ocultar palavra-passe, loading e recuperação por email (não revela se o email existe).
- **Perfil:** documento `users/{uid}` no Firestore (nome obrigatório; foto e telefone opcionais). A foto é recortada e reduzida
  no dispositivo e guardada no documento, para funcionar no plano Spark (sem Storage).
- **Visitante:** "Explorar sem conta" permite ver a app sem iniciar sessão (estado guardado no dispositivo). Funcionalidades que
  precisem de conta (pedidos, avaliações) pedirão login nas etapas seguintes.
- **Segurança:** as regras do Firestore (`firestore.rules`) impedem alterar `role`, `uid` e `email` e fecham todas as outras coleções.
  O papel de administrador nunca é decidido no frontend.

## Navegação
Sem react-router nem histórico do navegador. Cinco separadores, cada um com a sua pilha de ecrãs
(`navigation/NavigationContext.jsx`). Transições estilo iOS (push/pop com paralaxe), toques repetidos
ignorados durante a transição, gesto de voltar pela margem esquerda e botão voltar do Android
(`services/backButton.js`: modais têm prioridade; no Início o botão sai da app). Tocar no separador ativo
volta à raiz ou ao topo. Rotas com `tabBar: false` escondem a navegação inferior.

## Comportamento mobile
- Viewport sem zoom, `touch-action: pan-x pan-y`, bloqueio de gestos de pinça.
- Sem seleção de texto nem menu de contexto (exceto campos editáveis ou `[data-selectable]`).
- Imagens não arrastáveis; `overscroll-behavior: none`; scroll só nos contentores de ecrã.
- Áreas seguras: `--safe-area-inset-*` do Capacitor (Android) com fallback para `env()`.
- Teclado: `Keyboard.resize = body`, campo focado centrado, navegação inferior escondida com teclado aberto.
- Feedback: escala ao premir, tátil (Capacitor Haptics; Vibration API na web), `prefers-reduced-motion` respeitado.
- Nota de acessibilidade: bloquear o zoom foi pedido para aparência de app; avalia reativá-lo antes de publicar.

## Spark (gratuito) e preparação para o Blaze
Só Authentication e Firestore são necessários no Spark. Storage e Cloud Functions ficam atrás de
`VITE_ENABLE_STORAGE` / `VITE_ENABLE_FUNCTIONS` (`config/features.js`), desligados por defeito. Nas etapas seguintes:
- Imagens de produto por URL no Spark; upload (Storage) só com Blaze.
- Permissões de admin: regras do Firestore a verificar um documento/claim definido fora do cliente.
  Gerir administradores a partir da app exige Functions (Blaze); no Spark o primeiro admin é definido
  manualmente na consola/script local, nunca por variável no frontend.
- O código de acesso ao Firebase fica isolado em `src/firebase`, para migrar sem refatorar a UI.

## Distribuição
Ver `docs/DISTRIBUICAO.md`: GitHub Actions (Android/iOS), Cloudflare Pages (web) e Firebase (backend).
A interface é sempre empacotada dentro da app (sem `server.url`).

## Limitações conhecidas desta etapa
- Os workflows GitHub Actions foram validados apenas em sintaxe (YAML e shell) e os scripts de versão/guarda foram testados
  isoladamente; ainda não correram num runner real. O workflow iOS (sobretudo a assinatura) é o menos testado.
- `npm install`, Vite e Capacitor não puderam ser executados no ambiente de desenvolvimento (sem rede).
  O código foi verificado com um bundle de teste e um browser (Chromium, 390×844), com os plugins
  Capacitor e os ícones simulados. Falta testar `npm run build`, o Capacitor e a app num telemóvel real.
- Pastas `android/` e `ios/` ainda não existem (criam-se com `cap add`).
- Cor dos ícones da barra de estado (`SystemBars.setStyle`) e comportamento do teclado precisam de confirmação em dispositivo.
- Ainda sem produtos no Firestore, carrinho, checkout, avaliações ou admin.
- Autenticação e perfil foram testados no browser contra um Firebase **simulado**; falta testar com o projeto Firebase real e num telemóvel.
- Sem verificação de email nem início de sessão com Google/Apple (não pedidos).
- iOS só compila num Mac com Xcode; nada foi testado em iOS.
