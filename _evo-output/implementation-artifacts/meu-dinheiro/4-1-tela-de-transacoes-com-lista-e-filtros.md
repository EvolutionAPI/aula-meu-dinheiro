# Story 4.1: Tela de Transacoes com Lista e Filtros

**Status:** done

**Depends on:** Story 1.1 (schema Prisma, tipos, formatCurrency, constants), Story 1.4 (getSession, middleware), Story 2.1 (layout app, bottom nav), Story 3.3 (Transaction model e createTransaction — modelo ja existe no banco)

---

## Story

**As a** usuario,
**I want** ver todas as minhas transacoes em uma lista e filtrar por periodo,
**So that** eu saiba exatamente onde gastei meu dinheiro.

---

## Acceptance Criteria

### AC1 — Lista de transacoes do mes atual
**Given** o usuario navega para a tela de Transacoes (`/transactions`)
**When** a pagina carrega (Server Component)
**Then** exibe a lista completa de transacoes do mes atual (FR18)
**And** cada transacao mostra: avatar de categoria (circulo colorido 40x40px + emoji), nome da categoria, descricao ou data (body-sm, zinc-400), valor formatado (bold, emerald-500 se receita, zinc-50 se despesa com "- R$" prefix)
**And** transacoes ordenadas por data decrescente (mais recente primeiro)
**And** transacoes aparecem com animacao fade + translateY (FR29)

### AC2 — Filter pills no topo
**Given** os filter pills sao exibidos no topo
**When** o usuario toca em um pill (Hoje/Semana/Mes)
**Then** o pill ativo tem background emerald-500, texto white (FR19)
**And** pills inativos tem background zinc-800, texto zinc-400
**And** a lista filtra para mostrar apenas transacoes do periodo selecionado
**And** "Mes" e o filtro padrao ativo

### AC3 — Resumo flutuante do periodo
**Given** um filtro esta ativo
**When** a lista e exibida
**Then** um resumo flutuante no topo mostra o total consolidado do periodo (FR20)
**And** formato: "Total: R$ X.XXX,XX" com receitas e despesas separadas
**And** receitas exibidas em emerald-500 e despesas em red-500/zinc-50

### AC4 — Empty state
**Given** a tela de transacoes
**When** nao existem transacoes no periodo filtrado
**Then** mostra empty state "Sem transacoes neste periodo" com icone
**And** sugestao de outro filtro (ex: "Tente selecionar outro periodo")

### AC5 — Skeleton loading
**Given** a tela esta carregando
**When** os dados estao sendo buscados
**Then** exibe skeleton loading com formato de transaction rows (FR28)
**And** skeleton tem pulso zinc-700/zinc-800 com circulos 40x40 + linhas retangulares
**And** transicao skeleton -> conteudo com fade 200ms

---

## Tasks / Subtasks

- [x] **Task 1 (AC: #1, #2, #3)** Criar helpers de data em `src/lib/date.ts`
  - [x] 1.1 Criar arquivo `src/lib/date.ts` (se nao existir)
  - [x] 1.2 Implementar `getMonthRange()`: retorna `{ start: Date, end: Date }` do mes atual
  - [x] 1.3 Implementar `getWeekRange()`: retorna `{ start: Date, end: Date }` da semana atual (segunda a domingo)
  - [x] 1.4 Implementar `getTodayRange()`: retorna `{ start: Date, end: Date }` do dia atual (00:00:00 ate 23:59:59)
  - [x] 1.5 Implementar `formatDate(date: Date): string` para exibir datas no formato "dd/MM/yyyy" ou "dd MMM"
  - [x] 1.6 Exportar tipo `DateRange = { start: Date; end: Date }`

- [x] **Task 2 (AC: #1, #2, #3)** Criar pagina de transacoes (Server Component)
  - [x] 2.1 Criar `src/app/(app)/transactions/page.tsx` como Server Component
  - [x] 2.2 Importar `getSession()` de `@/lib/auth` e redirecionar se nao autenticado
  - [x] 2.3 Buscar TODAS as transacoes do usuario via Prisma com `include: { category: true }` e `orderBy: { createdAt: 'desc' }`
  - [x] 2.4 Serializar dados (converter Date para string ISO) antes de passar como props
  - [x] 2.5 Renderizar componente `<TransactionsList transactions={serializedTransactions} />`
  - [x] 2.6 Envolver com `<Suspense>` se necessario

- [x] **Task 3 (AC: #2)** Criar componente FilterPills (Client Component)
  - [x] 3.1 Criar `src/components/filter-pills.tsx` com `"use client"`
  - [x] 3.2 Props: `activeFilter`, `onFilterChange` callback
  - [x] 3.3 Definir constante `FILTERS = ['Hoje', 'Semana', 'Mes'] as const`
  - [x] 3.4 Renderizar pills em `flex gap-2`
  - [x] 3.5 Pill ativo: `bg-emerald-500 text-white font-medium rounded-full px-4 py-1.5`
  - [x] 3.6 Pill inativo: `bg-zinc-800 text-zinc-400 rounded-full px-4 py-1.5`
  - [x] 3.7 Transicao suave ao trocar pill ativo (transition-colors duration-200)
  - [x] 3.8 `aria-pressed` para acessibilidade no pill ativo

- [x] **Task 4 (AC: #1, #2, #3, #4)** Criar componente TransactionsList (Client Component)
  - [x] 4.1 Criar `src/components/transactions-list.tsx` com `"use client"`
  - [x] 4.2 Props: `transactions` (array serializado com categoria incluida)
  - [x] 4.3 Estado local `useState<'Hoje' | 'Semana' | 'Mes'>('Mes')` para filtro ativo
  - [x] 4.4 Logica de filtragem client-side: filtrar `transactions` com base no filtro ativo usando helpers de `@/lib/date.ts`
  - [x] 4.5 Calcular resumo do periodo: `totalIncome`, `totalExpenses`, `total = totalIncome - totalExpenses`
  - [x] 4.6 Renderizar `<FilterPills>` no topo
  - [x] 4.7 Renderizar resumo flutuante abaixo dos pills: "Total: R$ X.XXX,XX" com breakdown receitas/despesas
  - [x] 4.8 Renderizar lista de `<TransactionItem>` para cada transacao filtrada
  - [x] 4.9 Renderizar empty state quando lista filtrada estiver vazia
  - [x] 4.10 Wrapper com `<AnimatePresence>` do Framer Motion para animacao de entrada/saida

- [x] **Task 5 (AC: #1)** Criar componente TransactionItem (Client Component)
  - [x] 5.1 Criar `src/components/transaction-item.tsx` com `"use client"`
  - [x] 5.2 Props: `transaction` (com category incluida), `index` (para stagger delay)
  - [x] 5.3 Avatar: circulo 40x40px com `backgroundColor` da cor da categoria + emoji da categoria centralizado
  - [x] 5.4 Coluna central: nome da categoria (text-sm font-medium text-zinc-50), descricao ou data formatada (text-xs text-zinc-400)
  - [x] 5.5 Valor: `text-sm font-bold`, emerald-500 se type === "income" com "R$" prefix, zinc-50 se type === "expense" com "- R$" prefix
  - [x] 5.6 Formatacao do valor com `formatCurrency()` de `@/lib/format.ts`
  - [x] 5.7 Animacao Framer Motion: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ delay: index * 0.05, duration: 0.3 }}`
  - [x] 5.8 Respeitar `prefers-reduced-motion`: se ativo, sem animacao (y: 0, duration: 0)
  - [x] 5.9 Layout: `flex items-center gap-3 py-3` com divider sutil entre items

- [x] **Task 6 (AC: #3)** Criar resumo flutuante do periodo
  - [x] 6.1 Dentro de TransactionsList, renderizar card de resumo
  - [x] 6.2 Background: `bg-zinc-800/80 backdrop-blur-sm rounded-xl p-4`
  - [x] 6.3 Total principal: "Total: R$ X.XXX,XX" em `text-lg font-bold text-zinc-50`
  - [x] 6.4 Breakdown: "Receitas: R$ X.XXX,XX" em `text-xs text-emerald-500` e "Despesas: R$ X.XXX,XX" em `text-xs text-red-400`
  - [x] 6.5 Atualizar valores ao trocar filtro

- [x] **Task 7 (AC: #4)** Implementar empty state
  - [x] 7.1 Componente inline ou dedicado para empty state
  - [x] 7.2 Icone centralizado (ex: `Receipt` ou `FileText` do lucide-react, tamanho 48px, text-zinc-600)
  - [x] 7.3 Texto: "Sem transacoes neste periodo" em `text-sm text-zinc-500 text-center`
  - [x] 7.4 Sugestao: "Tente selecionar outro periodo" em `text-xs text-zinc-600`
  - [x] 7.5 Animacao fade-in com Framer Motion

- [x] **Task 8 (AC: #5)** Criar skeleton loading
  - [x] 8.1 Criar `src/app/(app)/transactions/loading.tsx`
  - [x] 8.2 Skeleton dos filter pills: 3 retangulos rounded-full (w-16 h-8)
  - [x] 8.3 Skeleton do resumo: retangulo rounded-xl (w-full h-20)
  - [x] 8.4 Skeleton de transaction rows: 6-8 rows com circulo 40x40 + 2 linhas retangulares + retangulo de valor
  - [x] 8.5 Usar `<Skeleton />` do shadcn/ui com classes `bg-zinc-700 animate-pulse`
  - [x] 8.6 `aria-hidden="true"` no container de skeletons

---

## Dev Notes

### Architecture & Patterns

- A pagina de transacoes (`/transactions`) e um **Server Component** que busca dados via Prisma diretamente
- FilterPills e TransactionsList sao **Client Components** (`"use client"`) para gerenciar estado de filtro e animacoes
- Pattern: Server Component busca TODOS os dados do usuario -> serializa -> passa como props -> Client Component filtra localmente
- A filtragem por periodo (Hoje/Semana/Mes) acontece **client-side** para evitar round-trips ao servidor
- Todas as transacoes do usuario sao buscadas de uma vez (nao paginado nesta story — volume esperado e baixo)
- `loading.tsx` e usado pelo Next.js automaticamente como fallback de `<Suspense>` durante streaming

### Data Fetching Pattern

```typescript
// src/app/(app)/transactions/page.tsx (Server Component)
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransactionsList } from "@/components/transactions-list"

export default async function TransactionsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  // Serializar para passar como props ao Client Component
  const serializedTransactions = transactions.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    amount: t.amount,
    category: {
      id: t.category.id,
      name: t.category.name,
      emoji: t.category.emoji,
      color: t.category.color,
    },
  }))

  return (
    <div className="py-6 space-y-4">
      <h1 className="text-xl font-bold text-zinc-50">Transacoes</h1>
      <TransactionsList transactions={serializedTransactions} />
    </div>
  )
}
```

### Date Helpers

```typescript
// src/lib/date.ts
export type DateRange = { start: Date; end: Date }

export function getMonthRange(): DateRange {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

export function getWeekRange(): DateRange {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function getTodayRange(): DateRange {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  return { start, end }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}
```

### FilterPills Component

```typescript
// src/components/filter-pills.tsx
"use client"

export type FilterType = "Hoje" | "Semana" | "Mes"

const FILTERS: FilterType[] = ["Hoje", "Semana", "Mes"]

interface FilterPillsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Filtros de periodo">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          aria-pressed={activeFilter === filter}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
            activeFilter === filter
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
```

### TransactionItem Component

```typescript
// src/components/transaction-item.tsx
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/date"

interface TransactionItemProps {
  transaction: {
    id: string
    amount: number
    type: string
    description: string | null
    createdAt: string
    category: {
      id: string
      name: string
      emoji: string
      color: string
    }
  }
  index: number
}

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  const shouldReduceMotion = useReducedMotion()

  const isIncome = transaction.type === "income"
  const formattedValue = isIncome
    ? `R$ ${formatCurrency(transaction.amount)}`
    : `- R$ ${formatCurrency(transaction.amount)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.05,
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
      className="flex items-center gap-3 py-3"
    >
      {/* Avatar da categoria */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-lg flex-shrink-0"
        style={{ backgroundColor: transaction.category.color + "20" }}
      >
        {transaction.category.emoji}
      </div>

      {/* Info central */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-50 truncate">
          {transaction.category.name}
        </p>
        <p className="text-xs text-zinc-400 truncate">
          {transaction.description || formatDate(transaction.createdAt)}
        </p>
      </div>

      {/* Valor */}
      <span
        className={`text-sm font-bold flex-shrink-0 ${
          isIncome ? "text-emerald-500" : "text-zinc-50"
        }`}
      >
        {formattedValue}
      </span>
    </motion.div>
  )
}
```

### TransactionsList Component (logica de filtragem)

```typescript
// src/components/transactions-list.tsx
"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Receipt } from "lucide-react"
import { FilterPills, type FilterType } from "@/components/filter-pills"
import { TransactionItem } from "@/components/transaction-item"
import { getMonthRange, getWeekRange, getTodayRange } from "@/lib/date"
import { formatCurrency } from "@/lib/format"

interface SerializedTransaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: string
  category: { id: string; name: string; emoji: string; color: string }
}

interface TransactionsListProps {
  transactions: SerializedTransaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Mes")

  const filteredTransactions = useMemo(() => {
    const range =
      activeFilter === "Hoje"
        ? getTodayRange()
        : activeFilter === "Semana"
          ? getWeekRange()
          : getMonthRange()

    return transactions.filter((t) => {
      const date = new Date(t.createdAt)
      return date >= range.start && date <= range.end
    })
  }, [transactions, activeFilter])

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, total: income - expenses }
  }, [filteredTransactions])

  return (
    <div className="space-y-4">
      <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Resumo do periodo */}
      <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl p-4">
        <p className="text-lg font-bold text-zinc-50">
          Total: R$ {formatCurrency(Math.abs(summary.total))}
        </p>
        <div className="flex gap-4 mt-1">
          <span className="text-xs text-emerald-500">
            Receitas: R$ {formatCurrency(summary.income)}
          </span>
          <span className="text-xs text-red-400">
            Despesas: R$ {formatCurrency(summary.expenses)}
          </span>
        </div>
      </div>

      {/* Lista ou empty state */}
      {filteredTransactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <Receipt className="h-12 w-12 text-zinc-600" />
          <p className="text-sm text-zinc-500 text-center">
            Sem transacoes neste periodo
          </p>
          <p className="text-xs text-zinc-600 text-center">
            Tente selecionar outro periodo
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-zinc-800">
          <AnimatePresence mode="wait">
            {filteredTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
```

### Skeleton Loading

```typescript
// src/app/(app)/transactions/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsLoading() {
  return (
    <div className="py-6 space-y-4" aria-hidden="true">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-40 bg-zinc-700" />

      {/* Filter pills skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full bg-zinc-700" />
        <Skeleton className="h-8 w-20 rounded-full bg-zinc-700" />
        <Skeleton className="h-8 w-14 rounded-full bg-zinc-700" />
      </div>

      {/* Summary skeleton */}
      <Skeleton className="h-20 w-full rounded-xl bg-zinc-700" />

      {/* Transaction rows skeleton */}
      <div className="space-y-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-10 w-10 rounded-full bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 bg-zinc-700" />
              <Skeleton className="h-3 w-20 bg-zinc-800" />
            </div>
            <Skeleton className="h-4 w-16 bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Tipo Serializado da Transacao

O Server Component busca dados com tipos Date do Prisma, mas ao passar para Client Components via props, Dates sao serializados como strings. Definir um tipo explicito:

```typescript
// Pode ficar em src/types/transaction.ts ou inline nos componentes
export interface SerializedTransaction {
  id: string
  amount: number
  type: "income" | "expense"
  description: string | null
  createdAt: string // ISO string (serializado do Date)
  categoryId: string
  userId: string
  category: {
    id: string
    name: string
    emoji: string
    color: string
  }
}
```

### Modelo Prisma Transaction (referencia — JA EXISTE, nao criar)

```prisma
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

### Visual Design

- **Pagina:** `py-6 space-y-4`, titulo "Transacoes" em `text-xl font-bold text-zinc-50`
- **Filter pills:** `flex gap-2`, cada pill `rounded-full px-4 py-1.5 text-sm font-medium`
  - Ativo: `bg-emerald-500 text-white`
  - Inativo: `bg-zinc-800 text-zinc-400`
- **Resumo:** `bg-zinc-800/80 backdrop-blur-sm rounded-xl p-4`
  - Total: `text-lg font-bold text-zinc-50`
  - Receitas: `text-xs text-emerald-500`
  - Despesas: `text-xs text-red-400`
- **Transaction item:** `flex items-center gap-3 py-3`
  - Avatar: `h-10 w-10 rounded-full` com cor da categoria + emoji
  - Categoria: `text-sm font-medium text-zinc-50`
  - Descricao/data: `text-xs text-zinc-400`
  - Valor receita: `text-sm font-bold text-emerald-500`
  - Valor despesa: `text-sm font-bold text-zinc-50` com "- R$" prefix
- **Divider:** `divide-y divide-zinc-800` entre items
- **Empty state:** centralizado, icone 48px zinc-600, texto zinc-500/zinc-600
- **Skeleton:** `bg-zinc-700 animate-pulse` usando `<Skeleton />` do shadcn/ui

### Accessibility

- Filter pills: `role="group"`, `aria-label="Filtros de periodo"`, `aria-pressed` no pill ativo
- Transaction items: semantica adequada com textos descritivos
- Skeleton: `aria-hidden="true"` no container
- Animacoes: `useReducedMotion()` do Framer Motion — desativar animacoes para usuarios que preferem movimento reduzido
- Valores monetarios: formatados com texto completo (nao apenas numeros)
- Empty state: texto descritivo acessivel

### File Structure

```
src/
├── app/(app)/transactions/
│   ├── page.tsx             # Pagina de transacoes (Server Component) (NOVO)
│   └── loading.tsx          # Skeleton loading (NOVO)
├── components/
│   ├── transactions-list.tsx # Lista com filtro e resumo (Client Component) (NOVO)
│   ├── transaction-item.tsx  # Item individual de transacao (Client Component) (NOVO)
│   └── filter-pills.tsx      # Pills de filtro de periodo (Client Component) (NOVO)
└── lib/
    └── date.ts              # Helpers de data: getMonthRange, getWeekRange, getTodayRange, formatDate (NOVO)
```

### CRITICO — Nao Fazer

- **NAO** buscar dados em Client Components — Server Component busca via Prisma, Client Component recebe props
- **NAO** usar `useEffect` + `fetch` ou API Routes — dados vem diretamente do Server Component
- **NAO** criar o modelo Transaction no Prisma — ele JA EXISTE no schema
- **NAO** esquecer de incluir `{ category: true }` no `include` da query Prisma
- **NAO** esquecer de serializar Dates antes de passar como props (Date -> string ISO)
- **NAO** esquecer empty state quando lista filtrada estiver vazia
- **NAO** esquecer skeleton loading em `loading.tsx`
- **NAO** esquecer `prefers-reduced-motion` nas animacoes do Framer Motion
- **NAO** criar estado global complexo para filtros — usar `useState` simples no TransactionsList
- **NAO** paginar transacoes nesta story — volume esperado e baixo, buscar todas de uma vez
- **NAO** implementar swipe-to-delete nesta story — isso e Story 4.2
- **NAO** esquecer o "- R$" prefix para despesas na formatacao do valor
- **NAO** usar cores hardcoded para categorias — usar a cor vinda do banco (`category.color`)

### Testing Checklist

- [ ] Pagina `/transactions` carrega sem erros para usuario autenticado
- [ ] Redireciona para `/login` se usuario nao autenticado
- [ ] Skeleton loading aparece durante carregamento
- [ ] Transacoes do mes atual aparecem na lista por padrao
- [ ] Filtro "Mes" esta ativo por padrao (pill com bg emerald-500)
- [ ] Trocar para "Semana" filtra corretamente
- [ ] Trocar para "Hoje" filtra corretamente
- [ ] Resumo flutuante atualiza ao trocar filtro
- [ ] Receitas e despesas calculadas corretamente no resumo
- [ ] Cada transacao mostra avatar com emoji e cor da categoria
- [ ] Receitas mostram valor em emerald-500 com "R$"
- [ ] Despesas mostram valor em zinc-50 com "- R$"
- [ ] Animacao fade+translateY funciona nos items
- [ ] Animacao desativada quando `prefers-reduced-motion` esta ativo
- [ ] Empty state aparece quando filtro nao tem transacoes
- [ ] Empty state mostra sugestao de trocar filtro
- [ ] Layout responsivo no container mobile (max-width 428px)
- [ ] Sem erros no console do navegador

### References

- [Source: architecture.md#Data Model] Schema Transaction com campos e indices
- [Source: architecture.md#Frontend Architecture] Server vs Client Components pattern
- [Source: architecture.md#Communication Patterns] Server Actions e data fetching direto
- [Source: epics.md#FR18] Lista completa de transacoes
- [Source: epics.md#FR19] Filtrar por periodo
- [Source: epics.md#FR20] Total consolidado do periodo
- [Source: epics.md#FR28] Skeleton loading
- [Source: epics.md#FR29] Animacoes de transicao
- [Source: ux-design-specification.md] Dark mode, cores, skeleton patterns

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Implementados date helpers (getMonthRange, getWeekRange, getTodayRange, formatDate) com tipo DateRange
- Pagina /transactions como Server Component com autenticacao e query Prisma com include category
- FilterPills com 3 opcoes (Hoje/Semana/Mes), estilos ativos/inativos, aria-pressed
- TransactionsList com filtragem client-side, resumo flutuante, empty state e AnimatePresence
- TransactionItem com avatar de categoria, valores formatados, animacao fade+translateY, prefers-reduced-motion
- Skeleton loading com componente Skeleton do shadcn/ui
- 15 testes unitarios: date helpers, filter-pills, transactions-list
- 98 testes totais passando, 0 regressoes

### Change Log
- 2026-03-19: Implementacao completa da Story 4.1 — todos os 8 tasks e subtasks concluidos

### File List
- src/lib/date.ts (modificado — adicionados getMonthRange, getWeekRange, getTodayRange, DateRange, atualizado formatDate)
- src/app/(app)/transactions/page.tsx (modificado — Server Component com dados reais)
- src/app/(app)/transactions/loading.tsx (novo — skeleton loading)
- src/components/filter-pills.tsx (novo — Client Component de filtro de periodo)
- src/components/transactions-list.tsx (novo — Client Component lista com filtro e resumo)
- src/components/transaction-item.tsx (novo — Client Component item individual)
- src/__tests__/date.test.ts (novo — testes de date helpers)
- src/__tests__/filter-pills.test.tsx (novo — testes de FilterPills)
- src/__tests__/transactions-list.test.tsx (novo — testes de TransactionsList)
- src/app/layout.tsx (modificado — fonte Inter, lang pt-BR, metadata MeuDinheiro)
- src/app/globals.css (modificado — font-mono fallback)
- src/components/ui/skeleton.tsx (novo — componente Skeleton do shadcn/ui)
