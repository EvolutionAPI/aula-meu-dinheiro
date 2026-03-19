# Story 2.2: Dashboard com Hero Card e Saldo

**Status:** ready-for-dev

**Depends on:** Story 1.1 (schema, tipos, formatCurrency, constants), Story 1.4 (getSession, middleware), Story 2.1 (layout app, bottom nav), Story 2.3 (AnimatedCounter — pode ser implementado junto ou apos)

---

## Story

**As a** usuario autenticado,
**I want** ver meu saldo atual com indicador visual de saude financeira no dashboard,
**So that** eu entenda minha situacao financeira num olhar.

---

## Acceptance Criteria

### AC1 — Header com saudacao e toggle de visibilidade
**Given** o usuario acessa o dashboard (/)
**When** a pagina carrega
**Then** o header exibe "Ola, {nome}" como saudacao personalizada (FR30)
**And** o header tem icone de olho para ocultar/exibir valores (FR7)

### AC2 — Hero Card com saldo e semaforo
**Given** o dashboard carregou
**When** o hero card e exibido
**Then** mostra o label "Saldo atual" em body-sm zinc-400
**And** mostra o valor do saldo (receitas - despesas do mes) em display bold com counter animation de 0 ao valor em ~500ms spring (FR6, NFR8)
**And** o hero card tem borda-left 4px com cor do semaforo:
  - Verde (#10b981) se saldo > 40% da renda mensal
  - Amarelo (#f59e0b) se saldo entre 10-40% da renda
  - Vermelho (#ef4444) se saldo < 10% da renda (FR8)
**And** abaixo do saldo mostra "Receitas R$X | Despesas R$X" em caption (FR9)
**And** o card tem background zinc-800, rounded-2xl, shadow-lg

### AC3 — Toggle ocultar valores
**Given** o usuario toca no icone de olho
**When** os valores sao ocultados
**Then** todos os valores monetarios viram "R$ ••••••" com fade transition
**And** o estado persiste na sessao (nao entre sessoes)

### AC4 — Ultimas transacoes
**Given** o dashboard com dados
**When** a secao de ultimas transacoes e exibida
**Then** mostra as 5 ultimas transacoes registradas (FR10)
**And** cada transacao mostra avatar de categoria (circulo colorido + emoji), nome da categoria, valor formatado
**And** transacoes aparecem com animacao fade+slide (FR29)
**And** se nao houver transacoes, mostra empty state "Registre sua primeira transacao"

### AC5 — Skeleton loading
**Given** o dashboard
**When** esta carregando dados
**Then** exibe skeleton loading com pulso zinc-700/zinc-800 nos formatos dos cards (FR28)
**And** skeleton tem o formato exato do conteudo final (hero card shape, transaction rows)
**And** transicao skeleton -> conteudo com fade 200ms

### AC6 — Acoes rapidas
**Given** o dashboard com acoes rapidas
**When** a secao e exibida
**Then** mostra botoes/atalhos para acoes rapidas de registro (FR11)
**And** os atalhos sao acessiveis na zona do polegar

---

## Tasks / Subtasks

- [ ] **Task 1 (AC: #1)** Criar header do dashboard
  - [ ] 1.1 Atualizar `src/app/(app)/page.tsx` como Server Component
  - [ ] 1.2 Buscar sessao com `getSession()` — extrair nome do usuario
  - [ ] 1.3 Renderizar "Ola, {nome}" como h1 (`text-xl`, `bold`, `zinc-50`)
  - [ ] 1.4 Renderizar EyeToggle como Client Component (toggle ocultar valores)

- [ ] **Task 2 (AC: #2)** Criar componente HeroCard
  - [ ] 2.1 Criar `src/components/hero-card.tsx` como Client Component (`"use client"`)
  - [ ] 2.2 Props: `balance` (number), `income` (number), `expenses` (number), `monthlyIncome` (number)
  - [ ] 2.3 Label "Saldo atual" (body-sm, zinc-400)
  - [ ] 2.4 Valor do saldo com AnimatedCounter (ou `formatCurrency` se counter nao pronto)
  - [ ] 2.5 Logica do semaforo: calcular `ratio = balance / monthlyIncome`, aplicar cor:
    - `> 0.4`: emerald-500 (`#10b981`)
    - `0.1 a 0.4`: amber-500 (`#f59e0b`)
    - `< 0.1`: red-500 (`#ef4444`)
  - [ ] 2.6 Borda-left 4px com cor do semaforo
  - [ ] 2.7 Subinfo: "Receitas R${income} | Despesas R${expenses}" (caption, zinc-400)
  - [ ] 2.8 Background zinc-800, rounded-2xl, shadow-lg, padding 16px
  - [ ] 2.9 Suporte a "valores ocultos" via prop (recebe `isHidden` de parent)

- [ ] **Task 3 (AC: #3)** Criar toggle ocultar valores
  - [ ] 3.1 Client Component com `useState` para `isHidden`
  - [ ] 3.2 Icone eye/eye-off (lucide-react)
  - [ ] 3.3 Quando oculto: valores viram "R$ ••••••"
  - [ ] 3.4 Fade transition (200ms) ao alternar
  - [ ] 3.5 Estado local (`useState`) — nao persiste entre sessoes

- [ ] **Task 4 (AC: #2)** Criar funcoes de data fetching
  - [ ] 4.1 Criar funcao `getBalance(userId)` que retorna `{ balance, income, expenses }`
  - [ ] 4.2 Query: soma receitas (`type="income"`) e despesas (`type="expense"`) do mes atual
  - [ ] 4.3 Filtro por mes: `createdAt >= inicio do mes AND createdAt < inicio do proximo mes`
  - [ ] 4.4 Criar funcao `getRecentTransactions(userId, limit=5)`
  - [ ] 4.5 Query: ultimas 5 transacoes com `include category`, `orderBy createdAt desc`
  - [ ] 4.6 Colocar queries em `src/lib/queries.ts` ou diretamente no `page.tsx`

- [ ] **Task 5 (AC: #4)** Criar secao de ultimas transacoes
  - [ ] 5.1 Renderizar lista das 5 ultimas transacoes
  - [ ] 5.2 Cada item: avatar (circulo colorido 40x40 + emoji), nome categoria, valor formatado
  - [ ] 5.3 Valor: emerald-500 se receita, zinc-50 se despesa com "- R$" prefix
  - [ ] 5.4 Animacao fade+slide nos items (Framer Motion)
  - [ ] 5.5 Empty state: "Registre sua primeira transacao" com icone discreto

- [ ] **Task 6 (AC: #5)** Criar skeleton loading
  - [ ] 6.1 Criar ou atualizar `src/app/(app)/loading.tsx`
  - [ ] 6.2 Skeleton no formato do hero card (retangulo rounded-2xl)
  - [ ] 6.3 Skeleton no formato de transaction rows (circulos + linhas)
  - [ ] 6.4 Pulso: `animate-pulse` com zinc-700 -> zinc-800

- [ ] **Task 7 (AC: #6)** Criar secao de acoes rapidas (simplificada)
  - [ ] 7.1 Botoes circulares pequenos para "Despesa" e "Receita" (atalhos)
  - [ ] 7.2 Ou apenas um link "Ver todas" apontando para `/transactions`
  - [ ] 7.3 Zona do polegar — parte inferior da tela

---

## Dev Notes

### Architecture & Patterns

- Dashboard page e Server Component — busca dados diretamente via Prisma
- HeroCard e Client Component — precisa de AnimatedCounter e toggle ocultar
- Pattern: Server Component busca dados -> passa props -> Client Component renderiza
- Queries Prisma diretamente no `page.tsx` ou em `src/lib/queries.ts`
- AnimatedCounter (Story 2.3) pode ser implementado junto ou substituido por `formatCurrency` temporariamente
- Framer Motion para animacoes (fade+slide nas transacoes)
- Skeleton via shadcn/ui `<Skeleton />` component

### Data Fetching Pattern

```typescript
// src/app/(app)/page.tsx (Server Component)
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { HeroCard } from "@/components/hero-card"

async function getBalance(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      createdAt: { gte: startOfMonth, lt: startOfNextMonth },
    },
  })

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  return { balance: income - expenses, income, expenses }
}

async function getRecentTransactions(userId: string, limit = 5) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { balance, income, expenses } = await getBalance(session.userId)
  const recentTransactions = await getRecentTransactions(session.userId)

  return (
    <div className="py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-50">Ola, {session.name}</h1>
        {/* EyeToggle component */}
      </header>
      <HeroCard
        balance={balance}
        income={income}
        expenses={expenses}
        monthlyIncome={session.monthlyIncome}
      />
      {/* Recent transactions section */}
      {/* Quick actions section */}
    </div>
  )
}
```

### Semaphore Logic

```typescript
function getSemaphoreColor(balance: number, monthlyIncome: number): string {
  if (monthlyIncome <= 0) return "#10b981" // default green if no income set
  const ratio = balance / monthlyIncome
  if (ratio > 0.4) return "#10b981"   // green
  if (ratio > 0.1) return "#f59e0b"   // yellow
  return "#ef4444"                      // red
}
```

### Visual Design

- **Hero card:** `bg-zinc-800`, `rounded-2xl`, `shadow-lg`, `p-4`, `border-l-4` (cor semaforo)
- **Saldo:** `text-3xl font-bold tracking-tight` (display size)
- **Label "Saldo atual":** `text-sm text-zinc-400`
- **Subinfo receitas/despesas:** `text-xs text-zinc-400`
- **Transacao item:** `flex row`, `gap-3`, avatar `40x40 rounded-full`, nome `text-sm`, valor `text-sm font-semibold`
- **Empty state:** `text-center`, `text-zinc-500`, icone sutil
- **Header:** `flex justify-between items-center`, `pt-6`

### Accessibility

- Hero card: `aria-label="Saldo atual: R$ {valor}. Status: {status}"` (nao depender so da cor)
- Toggle olho: `aria-label="Ocultar valores"` / `"Exibir valores"`
- Transacoes: cada item com `aria-label` descritivo
- Saudacao: `h1` para hierarquia correta
- Skeleton: `aria-hidden="true"` (nao relevante para screen readers)
- `aria-live="polite"` no hero card para anunciar mudancas

### File Structure

```
src/
├── app/(app)/
│   ├── page.tsx             # Dashboard Server Component (ATUALIZAR)
│   └── loading.tsx          # Skeleton loading (ATUALIZAR)
├── components/
│   └── hero-card.tsx        # Hero card com semaforo (NOVO)
└── lib/
    └── queries.ts           # getBalance, getRecentTransactions (NOVO, opcional)
```

### CRITICO — Nao Fazer

- **NAO** buscar dados em Client Component — Server Component busca, Client renderiza
- **NAO** usar `useEffect` + `fetch` — usar Server Component direto
- **NAO** esquecer o semaforo (borda-left colorida)
- **NAO** hardcodar cores do semaforo — usar `SEMAPHORE_THRESHOLDS` de `constants.ts`
- **NAO** esquecer empty state quando nao houver transacoes
- **NAO** esquecer skeleton loading no formato correto
- **NAO** criar API Routes para dados — Prisma direto no Server Component

### References

- [Source: architecture.md#Frontend Architecture] Server vs Client Components pattern
- [Source: architecture.md#Communication Patterns] Data fetching direto
- [Source: epics.md#Story 2.2] Acceptance criteria completos
- [Source: ux-design-specification.md#HeroCard Component] Specs visuais
- [Source: ux-design-specification.md#Color System] Semaforo de saldo
- [Source: ux-design-specification.md#Feedback Patterns] Counter animation, skeleton

---

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
