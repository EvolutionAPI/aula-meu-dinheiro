# Story 1.1: Configuracao do Schema de Banco de Dados e Tema Visual

## Status: ready-for-dev

## Story

As a desenvolvedor,
I want configurar o schema Prisma com as tabelas User e Category, o Prisma Client singleton, as CSS variables do tema dark/light e os tipos base do projeto,
So that a fundacao tecnica esteja pronta para implementar autenticacao e funcionalidades.

---

## Acceptance Criteria

### AC #1 — Schema Prisma e Prisma Client
**Given** o projeto Next.js ja inicializado com Prisma instalado
**When** o schema Prisma for configurado
**Then** as tabelas User e Category existem com todos os campos definidos na arquitetura (id cuid, email unique, password, name, monthlyIncome para User; id cuid, name, icon, color, userId para Category com unique constraint [userId, name])
**And** o Prisma Client singleton esta configurado em src/lib/db.ts
**And** a migration inicial foi executada com sucesso

### AC #2 — CSS Variables de Tema
**Given** o arquivo globals.css
**When** as CSS variables de tema forem configuradas
**Then** o tema dark (padrao) usa zinc-950 como background, zinc-800 como card, emerald-500 como primary
**And** o tema light usa white como background, zinc-100 como card, emerald-600 como primary
**And** todas as combinacoes de cor atingem WCAG AA (>= 4.5:1 texto)

### AC #3 — Tipos Base
**Given** a necessidade de tipos compartilhados
**When** os tipos base forem criados
**Then** existe ActionResponse<T> em src/types/index.ts com { success: boolean, data?: T, error?: string }
**And** existe o tipo Session com userId e outros campos necessarios

### AC #4 — Utilitarios Base
**Given** a necessidade de utilitarios
**When** os utilitarios base forem criados
**Then** existe formatCurrency em src/lib/format.ts usando Intl.NumberFormat pt-BR
**And** existe formatDate e formatDateTime em src/lib/date.ts
**And** existe cn() helper em src/lib/utils.ts
**And** existe DEFAULT_CATEGORIES em src/lib/constants.ts com as 7 categorias (Alimentacao/orange, Transporte/blue, Moradia/violet, Lazer/pink, Saude/red, Educacao/cyan, Outros/gray)

---

## Tasks / Subtasks

### Task 1 (AC: #1) — Criar/configurar schema Prisma

- [ ] **1.1** Criar modelo User com campos: id (cuid), email (unique), password, name, monthlyIncome (Float), createdAt, updatedAt, relations (categories, transactions)
- [ ] **1.2** Criar modelo Category com campos: id (cuid), name, icon (emoji), color (hex), userId, relation User, @@unique([userId, name])
- [ ] **1.3** Criar modelo Transaction com campos: id (cuid), amount (Float), type (String "income"/"expense"), description (optional), categoryId, userId, createdAt, @@index([userId, createdAt]), @@index([userId, type])
- [ ] **1.4** Configurar Prisma Client singleton em src/lib/db.ts usando pattern globalForPrisma
- [ ] **1.5** Rodar npx prisma db push (SQLite) para aplicar o schema

### Task 2 (AC: #2) — Configurar CSS variables de tema

- [ ] **2.1** Configurar tema dark (padrao) em globals.css: --background: zinc-950 (#09090b), --card: zinc-800 (#27272a), --primary: emerald-500 (#10b981), --foreground: zinc-50 (#fafafa), --border: zinc-700 (#3f3f46), --muted: zinc-600 (#52525b), --destructive: red-500 (#ef4444), --warning: amber-500 (#f59e0b)
- [ ] **2.2** Configurar tema light via .light class: --background: white, --card: zinc-100 (#f4f4f5), --primary: emerald-600 (#059669), --foreground: zinc-950, --border: zinc-200 (#e4e4e7)
- [ ] **2.3** Verificar contraste WCAG AA em todas as combinacoes

### Task 3 (AC: #3) — Criar tipos base

- [ ] **3.1** Criar src/types/index.ts com ActionResponse<T> = { success: boolean, data?: T, error?: string }
- [ ] **3.2** Criar tipo Session = { userId: string, name: string, email: string, monthlyIncome: number }

### Task 4 (AC: #4) — Criar utilitarios base

- [ ] **4.1** Criar src/lib/format.ts com formatCurrency usando Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
- [ ] **4.2** Criar src/lib/date.ts com formatDate e formatDateTime usando Intl.DateTimeFormat("pt-BR")
- [ ] **4.3** Verificar que cn() helper ja existe em src/lib/utils.ts (gerado pelo shadcn/ui), se nao existir, criar com clsx + tailwind-merge
- [ ] **4.4** Criar src/lib/constants.ts com DEFAULT_CATEGORIES array: [{name: "Alimentacao", icon: "🍔", color: "#f97316"}, {name: "Transporte", icon: "🚗", color: "#3b82f6"}, {name: "Moradia", icon: "🏠", color: "#8b5cf6"}, {name: "Lazer", icon: "🎮", color: "#ec4899"}, {name: "Saude", icon: "💊", color: "#ef4444"}, {name: "Educacao", icon: "📚", color: "#06b6d4"}, {name: "Outros", icon: "📦", color: "#6b7280"}]
- [ ] **4.5** Criar SALT_ROUNDS = 10 e SEMAPHORE_THRESHOLDS = { green: 0.4, yellow: 0.1 } em constants.ts

---

## Dev Notes

### Architecture & Patterns

- **IMPORTANTE:** O projeto Next.js AINDA NAO FOI INICIALIZADO. O repositorio live-01/ so contem pastas .claude/, _evo/ e _evo-output/. O primeiro passo OBRIGATORIO e rodar `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir` NA RAIZ do projeto (live-01/).
- Apos criar o projeto Next.js, instalar dependencias: `npm install prisma @prisma/client bcryptjs @types/bcryptjs framer-motion sonner react-hook-form @hookform/resolvers zod jose`
- Inicializar Prisma com SQLite: `npx prisma init --datasource-provider sqlite`
- shadcn/ui precisa ser instalado: `npx shadcn@latest init` (style: new-york, baseColor: neutral, cssVariables: true)
- Prisma Client singleton usa pattern globalForPrisma para evitar multiplas instancias em dev (hot reload)
- SQLite como banco — arquivo em prisma/dev.db (gitignored)
- Todas as CSS variables devem seguir o padrao shadcn/ui para integracao nativa
- Usar `@layer base` no globals.css para definir as variables
- Font Inter como primaria (ja vem com Next.js via next/font/google)

### Prisma Schema Completo (copiar exatamente)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  password      String
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
  icon         String
  color        String
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  type        String
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

### Prisma Client Singleton (copiar exatamente)

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### CSS Variables Pattern

```css
/* globals.css - tema dark como padrao */
@layer base {
  :root {
    --background: 240 5.9% 3.9%;     /* zinc-950 */
    --foreground: 0 0% 98%;           /* zinc-50 */
    --card: 240 3.7% 15.9%;           /* zinc-800 */
    --card-foreground: 0 0% 98%;      /* zinc-50 */
    --primary: 160 84% 39.4%;         /* emerald-500 #10b981 */
    --primary-foreground: 0 0% 100%;  /* white */
    --border: 240 3.7% 26.5%;         /* zinc-700 */
    --muted: 240 3.7% 15.9%;          /* zinc-800 */
    --muted-foreground: 240 5% 64.9%; /* zinc-400 */
    --destructive: 0 84.2% 60.2%;     /* red-500 */
    --warning: 38 92% 50%;            /* amber-500 */
    --ring: 160 84% 39.4%;            /* emerald-500 */
    --input: 240 3.7% 26.5%;          /* zinc-700 */
  }

  .light {
    --background: 0 0% 100%;          /* white */
    --foreground: 240 5.9% 3.9%;      /* zinc-950 */
    --card: 240 4.8% 95.9%;           /* zinc-100 */
    --card-foreground: 240 5.9% 3.9%; /* zinc-950 */
    --primary: 161 94% 30.4%;         /* emerald-600 #059669 */
    --primary-foreground: 0 0% 100%;  /* white */
    --border: 240 5.9% 90%;           /* zinc-200 */
    --muted: 240 4.8% 95.9%;          /* zinc-100 */
    --muted-foreground: 240 3.8% 36.5%; /* zinc-600 */
    --input: 240 5.9% 90%;            /* zinc-200 */
  }
}
```

### Tipos Base (copiar exatamente)

```typescript
// src/types/index.ts
export type ActionResponse<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export type Session = {
  userId: string
  name: string
  email: string
  monthlyIncome: number
}
```

### Utilitarios Base

```typescript
// src/lib/format.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
```

```typescript
// src/lib/date.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
```

```typescript
// src/lib/constants.ts
export const DEFAULT_CATEGORIES = [
  { name: 'Alimentacao', icon: '🍔', color: '#f97316' },
  { name: 'Transporte', icon: '🚗', color: '#3b82f6' },
  { name: 'Moradia', icon: '🏠', color: '#8b5cf6' },
  { name: 'Lazer', icon: '🎮', color: '#ec4899' },
  { name: 'Saude', icon: '💊', color: '#ef4444' },
  { name: 'Educacao', icon: '📚', color: '#06b6d4' },
  { name: 'Outros', icon: '📦', color: '#6b7280' },
] as const

export const SALT_ROUNDS = 10

export const SEMAPHORE_THRESHOLDS = {
  green: 0.4,
  yellow: 0.1,
} as const
```

### File Structure for this Story

```
live-01/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── globals.css          # CSS variables dark/light
│   │   ├── layout.tsx           # Root layout (Inter font, metadata)
│   │   └── page.tsx             # Placeholder home
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts                # Prisma Client singleton
│   │   ├── format.ts            # formatCurrency
│   │   ├── date.ts              # formatDate, formatDateTime
│   │   ├── utils.ts             # cn() helper (shadcn/ui)
│   │   └── constants.ts         # DEFAULT_CATEGORIES, SALT_ROUNDS, SEMAPHORE_THRESHOLDS
│   └── types/
│       └── index.ts             # ActionResponse<T>, Session
├── .env.local                   # DATABASE_URL, JWT_SECRET
└── .env.example                 # Template
```

### Testing Checklist

- [ ] `npx prisma db push` executa sem erros
- [ ] `npx prisma studio` abre e mostra as 3 tabelas
- [ ] CSS variables dark mode visivel no browser (background escuro)
- [ ] `formatCurrency(1234.56)` retorna "R$ 1.234,56"
- [ ] TypeScript compila sem erros (`npx tsc --noEmit`)
- [ ] `npm run dev` roda sem erros

### CRITICO — Nao Fazer

- NAO criar subpasta meudinheiro/ — o projeto e na raiz live-01/
- NAO usar API Routes — toda comunicacao via Server Actions
- NAO usar styled-components ou CSS modules — usar Tailwind + CSS variables
- NAO hardcodar cores — usar CSS variables para permitir toggle de tema
- NAO esquecer de adicionar prisma/dev.db ao .gitignore

### Project Structure Notes

- O {project-root} = /Users/etus_0104/Projects/study-ia/live-01
- Todos os comandos devem ser executados na raiz live-01/

### References

- [Source: architecture.md#Data Architecture] Schema Prisma completo
- [Source: architecture.md#Implementation Patterns] Naming conventions e Prisma Client singleton
- [Source: architecture.md#Project Structure] Estrutura de diretorios
- [Source: ux-design-specification.md#Color System] Paleta de cores dark/light
- [Source: ux-design-specification.md#Typography System] Font Inter
- [Source: epics.md#Story 1.1] Acceptance criteria

---

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
