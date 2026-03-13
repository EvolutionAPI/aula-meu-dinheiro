---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'product-brief-live-01-2026-02-26.md']
workflowType: 'architecture'
project_name: 'live-01'
user_name: 'Davidson'
date: '2026-02-26'
lastStep: 8
status: 'complete'
completedAt: '2026-02-26'
---

# Architecture Decision Document — MeuDinheiro

**Autor:** Davidson
**Data:** 2026-02-26

_Este documento define todas as decisões arquiteturais do projeto MeuDinheiro, servindo como fonte única da verdade para implementação por agentes de IA._

---

## Análise de Contexto do Projeto

### Visão Geral dos Requisitos

**Requisitos Funcionais:**
21 requisitos organizados em 5 domínios:
- **Gestão de Usuário (FR1-5):** Cadastro, login, logout, sessão persistente com cookies httpOnly, redirecionamento para login em rotas protegidas
- **Gestão de Transações (FR6-10):** Criar transação com tipo/valor/categoria/data/descrição, listar transações, excluir transação, filtragem de categorias por tipo, validação inline sem perda de dados
- **Categorias (FR11-12):** Categorias fixas de receita (Salário, Freelance, Outros) e despesa (Alimentação, Transporte, Moradia, Saúde, Lazer, Outros)
- **Dashboard Financeiro (FR13-17):** Saldo atual do mês, total de receitas, total de despesas, últimas 5 transações, atualização imediata sem reload após cada operação
- **Feedback e Experiência (FR18-21):** Feedback animado em sucesso, toast em exclusão, erros inline, transições animadas de navegação

O escopo é intencionalmente estreito — sem relatórios, filtros, gráficos ou edição de transações no MVP.

**Requisitos Não-Funcionais:**
- **Performance:** < 300ms para ações do usuário, 60fps para animações, TTI < 2s, atualização do dashboard < 100ms após operação
- **Segurança:** bcrypt para hashing de senhas (nunca texto plano), cookies httpOnly e secure (inacessível via JS), isolamento por userId em todas as queries, verificação server-side em rotas protegidas
- **Acessibilidade:** WCAG AA (contraste 4.5:1 para texto normal, 3:1 para texto grande), labels semânticos em todos os inputs, foco visível ao navegar via teclado, erros e toasts via aria-live
- **Responsividade:** Desktop 1280px+ como alvo principal, tablet 768px+ como mínimo funcional

**Escala e Complexidade:**
- Domínio primário: web fullstack (Next.js App Router)
- Nível de complexidade: **baixo**
- Componentes arquiteturais estimados: 4 (auth, transações, dashboard, UI/feedback)
- Contexto: Greenfield, demonstração ao vivo do processo BMAD

### Restrições Técnicas e Dependências

- Stack pré-definida no PRD: **Next.js 14+ App Router**, Tailwind CSS, shadcn/ui, Prisma + SQLite
- Sem dependências externas de banco de dados — SQLite roda embarcado na aplicação
- Sem WebSockets, polling ou sync entre abas — reatividade local do cliente após mutations
- Autenticação server-side: redirecionamento via middleware, não client-only
- Contexto de execução: demonstração ao vivo, portanto estabilidade e zero erros visíveis têm prioridade máxima

### Preocupações Transversais Identificadas

- **Autenticação/Autorização:** Verificação server-side em todas as rotas protegidas + isolamento userId em todas as queries do banco
- **State Management do Cliente:** Atualização imediata do dashboard após create/delete sem reload de página
- **Animações e Transições:** 60fps garantido — implica Client Components para elementos animados, separação clara de responsabilidades Server/Client
- **Validação de Formulários:** Inline sem perda de dados, feedback imediato — estado controlado no cliente
- **Segurança de dados:** userId como filtro obrigatório em todas as queries — nenhum dado de outros usuários pode vazar

---

## Avaliação de Starter Template

### Domínio Tecnológico Primário

**Full-stack web com Next.js App Router** — identificado pela combinação de requisitos de renderização server-side (autenticação, dados iniciais) com interatividade rica do cliente (animações, estado reativo).

### Stack Definida (PRD já decidiu)

O PRD definiu explicitamente a stack, eliminando a necessidade de avaliação de starters alternativos:

- **Next.js 16.1.6** (versão estável atual, fev/2026)
- **TypeScript** — tipagem estática para consistência entre agentes
- **Tailwind CSS** — utility-first, integração nativa com shadcn/ui
- **shadcn/ui** — componentes com Radix UI unificado (atualização fev/2026)
- **Prisma ORM 7.2.0** (versão estável atual, fev/2026) + SQLite
- **bcryptjs 3.0.3** — pure JS, sem binários nativos, ideal para demo ao vivo

### Comando de Inicialização

```bash
npx create-next-app@latest meudinheiro \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

Após a criação:

```bash
# Adicionar shadcn/ui
npx shadcn@latest init

# Adicionar Prisma
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite

# Dependências de auth e segurança
npm install bcryptjs
npm install --save-dev @types/bcryptjs

# Biblioteca de animações
npm install framer-motion

# Biblioteca de toast
npm install sonner

# Biblioteca de formulários
npm install react-hook-form @hookform/resolvers zod
```

### Decisões Arquiteturais Fornecidas pelo Starter

**Linguagem e Runtime:**
- TypeScript strict mode — todos os arquivos `.ts` / `.tsx`
- Node.js runtime (não Edge) para rotas que usam Prisma + bcrypt

**Estilo:**
- Tailwind CSS com configuração padrão + extensões do shadcn/ui
- CSS variables para theming do shadcn/ui em `globals.css`

**Tooling de Build:**
- Next.js sem Turbopack (compatibilidade máxima para demo ao vivo)
- ESLint configurado via `eslint.config.mjs`

**Organização de Código:**
- `src/` como raiz do código-fonte
- Import alias `@/*` para imports absolutos

**Note:** A inicialização do projeto deve ser a primeira história de implementação.

---

## Decisões Arquiteturais Principais

### Análise de Prioridade de Decisões

**Decisões Críticas (bloqueiam implementação):**
- Estratégia de autenticação e modelo de sessão
- Padrão de Server vs Client Components
- Estratégia de mutations e atualização de estado
- Schema do banco de dados

**Decisões Importantes (moldam a arquitetura):**
- Padrão de API Routes vs Server Actions
- Estratégia de validação
- Estrutura de componentes UI

**Decisões Diferidas (pós-MVP):**
- Estratégia de testes automatizados
- CI/CD pipeline
- Monitoring e logging

---

### 1. Arquitetura de Dados

**Banco de Dados:** SQLite via Prisma ORM 7.2.0
- Arquivo único `prisma/dev.db`, sem servidor externo
- Adequado para demo ao vivo e desenvolvimento local

**Schema Prisma:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  sessions     Session[]
  transactions Transaction[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}

model Transaction {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String   // "income" | "expense"
  amount      Float
  category    String
  date        DateTime
  description String?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([userId, date])
}
```

**Estratégia de Validação de Dados:**
- Zod para validação de schema tanto no cliente quanto no servidor
- Schemas compartilhados em `src/lib/validations/`
- Validação server-side SEMPRE obrigatória, independente da validação client-side

**Estratégia de Migração:**
- `npx prisma migrate dev` para desenvolvimento
- `npx prisma migrate deploy` para produção
- Seed via `prisma/seed.ts` (opcional, para dados de demonstração)

**Caching:**
- Sem cache de dados — SQLite local é rápido o suficiente
- `revalidatePath` para invalidação do cache do Next.js após Server Actions

---

### 2. Autenticação e Segurança

**Método de Autenticação:** Session-based com cookies httpOnly

**Decisão:** Implementação própria (sem NextAuth/Auth.js) para controle total e simplicidade de demonstração.

**Fluxo de Autenticação:**

```
Cadastro:
  1. POST /api/auth/register → valida dados → hash de senha → cria User → cria Session → set cookie

Login:
  2. POST /api/auth/login → valida credentials → bcrypt.compare → cria Session → set cookie

Logout:
  3. POST /api/auth/logout → deleta Session do banco → clear cookie

Verificação (Middleware):
  4. middleware.ts → lê cookie sessionId → valida Session no banco → se inválida, redirect /login
```

**Configuração do Cookie:**

```typescript
// Configuração obrigatória para todos os cookies de sessão
{
  name: 'sessionId',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  path: '/'
}
```

**Hashing de Senhas:**
- `bcryptjs@3.0.3` com saltRounds = 12
- NUNCA armazenar senha em texto plano
- NUNCA retornar `passwordHash` em respostas de API

**Isolamento por userId:**
- TODA query ao banco que envolva dados do usuário DEVE incluir `WHERE userId = $currentUserId`
- Nunca confiar em IDs vindos do cliente para acesso a dados — sempre usar o userId da sessão

**Proteção de Rotas via Middleware:**

```typescript
// src/middleware.ts
// Rotas públicas: /login, /register, /api/auth/*
// Rotas protegidas: tudo mais
// Se não autenticado em rota protegida → redirect /login
// Se autenticado em /login ou /register → redirect /dashboard
```

---

### 3. Padrões de API e Comunicação

**Estratégia:** Misto de Server Actions (mutations) + API Routes (auth) + Server Components (queries de leitura)

| Tipo de Operação | Abordagem | Justificativa |
|---|---|---|
| Autenticação (register/login/logout) | API Routes (`/api/auth/*`) | Controle preciso de cookies e respostas HTTP |
| Criar transação | Server Action | Simplicidade, revalidação automática |
| Excluir transação | Server Action | Simplicidade, revalidação automática |
| Listar transações | Server Component | Dados iniciais no servidor, sem round-trip |
| Dashboard totais | Server Component | Cálculo no servidor, sem estado cliente |

**Formato de Resposta das API Routes:**

```typescript
// Sucesso
{ success: true, data: T }

// Erro
{ success: false, error: { message: string, code?: string } }
```

**Códigos HTTP:**
- 200: Sucesso
- 201: Criado com sucesso
- 400: Dados inválidos (validação)
- 401: Não autenticado
- 403: Não autorizado
- 500: Erro interno

**Tratamento de Erros em Server Actions:**

```typescript
// Server Actions retornam objeto tipado, nunca lançam exceções para o cliente
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

---

### 4. Arquitetura Frontend

**Estratégia Server vs Client Components:**

| Componente | Tipo | Razão |
|---|---|---|
| `app/dashboard/page.tsx` | Server Component | Busca dados no servidor |
| `DashboardCards` | Client Component | Animações de números |
| `TransactionList` | Server Component | Renderização inicial |
| `TransactionItem` | Client Component | Animação de entrada, botão de exclusão |
| `NewTransactionModal` | Client Component | Formulário interativo, state |
| `TransactionForm` | Client Component | react-hook-form, validação inline |
| `app/login/page.tsx` | Server Component | Verificação de sessão no servidor |
| `LoginForm` | Client Component | Formulário interativo |
| `AuthLayout` | Server Component | Wrapper estático |
| `AppLayout` | Server Component | Wrapper com nav |
| `ToastProvider` | Client Component | Estado global de toasts |

**Estratégia de State Management:**

- **Sem Redux, Zustand ou Context global** para dados de negócio
- Dados de negócio vivem no servidor (Prisma) — lidos por Server Components
- Após mutations (Server Actions), usar `revalidatePath('/dashboard')` para forçar re-fetch
- Estado local em Client Components apenas para: estado de modal, estado de formulário, estado de loading de botão

**Padrão de Atualização Otimista (opcional para MVP):**
- Pode ser implementado nos cards do dashboard para resposta < 100ms
- Se tempo apertar na live, ignorar e confiar no revalidatePath

**Biblioteca de Animações:** Framer Motion
- `AnimatePresence` para entrada/saída de elementos da lista de transações
- `motion.div` com `layout` prop para reordenação suave
- `useSpring` para animação dos números nos cards

**Biblioteca de Toast:** Sonner
- Configurado no root layout como `<Toaster />`
- Chamado diretamente: `toast.success("Transação criada!")` / `toast.error("Erro ao excluir")`

**Formulários:** react-hook-form + Zod + @hookform/resolvers
- Schema Zod compartilhado entre cliente e servidor
- `resolver: zodResolver(transactionSchema)` no useForm
- Erros exibidos inline via `formState.errors`

**Performance:**
- `loading.tsx` para Suspense boundaries em rotas lentas
- `Skeleton` do shadcn/ui como placeholder de carregamento
- Animações apenas em Client Components — Server Components nunca importam Framer Motion

---

### 5. Infraestrutura e Deployment

**Hosting:** Vercel (padrão para Next.js)
- Comando: `vercel deploy` ou push para branch main com integração GitHub
- Para demo ao vivo: `npm run dev` em localhost é suficiente

**Variáveis de Ambiente:**

```bash
# .env.local (nunca commitado)
DATABASE_URL="file:./dev.db"
SESSION_SECRET="string-aleatoria-longa-para-assinar-sessoes"
NODE_ENV="development"

# .env.example (commitado como referência)
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secret-here"
NODE_ENV="development"
```

**Scripts npm:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

**Monitoring/Logging:** Não aplicável para MVP de demo ao vivo. `console.error` em erros de servidor para debugging.

---

## Padrões de Implementação e Regras de Consistência

### Pontos de Conflito Identificados

8 áreas onde agentes de IA poderiam fazer escolhas diferentes e gerar código incompatível.

---

### Padrões de Nomenclatura

**Banco de Dados (Prisma Schema):**
- Modelos: PascalCase singular → `User`, `Session`, `Transaction`
- Campos: camelCase → `userId`, `passwordHash`, `createdAt`
- Índices: implícitos via `@@index`, nomenclatura gerada pelo Prisma
- Enum values representados como `string` literals → `"income"` / `"expense"`

**API e Rotas:**
- API Routes: kebab-case → `/api/auth/register`, `/api/auth/login`
- Server Actions: camelCase no nome da função → `createTransaction`, `deleteTransaction`
- Parâmetros de rota Next.js: kebab-case → `[transaction-id]`

**Código TypeScript:**
- Componentes React: PascalCase → `TransactionCard`, `DashboardHeader`
- Arquivos de componente: PascalCase → `TransactionCard.tsx`
- Arquivos de lib/util: camelCase → `auth.ts`, `db.ts`, `validations.ts`
- Funções e variáveis: camelCase → `getUserSession`, `currentUserId`
- Types e Interfaces: PascalCase → `TransactionType`, `UserSession`
- Constantes globais: SCREAMING_SNAKE_CASE → `INCOME_CATEGORIES`, `EXPENSE_CATEGORIES`

**Exemplos:**
```typescript
// ✅ CORRETO
const userId = session.userId
const passwordHash = await bcrypt.hash(password, 12)
type TransactionType = 'income' | 'expense'
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Outros'] as const

// ❌ ERRADO
const user_id = session.user_id
const passwordhash = await bcrypt.hash(password, 12)
type transactiontype = 'income' | 'expense'
```

---

### Padrões de Estrutura

**Organização de Componentes:**
- `src/components/ui/` — componentes shadcn/ui (gerados, não editar manualmente)
- `src/components/` — componentes da aplicação (auth, transactions, dashboard, shared)
- Cada "feature" tem sua pasta: `auth/`, `transactions/`, `dashboard/`
- Componentes compartilhados entre features: `src/components/shared/`

**Organização de Server Actions:**
- Pasta: `src/actions/` com um arquivo por domínio
- `src/actions/transactions.ts` — createTransaction, deleteTransaction
- Todos os arquivos de actions têm `'use server'` no topo

**Organização de Lib:**
- `src/lib/db.ts` — instância singleton do Prisma Client
- `src/lib/auth.ts` — funções de autenticação (getSession, createSession, etc.)
- `src/lib/validations/` — schemas Zod compartilhados

**Testes:**
- Co-localizados: `*.test.ts` / `*.test.tsx` ao lado do arquivo testado
- E2E: `tests/e2e/` na raiz (fora de `src/`)
- **MVP: testes não são obrigatórios** — foco em estabilidade para demo ao vivo

---

### Padrões de Formato

**Respostas de API Routes:**
```typescript
// Sempre usar este formato
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } }
```

**Retorno de Server Actions:**
```typescript
// Sempre retornar, nunca throw para o cliente
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
```

**Formato de Datas:**
- Armazenamento no banco: `DateTime` (ISO 8601 via Prisma)
- Exibição na UI: `toLocaleDateString('pt-BR')` → "26/02/2026"
- Input em formulários: `<input type="date">` → string "YYYY-MM-DD"
- Conversão: `new Date(dateString)` ao salvar no banco

**Valores Monetários:**
- Armazenamento: `Float` no banco (ex: `1234.56`)
- Input: campo de texto com validação de número positivo
- Exibição: `new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)`

---

### Padrões de Comunicação

**Categorias Fixas (constantes compartilhadas):**
```typescript
// src/lib/constants.ts
export const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Outros'] as const
export const EXPENSE_CATEGORIES = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Outros'] as const
export type IncomeCategory = typeof INCOME_CATEGORIES[number]
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]
export type TransactionType = 'income' | 'expense'
```

**Padrão de State Management após Mutations:**
```typescript
// Em Server Actions: sempre revalidar o path após mutação bem-sucedida
import { revalidatePath } from 'next/cache'
// ...após criar/excluir transação:
revalidatePath('/dashboard')
```

**Padrão de Toast após Ação do Usuário:**
```typescript
// No Client Component que chama a Server Action:
const result = await createTransaction(data)
if (result.success) {
  toast.success('Transação registrada!')
} else {
  toast.error(result.error)
}
```

---

### Padrões de Processo

**Tratamento de Erros:**
```typescript
// Server Actions: try/catch SEMPRE, retornar ActionResult
export async function createTransaction(data: FormData): Promise<ActionResult> {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: 'Não autorizado' }
    // ... lógica
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('[createTransaction]', error)
    return { success: false, error: 'Erro ao criar transação' }
  }
}
```

**Loading States:**
- Botão de submit: `disabled` + texto alterado durante submissão
- `useFormStatus` do React para estado de pending em botões dentro de forms
- Skeleton do shadcn/ui para carregamento inicial de dados

**Validação:**
- Schema Zod definido em `src/lib/validations/`
- Validado no cliente via react-hook-form (UX)
- Validado novamente no servidor via `schema.safeParse()` (segurança)
- NUNCA confiar apenas na validação do cliente

**Regras obrigatórias para todos os agentes:**
- Todo acesso a dados de transação DEVE filtrar por `userId` da sessão
- Toda Server Action DEVE verificar autenticação antes de qualquer operação
- Senhas NUNCA retornam em respostas — filtrar `passwordHash` de queries
- Erros de banco NUNCA retornam mensagens brutas para o cliente

---

## Estrutura do Projeto e Limites

### Estrutura Completa de Diretórios

```
meudinheiro/
├── README.md
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── components.json                    # Configuração do shadcn/ui
├── .env.local                         # Nunca commitado
├── .env.example                       # Commitado como referência
├── .gitignore
│
├── prisma/
│   ├── schema.prisma                  # Schema do banco
│   ├── dev.db                         # SQLite (nunca commitado)
│   └── migrations/                    # Histórico de migrations
│
├── public/
│   └── favicon.ico
│
└── src/
    ├── middleware.ts                   # Proteção de rotas (auth check)
    │
    ├── app/
    │   ├── globals.css                # Variáveis CSS do shadcn/ui + Tailwind
    │   ├── layout.tsx                 # Root layout com ToastProvider
    │   │
    │   ├── (auth)/                    # Route group — sem layout de app
    │   │   ├── login/
    │   │   │   └── page.tsx           # Página de login (Server Component)
    │   │   └── register/
    │   │       └── page.tsx           # Página de cadastro (Server Component)
    │   │
    │   ├── (app)/                     # Route group — com layout autenticado
    │   │   ├── layout.tsx             # App layout com navegação
    │   │   └── dashboard/
    │   │       ├── page.tsx           # Dashboard (Server Component — busca dados)
    │   │       └── loading.tsx        # Skeleton de carregamento
    │   │
    │   └── api/
    │       └── auth/
    │           ├── register/
    │           │   └── route.ts       # POST /api/auth/register
    │           ├── login/
    │           │   └── route.ts       # POST /api/auth/login
    │           └── logout/
    │               └── route.ts       # POST /api/auth/logout
    │
    ├── actions/
    │   └── transactions.ts            # createTransaction, deleteTransaction
    │
    ├── components/
    │   ├── ui/                        # Gerados pelo shadcn/ui (não editar)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── select.tsx
    │   │   ├── skeleton.tsx
    │   │   └── sonner.tsx
    │   │
    │   ├── auth/
    │   │   ├── LoginForm.tsx          # Client Component — formulário de login
    │   │   └── RegisterForm.tsx       # Client Component — formulário de cadastro
    │   │
    │   ├── dashboard/
    │   │   ├── DashboardCards.tsx     # Client Component — 3 cards animados
    │   │   ├── TransactionList.tsx    # Client Component — lista com AnimatePresence
    │   │   ├── TransactionItem.tsx    # Client Component — item com botão de exclusão
    │   │   └── NewTransactionButton.tsx # Client Component — abre modal
    │   │
    │   ├── transactions/
    │   │   ├── TransactionModal.tsx   # Client Component — modal com formulário
    │   │   └── TransactionForm.tsx    # Client Component — react-hook-form + Zod
    │   │
    │   └── shared/
    │       ├── AppHeader.tsx          # Server Component — header com logout
    │       └── LoadingSpinner.tsx     # Componente de loading genérico
    │
    ├── lib/
    │   ├── db.ts                      # Prisma Client singleton
    │   ├── auth.ts                    # getSession, createSession, deleteSession, hashPassword, comparePassword
    │   ├── constants.ts               # INCOME_CATEGORIES, EXPENSE_CATEGORIES, TransactionType
    │   └── validations/
    │       ├── auth.ts                # Zod schemas: loginSchema, registerSchema
    │       └── transaction.ts         # Zod schemas: createTransactionSchema
    │
    └── types/
        └── index.ts                   # Types globais compartilhados
```

### Limites Arquiteturais

**Limites de API:**
- `/api/auth/*` → Autenticação apenas (sem manipulação de transações)
- `/app/(app)/dashboard` → Rota protegida pelo middleware
- `/app/(auth)/*` → Rotas públicas, redirect se autenticado

**Limites de Componentes:**
- `src/components/ui/` → Apenas componentes shadcn/ui, nunca lógica de negócio
- Server Components NÃO importam: framer-motion, react-hook-form, hooks de estado
- Client Components com `'use client'` declarado no topo quando necessário

**Limites de Dados:**
- `src/lib/db.ts` → Único ponto de acesso ao Prisma (singleton)
- Queries ao banco APENAS em: Server Components, Server Actions, API Routes
- NUNCA fazer queries ao banco em Client Components

**Limites de Segurança:**
- `userId` SEMPRE extraído da sessão no servidor, NUNCA do request body
- `passwordHash` NUNCA incluído em respostas de API ou props de componentes

### Mapeamento de Requisitos para Estrutura

**Autenticação (FR1-5):**
- API Routes: `src/app/api/auth/`
- Lógica: `src/lib/auth.ts`
- Componentes: `src/components/auth/`
- Proteção: `src/middleware.ts`

**Gestão de Transações (FR6-12):**
- Server Actions: `src/actions/transactions.ts`
- Componentes: `src/components/transactions/` + `src/components/dashboard/`
- Validação: `src/lib/validations/transaction.ts`
- Constantes: `src/lib/constants.ts`

**Dashboard (FR13-17):**
- Página: `src/app/(app)/dashboard/page.tsx`
- Componentes: `src/components/dashboard/`
- Loading: `src/app/(app)/dashboard/loading.tsx`

**Feedback e Experiência (FR18-21):**
- Toast: Sonner configurado em `src/app/layout.tsx`
- Animações: Framer Motion nos Client Components do dashboard
- Validação inline: react-hook-form em `TransactionForm.tsx`

### Fluxo de Dados

```
Usuário → Client Component → Server Action → Prisma → SQLite
                    ↑                ↓
              Atualização      revalidatePath
              de UI local    → Re-render Server Component
```

**Fluxo de Autenticação:**
```
Browser → middleware.ts → verifica cookie sessionId →
  Se válido: prossegue para rota
  Se inválido: redirect /login
```

---

## Resultados da Validação de Arquitetura

### Validação de Coerência ✅

**Compatibilidade das Decisões:**
- Next.js 16.1.6 + Prisma 7.2.0 + SQLite: combinação testada e compatível
- bcryptjs (pure JS) funciona sem configuração nativa — ideal para demo ao vivo
- Framer Motion + Next.js App Router: compatível, requer `'use client'` nos componentes animados
- react-hook-form + Zod + shadcn/ui Form: combinação padrão da comunidade, bem documentada
- Sonner: biblioteca de toast recomendada pela própria shadcn/ui

**Consistência dos Padrões:**
- Convenções de nomenclatura consistentes entre banco, API e código TypeScript
- Separação clara Server/Client Components suporta NFR de performance (60fps)
- Padrão ActionResult unificado elimina inconsistências de tratamento de erro

**Alinhamento da Estrutura:**
- Estrutura de diretórios alinhada com convenções do Next.js App Router
- Route groups `(auth)` e `(app)` eliminam necessidade de lógica de layout duplicada
- Singleton do Prisma Client previne múltiplas conexões em desenvolvimento

### Validação de Cobertura de Requisitos ✅

**Cobertura Funcional:**
- FR1-5 (Auth): cobertos por `/api/auth/*`, `lib/auth.ts` e `middleware.ts`
- FR6-10 (Transações): cobertos por `actions/transactions.ts` e componentes de formulário
- FR11-12 (Categorias): cobertos por `lib/constants.ts` com tipos TypeScript
- FR13-17 (Dashboard): cobertos por `dashboard/page.tsx` (Server Component) + componentes reativos
- FR18-21 (Feedback): cobertos por Framer Motion + Sonner + react-hook-form

**Cobertura Não-Funcional:**
- **Performance < 300ms:** Server Actions + revalidatePath é mais rápido que round-trip de API
- **60fps:** Animações isoladas em Client Components, sem bloquear Server Components
- **Segurança bcrypt + cookies httpOnly:** `lib/auth.ts` + configuração de cookie documentada
- **WCAG AA:** shadcn/ui é acessível por padrão, labels e aria-live documentados como obrigatórios

### Validação de Prontidão para Implementação ✅

**Completude das Decisões:**
- Todas as decisões críticas documentadas com versões verificadas
- Comandos exatos de instalação e configuração fornecidos
- Schema Prisma completo pronto para usar

**Completude da Estrutura:**
- Todos os arquivos e diretórios mapeados
- Sem lacunas na estrutura — cada FR tem um local específico

**Completude dos Padrões:**
- Naming conventions cobrindo banco, API e código
- Padrões de error handling para Server Actions e API Routes
- Padrões de state management após mutations documentados com exemplos

### Análise de Lacunas

**Lacunas Críticas:** Nenhuma identificada.

**Lacunas Importantes:**
- Testes automatizados: intencionalmente fora do escopo do MVP (demo ao vivo tem prioridade)
- Refresh automático de token/sessão: sessão de 7 dias é suficiente para o contexto

**Lacunas Nice-to-Have:**
- Docker Compose para ambiente de desenvolvimento reproduzível
- Storybook para documentação de componentes
- Bundle analyzer para otimizações futuras

### Checklist de Completude da Arquitetura

**✅ Análise de Requisitos**
- [x] Contexto do projeto analisado em profundidade
- [x] Escala e complexidade avaliados (baixa)
- [x] Restrições técnicas identificadas (SQLite, sem WebSockets, stack pré-definida)
- [x] Preocupações transversais mapeadas (auth, state, animações, validação, segurança)

**✅ Decisões Arquiteturais**
- [x] Decisões críticas documentadas com versões verificadas
- [x] Stack tecnológica completamente especificada
- [x] Padrões de integração definidos (Server Actions vs API Routes)
- [x] Considerações de performance endereçadas

**✅ Padrões de Implementação**
- [x] Convenções de nomenclatura estabelecidas (banco, API, código)
- [x] Padrões de estrutura definidos (organização de pastas)
- [x] Padrões de comunicação especificados (ActionResult, toast)
- [x] Padrões de processo documentados (error handling, loading states, validação)

**✅ Estrutura do Projeto**
- [x] Estrutura completa de diretórios definida (todos os arquivos)
- [x] Limites de componentes estabelecidos (Server vs Client, ui vs features)
- [x] Pontos de integração mapeados (middleware, actions, db)
- [x] Mapeamento de requisitos para estrutura completo

### Avaliação de Prontidão da Arquitetura

**Status Geral:** PRONTO PARA IMPLEMENTAÇÃO ✅

**Nível de Confiança:** Alto

**Principais Pontos Fortes:**
- Stack battle-tested com versões verificadas e compatibilidade confirmada
- Separação clara de responsabilidades (Server/Client Components, Actions/Routes/Queries)
- Padrões de segurança explícitos e obrigatórios (userId isolation, cookie httpOnly, bcrypt)
- Estrutura de pastas alinhada com convenções do Next.js App Router
- Escopo MVP bem delimitado — sem scope creep arquitetural

**Áreas para Melhoria Futura:**
- Adicionar testes automatizados (Vitest + Playwright) em fase pós-MVP
- Implementar refresh automático de sessão para produção
- Adicionar rate limiting em `/api/auth/*` para produção

### Handoff para Implementação

**Diretrizes para Agentes de IA:**
- Seguir todas as decisões arquiteturais exatamente como documentadas
- Usar os padrões de implementação consistentemente em todos os componentes
- Respeitar a estrutura do projeto e os limites arquiteturais
- Consultar este documento para todas as dúvidas arquiteturais
- `userId` SEMPRE da sessão, NUNCA do corpo da requisição

**Primeira Prioridade de Implementação:**

```bash
# 1. Inicializar o projeto
npx create-next-app@latest meudinheiro --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack

# 2. Entrar no diretório e instalar dependências
cd meudinheiro
npx shadcn@latest init
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
npm install bcryptjs framer-motion sonner react-hook-form @hookform/resolvers zod
npm install --save-dev @types/bcryptjs

# 3. Configurar schema Prisma e criar migration inicial
# (copiar schema do documento de arquitetura)
npx prisma migrate dev --name init
```
