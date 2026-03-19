---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - product-brief-live-01.md
  - prd.md
  - ux-design-specification.md
  - brainstorming-session-2026-03-19-1500.md
workflowType: 'architecture'
project_name: 'live-01'
user_name: 'Davidson'
date: '2026-03-19'
lastStep: 8
status: 'complete'
completedAt: '2026-03-19'
---

# Architecture Decision Document — MeuDinheiro

**Author:** Davidson
**Date:** 2026-03-19

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

30 requisitos funcionais organizados em 7 categorias:

| Categoria | FRs | Impacto Arquitetural |
|-----------|-----|---------------------|
| **User Management** (FR1-FR5) | Cadastro, login, logout, onboarding (renda), categorias automáticas | Camada de autenticação, middleware de sessão, seed de dados por usuário |
| **Dashboard & Visualização** (FR6-FR11) | Saldo, ocultar valores, semáforo, resumo mensal, últimas transações, ações rápidas | Agregações no backend (soma receitas/despesas), estado de UI (toggle olho), lógica de semáforo (thresholds vs renda) |
| **Registro de Transações** (FR12-FR17) | Despesa/receita, descrição opcional, categorias visuais, confirmação, FAB global | Bottom sheet como componente modal, Server Actions para persistência, revalidação do dashboard |
| **Histórico de Transações** (FR18-FR22) | Lista, filtro por período, total consolidado, exclusão, undo | Queries filtradas por data, soft delete ou toast timer, invalidação de cache |
| **Perfil & Preferências** (FR23-FR25) | Avatar iniciais, toggle tema, configurações | Persistência de tema (localStorage), componente avatar derivado do nome |
| **Navegação** (FR26-FR27) | Bottom nav 3 abas, indicador ativo | Layout compartilhado com nav fixa, client-side routing |
| **Feedback Visual** (FR28-FR30) | Skeleton loading, animações, saudação personalizada | Suspense boundaries, Framer Motion integration, dados de sessão no header |

**Non-Functional Requirements:**

17 NFRs em 3 categorias com impacto direto na arquitetura:

| Categoria | NFRs Críticos | Decisão Arquitetural Implicada |
|-----------|---------------|-------------------------------|
| **Performance** (NFR1-NFR8) | Lighthouse >= 90, FCP < 1.5s, LCP < 2.5s, CLS < 0.1, bundle < 200KB, 60fps, touch < 100ms | Code splitting agressivo, dynamic imports para bottom sheet/transações, otimização de bundle, CSS-first animations onde possível |
| **Security** (NFR9-NFR12) | bcryptjs salt >= 10, rotas protegidas, validação zod server-side, sem dados sensíveis em responses | Middleware de auth, Server Actions com validação, sanitização de responses |
| **Accessibility** (NFR13-NFR17) | WCAG AA contraste, semantic HTML, focus visible, touch 48px, prefers-reduced-motion | Componentes acessíveis (Radix UI base), media queries para motion, aria-labels |

**Scale & Complexity:**

- Primary domain: Full-stack web (frontend-heavy)
- Complexity level: Baixa
- Estimated architectural components: ~15-20 componentes React + 3 tabelas Prisma + ~8 Server Actions

### Technical Constraints & Dependencies

| Constraint | Origem | Impacto |
|-----------|--------|---------|
| **Stack fixa** | PRD + já instalada | Next.js 16, React, TypeScript, Tailwind, shadcn/ui, Prisma, SQLite, Framer Motion, Sonner, bcryptjs, react-hook-form, zod |
| **SQLite como banco** | Decisão de simplicidade | Sem migrations complexas, sem connection pooling, limitações em queries concorrentes (aceitável para single-user) |
| **Sem infra externa** | Escopo MVP | Sem deploy cloud, sem APIs terceiras, sem serviços de email, sem analytics |
| **Single developer** | Recurso do projeto | Arquitetura deve ser simples de manter, sem over-engineering |
| **Projeto de portfólio/live** | Contexto do negócio | Priorizar visual polish e demo-ability sobre robustez de produção |
| **Mobile-first** | Requisito UX core | Touch-first, zona do polegar, bottom nav, container max-width 428px |

### Cross-Cutting Concerns Identified

| Concern | Componentes Afetados | Estratégia |
|---------|---------------------|-----------|
| **Autenticação/Sessão** | Todas as rotas, Server Actions, middleware | Middleware Next.js para proteger rotas, sessão em cookie/token |
| **Validação** | Formulários (client) + Server Actions (server) | Schemas zod compartilhados entre client e server |
| **Sistema de Tema** | Todos os componentes visuais | CSS variables em globals.css, dark como padrão, toggle via class |
| **Animações** | Dashboard, bottom sheet, transações, loading | Framer Motion com `prefers-reduced-motion` check global |
| **Tratamento de Erros** | Server Actions, formulários | Toast (Sonner) como feedback universal, validação zod para erros de forma |
| **Formatação Monetária** | Saldo, transações, teclado numérico, resumo | Utility function centralizada (Intl.NumberFormat pt-BR) |
| **Acessibilidade** | Todos os componentes interativos | Radix UI como base (aria built-in), focus management, semantic HTML |

---

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Next.js App Router) — identificado com base nos requisitos do PRD e stack já definida.

### Starter Options Considered

| Opção | Descrição | Avaliação |
|-------|-----------|-----------|
| **create-next-app** | CLI oficial do Next.js | Starter padrão, suporte a App Router, TypeScript, Tailwind, ESLint built-in |
| **T3 Stack (create-t3-app)** | Next.js + tRPC + Prisma + NextAuth | Over-engineering para o escopo — tRPC e NextAuth adicionam complexidade desnecessária |
| **Manual setup** | Configurar do zero | Desperdício de tempo, sem vantagem para este escopo |

### Selected Starter: create-next-app (Next.js 16)

**Rationale:** O projeto já foi inicializado com `create-next-app`. A stack (Next.js 16, TypeScript, Tailwind, ESLint) já está configurada. shadcn/ui já está instalado com estilo New York. Prisma e todas as dependências já estão no `package.json`. Não há decisão de starter a tomar — o projeto já existe.

**Initialization Command (já executado):**

```bash
npx create-next-app@latest live-01 --typescript --tailwind --eslint --app --src-dir
```

**Architectural Decisions Provided by Starter:**

| Aspecto | Decisão | Status |
|---------|---------|--------|
| **Language & Runtime** | TypeScript strict mode, Node.js | Já configurado |
| **Styling** | Tailwind CSS v4 + CSS variables | Já configurado |
| **Build Tooling** | Next.js built-in (Turbopack dev, Webpack prod) | Já configurado |
| **Routing** | App Router (file-based routing) | Já configurado |
| **Component Library** | shadcn/ui (New York style, neutral base, CSS variables) | Já instalado |
| **ORM** | Prisma 7.2.0 + @prisma/client + SQLite | Já instalado |
| **Linting** | ESLint com config Next.js | Já configurado |

**Note:** O primeiro story de implementação deve configurar o schema Prisma, as CSS variables de tema e o layout base — não inicializar o projeto.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Bloqueiam Implementação):**
1. Estratégia de autenticação e sessão
2. Schema do banco de dados (Prisma)
3. Padrão de data fetching (Server Components vs Client)
4. Estrutura de rotas e layout

**Important Decisions (Moldam a Arquitetura):**
5. Padrão de Server Actions
6. Estratégia de estado do cliente
7. Abordagem de animações
8. Organização de componentes

**Deferred Decisions (Pós-MVP):**
- CI/CD pipeline
- Estratégia de deploy (Vercel, etc.)
- Monitoramento e logging
- PWA/Service Worker

### Data Architecture

**Database: SQLite via Prisma 7.2.0**

Schema com 3 tabelas:

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  password      String        // bcryptjs hash
  name          String
  monthlyIncome Float
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  categories    Category[]
  transactions  Transaction[]
}

model Category {
  id           String        @id @default(cuid())
  name         String
  icon         String        // emoji
  color        String        // hex color
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  type        String   // "income" | "expense"
  description String?
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@index([userId, createdAt])
  @@index([userId, type])
}
```

**Decisões de Data:**

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| **IDs** | CUID (string) | Seguro, URL-friendly, sem sequencial exposto |
| **Datas** | DateTime (ISO) | Prisma padrão, sem complexidade de timezone |
| **Valores monetários** | Float | Suficiente para finanças pessoais (sem centavos de centavo) |
| **Tipo de transação** | String enum ("income"/"expense") | Simples, extensível, sem migration para adicionar tipos |
| **Soft delete** | Não | Delete real + toast com undo (3s timer client-side). Simplicidade > recovery |
| **Categorias** | Por usuário com seed | 7 categorias padrão criadas no cadastro, unique por (userId, name) |

**Prisma Client — Singleton:**

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Authentication & Security

**Decisão: Cookie-based session com JWT simples**

| Aspecto | Decisão | Rationale |
|---------|---------|-----------|
| **Método** | Email + senha (bcryptjs) | Requisito do PRD, simples e suficiente |
| **Sessão** | JWT em httpOnly cookie | Seguro, stateless, sem banco de sessões |
| **Middleware** | Next.js middleware para proteger rotas | Intercepta antes de renderizar |
| **Hash** | bcryptjs, salt rounds = 10 | Padrão seguro, performance aceitável |
| **Validação** | Zod schemas server-side em todas as actions | Nunca confiar no client |
| **Lib JWT** | jose (edge-compatible) | Funciona no middleware Next.js (edge runtime) |

**Rotas públicas:** `/login`, `/register`
**Rotas protegidas:** Todas as outras (`/`, `/transactions`, `/profile`)

**Fluxo de Auth:**
1. Register: valida email/senha (zod) → hash senha (bcryptjs) → cria user + categorias → gera JWT → set cookie → redirect `/`
2. Login: valida email/senha → busca user → compara hash → gera JWT → set cookie → redirect `/`
3. Middleware: lê cookie → verifica JWT → extrai userId → permite ou redirect `/login`
4. Logout: limpa cookie → redirect `/login`

### API & Communication Patterns

**Decisão: Server Actions (sem API Routes)**

| Aspecto | Decisão | Rationale |
|---------|---------|-----------|
| **Data mutations** | Server Actions (`"use server"`) | Zero boilerplate, type-safe, integrado ao Next.js |
| **Data fetching** | Server Components diretos | Acesso direto ao Prisma sem API intermediária |
| **API Routes** | Não usar | Sem necessidade — não há clientes externos |
| **Formato de resposta** | `{ success: boolean, data?: T, error?: string }` | Padrão simples para todas as actions |
| **Revalidação** | `revalidatePath("/")` após mutations | Atualiza dashboard automaticamente |

**Server Action Pattern:**

```typescript
// src/actions/transactions.ts
"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().cuid(),
  description: z.string().optional(),
})

export async function createTransaction(data: z.infer<typeof createTransactionSchema>) {
  const session = await getSession()
  if (!session) return { success: false, error: "Não autorizado" }

  const parsed = createTransactionSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: "Dados inválidos" }

  const transaction = await prisma.transaction.create({
    data: { ...parsed.data, userId: session.userId },
  })

  revalidatePath("/")
  revalidatePath("/transactions")
  return { success: true, data: transaction }
}
```

### Frontend Architecture

**Decisão: Server Components por padrão, Client Components onde necessário**

| Aspecto | Decisão | Rationale |
|---------|---------|-----------|
| **Rendering padrão** | Server Components | Melhor performance, menos JS no client |
| **Client Components** | Apenas para interatividade | Bottom sheet, FAB, counter animation, toggle tema, filtros |
| **State management** | React state local (useState) | Sem Redux, sem Zustand — estado é simples |
| **Form handling** | react-hook-form + zod (client) + Server Actions (server) | Validação dupla, UX responsiva |
| **Animações** | Framer Motion (client components) | `"use client"` nos componentes animados |
| **Toast** | Sonner (provider no layout) | Feedback global, configurado uma vez |
| **Tema** | CSS variables + class toggle | `next-themes` ou manual com localStorage |
| **Dynamic imports** | Bottom sheet, teclado numérico | Reduz bundle initial — carrega on-demand |

**Padrão de Server vs Client Components:**

```
Server Components (default):
├── Layout principal (busca sessão)
├── Dashboard page (busca dados agregados)
├── Transaction list (busca transações)
└── Profile page (busca dados do user)

Client Components ("use client"):
├── BottomSheet (interatividade: drag, tabs, input)
├── FAB (onClick handler)
├── HeroCard (counter animation, toggle olho)
├── NumericKeypad (estado do valor digitado)
├── CategoryGrid (seleção de categoria)
├── TransactionItem (swipe gesture)
├── FilterPills (estado do filtro ativo)
├── BottomNavBar (indicador ativo)
├── ThemeToggle (localStorage + class)
└── AnimatedCounter (Framer Motion)
```

**Bundle Optimization:**

```typescript
// Dynamic imports para componentes pesados
const BottomSheet = dynamic(() => import("@/components/bottom-sheet"), {
  loading: () => null, // FAB visível, sheet carrega on-demand
})
```

### Infrastructure & Deployment

| Aspecto | Decisão | Rationale |
|---------|---------|-----------|
| **Development** | `next dev --turbopack` | Fast refresh, Turbopack para velocidade |
| **Database dev** | SQLite local (arquivo `prisma/dev.db`) | Zero setup, arquivo no `.gitignore` |
| **Environment** | `.env.local` para secrets (JWT_SECRET) | Padrão Next.js |
| **Deploy MVP** | Local / Vercel (futuro) | MVP roda local para live |
| **CI/CD** | Não no MVP | Deferred — single dev, sem necessidade |

### Decision Impact Analysis

**Implementation Sequence:**
1. Schema Prisma + migrations + seed de categorias
2. Auth (register, login, middleware, sessão)
3. Layout base (bottom nav, container, tema dark)
4. Dashboard (Server Component + HeroCard client)
5. Bottom sheet + FAB (registro de transações)
6. Tela de transações (lista, filtros, swipe delete)
7. Perfil (avatar, toggle tema)
8. Polish (animações, skeleton, counter)

**Cross-Component Dependencies:**

| Componente | Depende de |
|-----------|-----------|
| Dashboard | Auth (sessão), Prisma (queries), HeroCard (client) |
| Bottom Sheet | Auth (sessão), Server Actions (mutations), CategoryGrid |
| Transações | Auth (sessão), Prisma (queries), FilterPills (client) |
| Tema | CSS variables (globals.css), localStorage |

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

15 áreas onde agentes IA poderiam tomar decisões diferentes — todas padronizadas abaixo.

### Naming Patterns

**Database Naming (Prisma):**

| Elemento | Convenção | Exemplo |
|---------|-----------|---------|
| Model names | PascalCase, singular | `User`, `Transaction`, `Category` |
| Field names | camelCase | `userId`, `monthlyIncome`, `createdAt` |
| Relations | camelCase, nome descritivo | `user`, `categories`, `transactions` |
| Indexes | `@@index([fields])` | `@@index([userId, createdAt])` |

**Code Naming (TypeScript/React):**

| Elemento | Convenção | Exemplo |
|---------|-----------|---------|
| Components | PascalCase | `HeroCard`, `BottomSheet`, `NumericKeypad` |
| Component files | kebab-case.tsx | `hero-card.tsx`, `bottom-sheet.tsx` |
| Hooks | camelCase com `use` prefix | `useSession`, `useTheme` |
| Server Actions | camelCase, verbo + substantivo | `createTransaction`, `deleteTransaction` |
| Action files | kebab-case.ts | `transactions.ts`, `auth.ts` |
| Utility functions | camelCase | `formatCurrency`, `getMonthRange` |
| Utility files | kebab-case.ts | `format.ts`, `date.ts` |
| Types/Interfaces | PascalCase | `Transaction`, `CreateTransactionInput` |
| Type files | kebab-case.ts | `transaction.ts`, `auth.ts` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_CATEGORIES`, `SALT_ROUNDS` |
| CSS variables | kebab-case com `--` prefix | `--background`, `--primary`, `--card` |

**Route Naming (Next.js App Router):**

| Rota | Path | Arquivo |
|------|------|---------|
| Dashboard | `/` | `src/app/(app)/page.tsx` |
| Transações | `/transactions` | `src/app/(app)/transactions/page.tsx` |
| Perfil | `/profile` | `src/app/(app)/profile/page.tsx` |
| Login | `/login` | `src/app/(auth)/login/page.tsx` |
| Register | `/register` | `src/app/(auth)/register/page.tsx` |

### Structure Patterns

**Component Organization: por tipo (flat, não nested por feature)**

Rationale: com ~15-20 componentes no total, organizar por feature cria pastas com 1-2 arquivos cada. Flat por tipo é mais navegável neste escopo.

```
src/components/
├── ui/              # shadcn/ui components (gerenciado pelo CLI)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── tabs.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   └── switch.tsx
├── hero-card.tsx     # Dashboard: saldo com semáforo
├── transaction-item.tsx  # Item de transação na lista
├── bottom-sheet.tsx  # Modal de registro de transação
├── numeric-keypad.tsx  # Teclado numérico custom
├── category-grid.tsx  # Grid de seleção de categoria
├── fab.tsx           # Floating Action Button
├── bottom-nav.tsx    # Bottom navigation bar
├── filter-pills.tsx  # Pills de filtro (Hoje/Semana/Mês)
├── animated-counter.tsx  # Counter animation wrapper
├── theme-toggle.tsx  # Toggle dark/light mode
└── user-avatar.tsx   # Avatar com iniciais
```

**Co-location de tests:** Testes unitários co-locados com `*.test.tsx` ao lado do componente. Sem pasta `__tests__/` separada.

### Format Patterns

**Server Action Response Format:**

```typescript
// SEMPRE retornar este formato
type ActionResponse<T = void> = {
  success: boolean
  data?: T
  error?: string
}
```

**Formato Monetário:**

```typescript
// src/lib/format.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
```

**Formato de Datas:**

```typescript
// src/lib/date.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
```

### Communication Patterns

**Estado Global: Nenhum**

Não usar Redux, Zustand ou Context global. Estado é local:

| Estado | Onde vive | Motivo |
|--------|----------|--------|
| Sessão do usuário | Cookie (server-side) | Middleware lê, Server Components acessam |
| Tema (dark/light) | localStorage + class no `<html>` | Client-only, persiste entre sessões |
| Valores ocultos | useState no HeroCard | UI-only, não persiste |
| Filtro ativo | useState no FilterPills | UI-only, reseta ao navegar |
| Valor do teclado | useState no BottomSheet | Reseta ao fechar |
| Categoria selecionada | useState no BottomSheet | Reseta ao fechar |

**Data Fetching Pattern:**

```typescript
// Server Component — busca dados direto no Prisma
// src/app/(app)/page.tsx
export default async function DashboardPage() {
  const session = await getSession()
  const balance = await getBalance(session.userId)
  const recentTransactions = await getRecentTransactions(session.userId, 5)

  return (
    <main>
      <HeroCard balance={balance} income={session.monthlyIncome} />
      {/* ... */}
    </main>
  )
}
```

### Process Patterns

**Error Handling:**

| Camada | Padrão | Exemplo |
|--------|--------|---------|
| **Server Action** | Try/catch → retorna `{ success: false, error }` | Nunca throw no action |
| **Client** | Checa `result.success` → toast de erro se false | `toast.error(result.error)` |
| **Formulário** | Zod validation → mostra erro inline | react-hook-form `errors` object |
| **Middleware** | Redirect para `/login` se não autenticado | Nunca mostra erro, redireciona |

**Loading States:**

| Contexto | Padrão |
|---------|--------|
| **Page load** | `loading.tsx` com Skeleton components |
| **Server Action em andamento** | `useTransition` → botão disabled + spinner |
| **Dados do dashboard** | Skeleton shapes que espelham o layout final |

**Toast Usage:**

```typescript
// Sucesso em ação
toast.success("Transação salva")

// Erro em ação
toast.error("Erro ao salvar transação")

// Delete com undo
toast("Transação excluída", {
  action: {
    label: "Desfazer",
    onClick: () => undoDelete(id),
  },
  duration: 3000,
})
```

### Enforcement Guidelines

**Todos os agentes IA DEVEM:**

1. Usar `"use server"` apenas em arquivos dentro de `src/actions/`
2. Validar TODA entrada com zod antes de persistir (server-side)
3. Retornar `ActionResponse<T>` de todas as Server Actions
4. Usar `formatCurrency()` para QUALQUER valor monetário exibido
5. Adicionar `"use client"` apenas em componentes que precisam de interatividade
6. Respeitar a hierarquia: Server Component busca dados → passa props → Client Component renderiza
7. Usar Sonner (toast) para TODA confirmação/erro de ação do usuário
8. Componentes interativos devem ter touch targets >= 48px
9. Animações devem respeitar `prefers-reduced-motion`
10. Nunca expor senha, JWT secret ou dados sensíveis em responses

### Pattern Examples

**Bom:**
```typescript
// Server Component busca dados, Client Component anima
// page.tsx (server)
const balance = await getBalance(userId)
return <HeroCard balance={balance} />

// hero-card.tsx (client)
"use client"
export function HeroCard({ balance }: { balance: number }) {
  return <AnimatedCounter value={balance} />
}
```

**Anti-Pattern:**
```typescript
// NÃO fazer: Client Component buscando dados
"use client"
export function HeroCard() {
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    fetch("/api/balance").then(...) // ERRADO: use Server Component
  }, [])
}
```

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
live-01/
├── .env.local                  # JWT_SECRET, DATABASE_URL
├── .env.example                # Template de variáveis de ambiente
├── .gitignore
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # shadcn/ui config
├── prisma/
│   ├── schema.prisma           # Schema com User, Category, Transaction
│   ├── seed.ts                 # Seed de categorias padrão (dev)
│   └── dev.db                  # SQLite database (gitignored)
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css         # CSS variables (tema dark/light), Tailwind imports
│   │   ├── layout.tsx          # Root layout: fonts, Toaster provider, metadata
│   │   ├── (auth)/
│   │   │   ├── layout.tsx      # Auth layout: centralizado, sem nav
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Tela de login
│   │   │   └── register/
│   │   │       └── page.tsx    # Tela de cadastro + onboarding (renda)
│   │   └── (app)/
│   │       ├── layout.tsx      # App layout: bottom nav, FAB, container
│   │       ├── loading.tsx     # Skeleton loading global
│   │       ├── page.tsx        # Dashboard (home)
│   │       ├── transactions/
│   │       │   └── page.tsx    # Tela de transações
│   │       └── profile/
│   │           └── page.tsx    # Tela de perfil
│   ├── components/
│   │   ├── ui/                 # shadcn/ui (gerenciado pelo CLI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── switch.tsx
│   │   ├── hero-card.tsx
│   │   ├── transaction-item.tsx
│   │   ├── bottom-sheet.tsx
│   │   ├── numeric-keypad.tsx
│   │   ├── category-grid.tsx
│   │   ├── fab.tsx
│   │   ├── bottom-nav.tsx
│   │   ├── filter-pills.tsx
│   │   ├── animated-counter.tsx
│   │   ├── theme-toggle.tsx
│   │   └── user-avatar.tsx
│   ├── actions/
│   │   ├── auth.ts             # register, login, logout
│   │   └── transactions.ts     # createTransaction, deleteTransaction
│   ├── lib/
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── auth.ts             # getSession, verifyToken, createToken
│   │   ├── format.ts           # formatCurrency, formatDate
│   │   ├── date.ts             # getMonthRange, getWeekRange, isToday
│   │   ├── constants.ts        # DEFAULT_CATEGORIES, SALT_ROUNDS, SEMAPHORE_THRESHOLDS
│   │   └── utils.ts            # cn() helper (shadcn/ui), getInitials
│   ├── types/
│   │   └── index.ts            # ActionResponse<T>, Session, BalanceSummary
│   └── middleware.ts            # Auth middleware: protege rotas (app)
└── _evo-output/                # Artefatos de planejamento (não é código)
    └── planning-artifacts/
```

### Architectural Boundaries

**Route Groups como Boundaries:**

| Group | Propósito | Layout | Auth |
|-------|-----------|--------|------|
| `(auth)` | Login e registro | Centralizado, sem nav, fundo simples | Público |
| `(app)` | App principal | Bottom nav, FAB, container mobile | Protegido (middleware) |

**API Boundaries:**

- Sem API Routes — toda comunicação via Server Actions
- Server Components acessam Prisma diretamente (read)
- Server Actions acessam Prisma para mutations (write)
- Middleware intercepta requests para auth check

**Data Boundaries:**

```
Browser (Client)
  ↓ form submit / action call
Server Action (validation + auth check)
  ↓ prisma query
Prisma Client → SQLite (dev.db)
  ↓ result
Server Action → revalidatePath
  ↓ re-render
Server Component (fresh data) → Client Component (props)
```

### Requirements to Structure Mapping

| FR Category | Arquivos Principais |
|------------|-------------------|
| **Auth (FR1-FR5)** | `actions/auth.ts`, `lib/auth.ts`, `middleware.ts`, `(auth)/login/page.tsx`, `(auth)/register/page.tsx` |
| **Dashboard (FR6-FR11)** | `(app)/page.tsx`, `components/hero-card.tsx`, `components/animated-counter.tsx` |
| **Registro (FR12-FR17)** | `actions/transactions.ts`, `components/bottom-sheet.tsx`, `components/numeric-keypad.tsx`, `components/category-grid.tsx`, `components/fab.tsx` |
| **Histórico (FR18-FR22)** | `(app)/transactions/page.tsx`, `components/transaction-item.tsx`, `components/filter-pills.tsx` |
| **Perfil (FR23-FR25)** | `(app)/profile/page.tsx`, `components/user-avatar.tsx`, `components/theme-toggle.tsx` |
| **Navegação (FR26-FR27)** | `components/bottom-nav.tsx`, `(app)/layout.tsx` |
| **Feedback (FR28-FR30)** | `(app)/loading.tsx`, `components/ui/skeleton.tsx`, `app/layout.tsx` (Toaster) |

### Data Flow

```
1. User abre o app
   → middleware.ts verifica JWT cookie
   → redirect /login se não autenticado

2. Dashboard carrega
   → (app)/page.tsx (Server Component)
   → prisma.transaction.findMany({ where: { userId } })
   → calcula saldo, receitas, despesas
   → passa props para HeroCard, TransactionItem

3. User registra transação
   → FAB click → BottomSheet abre (dynamic import)
   → User digita valor (NumericKeypad) + seleciona categoria (CategoryGrid)
   → Submit → createTransaction Server Action
   → Prisma create → revalidatePath("/") → dashboard re-renderiza

4. User deleta transação
   → Swipe left → delete button
   → deleteTransaction Server Action
   → Toast com undo (3s timer client-side)
   → Se undo: createTransaction com mesmos dados
   → Se não: revalidatePath
```

---

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**
- Next.js 16 App Router + Server Components + Server Actions = combinação nativa e oficial
- Prisma 7.2 + SQLite = suportado, zero config
- shadcn/ui + Tailwind CSS = integração nativa (CSS variables)
- Framer Motion em Client Components = compatível (marca "use client")
- bcryptjs + jose (JWT) = edge-compatible para middleware
- react-hook-form + zod = integração oficial com resolvers

Nenhum conflito de compatibilidade identificado.

**Pattern Consistency:**
- Naming conventions (camelCase fields, PascalCase components, kebab-case files) = padrão da comunidade Next.js/React
- Server Action response format consistente (`ActionResponse<T>`)
- Toast como feedback universal em todas as ações
- Zod como validação em todas as camadas

**Structure Alignment:**
- Route groups `(auth)` e `(app)` separam claramente público/privado
- Components flat = navegável para ~15-20 componentes
- Actions separados em arquivos por domínio
- Lib com utils compartilhados, sem duplicação

### Requirements Coverage Validation

**Functional Requirements Coverage: 30/30 (100%)**

| FR Range | Cobertura | Suporte Arquitetural |
|----------|-----------|---------------------|
| FR1-FR5 (Auth) | 100% | Server Actions + bcryptjs + JWT + middleware |
| FR6-FR11 (Dashboard) | 100% | Server Component + Prisma queries + HeroCard |
| FR12-FR17 (Registro) | 100% | BottomSheet + Server Actions + Sonner |
| FR18-FR22 (Histórico) | 100% | Server Component + FilterPills + swipe |
| FR23-FR25 (Perfil) | 100% | Page + Avatar + ThemeToggle |
| FR26-FR27 (Navegação) | 100% | BottomNav + App layout |
| FR28-FR30 (Feedback) | 100% | Skeleton + Framer Motion + session data |

**Non-Functional Requirements Coverage: 17/17 (100%)**

| NFR Range | Cobertura | Suporte |
|-----------|-----------|---------|
| NFR1-NFR8 (Performance) | 100% | Server Components, dynamic imports, Turbopack |
| NFR9-NFR12 (Security) | 100% | bcryptjs, middleware, zod, sanitização |
| NFR13-NFR17 (Accessibility) | 100% | Radix UI, semantic HTML, WCAG AA, reduced motion |

### Implementation Readiness Validation

**Decision Completeness:** Todas as decisões críticas documentadas com versões e rationale.
**Structure Completeness:** Árvore completa com todos os arquivos e diretórios.
**Pattern Completeness:** Naming, structure, format, communication e process patterns definidos com exemplos.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Contexto do projeto analisado
- [x] Escala e complexidade avaliados
- [x] Constraints técnicos identificados
- [x] Cross-cutting concerns mapeados

**Architectural Decisions**

- [x] Decisões críticas documentadas com versões
- [x] Stack completamente especificada
- [x] Padrões de integração definidos
- [x] Performance considerations endereçados

**Implementation Patterns**

- [x] Naming conventions estabelecidas
- [x] Structure patterns definidos
- [x] Communication patterns especificados
- [x] Process patterns documentados

**Project Structure**

- [x] Estrutura de diretórios completa
- [x] Boundaries de componentes estabelecidos
- [x] Pontos de integração mapeados
- [x] Requirements mapeados para estrutura

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** Alta

**Key Strengths:**
- Stack coesa e bem integrada (tudo Next.js ecosystem)
- Zero over-engineering (sem abstrações desnecessárias)
- Padrões claros que previnem conflitos entre agentes
- Escopo cirúrgico = menos decisões = menos risco

**Areas for Future Enhancement:**
- CI/CD pipeline (quando deploy for necessário)
- Testes automatizados (quando base estiver estável)
- PWA/Service Worker (v2.0)
- Google OAuth (v1.5)

### Implementation Handoff

**AI Agent Guidelines:**

- Seguir todas as decisões arquiteturais exatamente como documentadas
- Usar patterns de implementação consistentemente em todos os componentes
- Respeitar a estrutura do projeto e boundaries
- Referir a este documento para todas as questões arquiteturais
- Server Components por padrão, Client Components apenas onde necessário
- Toda mutation via Server Actions, toda leitura via Server Components

**First Implementation Priority:**
1. Configurar schema Prisma e rodar migrations
2. Configurar CSS variables de tema em `globals.css`
3. Implementar auth (register, login, middleware, sessão)
4. Criar layout base com bottom nav e container mobile
