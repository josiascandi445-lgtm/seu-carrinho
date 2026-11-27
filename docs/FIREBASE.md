# Configuração do Firebase (plano Spark)

A app usa **Authentication (email/palavra-passe)** e **Cloud Firestore**. Tudo isto funciona no plano gratuito **Spark**.
Podes fazer todos os passos pelo navegador do telemóvel, em <https://console.firebase.google.com>.

## 1. Criar o projeto e a app Web
1. **Add project** → nome (ex.: `seu-carrinho`) → podes desativar o Google Analytics.
2. Na página inicial do projeto, toca no ícone **</> (Web)** → regista a app (não precisas de Firebase Hosting).
3. Copia o objeto de configuração (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
   Estes valores são **públicos** por desenho; não são uma chave de administrador.

## 2. Ativar o início de sessão
**Build → Authentication → Get started → Sign-in method → Email/Password → Enable** (só a primeira opção; a "Email link" não é usada).

Em **Authentication → Settings → Authorized domains** adiciona o domínio onde a versão web corre
(ex.: `o-teu-projeto.pages.dev`). `localhost` já vem incluído.

## 3. Criar a base de dados e publicar as regras
1. **Build → Firestore Database → Create database** → escolhe a região mais próxima (ex.: `europe-west`) → **Production mode**.
2. Separador **Rules** → apaga o conteúdo → cola o conteúdo de `firestore.rules` (na raiz do projeto) → **Publish**.
   Sem este passo, o perfil não grava (a app mostra "Sem permissão. As regras do Firestore podem ainda não estar publicadas.").

O que as regras fazem hoje:
- Cada utilizador só lê e escreve o **seu** documento `users/{uid}`.
- O cliente só pode criar o perfil com `role: "customer"` e nunca consegue alterar o `role`, o `uid` nem o `email`.
- Só os campos previstos são aceites e são validados (nome 3–80 caracteres, foto ≤ 120 KB, etc.).
- Todas as outras coleções ficam **fechadas** até serem abertas nas etapas seguintes.

## 4. Ligar a app ao projeto
Define as variáveis no **GitHub** (Settings → Secrets and variables → Actions → **Variables**) e no **Cloudflare Pages** (Environment variables):

| Variável | Valor |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

Mantém `VITE_ENABLE_STORAGE=false` e `VITE_ENABLE_FUNCTIONS=false` enquanto estiveres no Spark.
Depois, faz um novo build (push, ou Actions → Run workflow). Sem estas variáveis a app arranca na mesma, mas o início de sessão
fica indisponível e só se pode explorar sem conta.

Para desenvolvimento local, copia `.env.example` para `.env.local`.

## 5. Modelo de dados (etapa 2)
Coleção `users`, documento `{uid}`:

| Campo | Tipo | Notas |
|---|---|---|
| `uid` | string | igual ao id do documento |
| `email` | string | igual ao email da conta |
| `displayName` | string | nome completo (3–80) |
| `phone` | string | opcional (vazio se não houver) |
| `photoDataUrl` | string | foto reduzida (256 px, JPEG) guardada no documento, sem Storage |
| `role` | string | `"customer"`. Administradores serão geridos de forma segura na etapa 5 |
| `profileCompleted` | boolean | `true` depois da etapa de conclusão |
| `createdAt`, `updatedAt` | timestamp | definidos pelo servidor |

## 6. Spark → Blaze
- A **foto de perfil** fica no próprio documento (≈ 20–40 KB). Com o Blaze, passará para o Firebase Storage sem mudar o resto da app.
- **Storage** e **Cloud Functions** só serão necessários para upload de imagens de produtos e gestão segura de administradores (etapa 5).

## 7. Problemas comuns
| Sintoma | Causa provável |
|---|---|
| "O Firebase ainda não está configurado" | Variáveis `VITE_FIREBASE_*` em falta no build |
| "O início de sessão por email ainda não foi ativado" | Passo 2 por fazer |
| "Sem permissão…" ao concluir o perfil | Regras do passo 3 por publicar |
| Erro de domínio não autorizado | Adiciona o domínio em Authorized domains (passo 2) |
