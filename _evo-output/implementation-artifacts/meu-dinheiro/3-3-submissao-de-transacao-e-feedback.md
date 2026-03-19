# Story 3.3: Submissao de Transacao e Feedback

Status: done

**Depends on:** Story 3.1 (BottomSheet component), Story 3.2 (NumericKeypad, CategoryGrid), Story 1.1 (Prisma schema com Transaction model, ActionResponse<T>, formatCurrency), Story 1.2 (Server Action pattern de referencia)

## Story

As a usuario,
I want confirmar o registro da transacao e receber feedback visual,
So that eu saiba que a transacao foi salva com sucesso e veja o impacto no dashboard.

## Acceptance Criteria

1. **Given** o usuario digitou um valor > 0 e selecionou uma categoria **When** ele toca no botao "Registrar" (emerald-500, full-width, h-12) **Then** o Server Action createTransaction e chamado com: amount, type (income/expense), categoryId, description opcional **And** a validacao zod server-side confirma todos os campos (NFR11) **And** a transacao e criada no banco com o userId da sessao **And** revalidatePath("/") e revalidatePath("/transactions") sao chamados

2. **Given** a transacao foi salva com sucesso **When** o feedback e exibido **Then** o botao pulsa (scale 0.95 → 1.0, 100ms) **Then** o bottom sheet desce com animacao (300ms ease-in) (FR16) **And** toast Sonner aparece: "Transacao salva" com icone checkmark emerald-500 **And** toast dark style (zinc-800 bg, zinc-50 text), posicao bottom-center, duracao 3s **And** o dashboard atualiza automaticamente (hero card recalcula saldo com counter, semaforo ajusta cor, nova transacao aparece com slide-in)

3. **Given** o usuario nao preencheu valor ou nao selecionou categoria **When** ele toca em "Registrar" **Then** o botao nao submete (disabled state) **And** campos faltantes sao indicados visualmente

4. **Given** um erro no servidor ao salvar **When** o Server Action retorna { success: false, error: "..." } **Then** toast.error exibe a mensagem de erro **And** o bottom sheet permanece aberto para o usuario corrigir

5. **Given** a tabela Transaction no banco **When** uma transacao e criada **Then** o schema tem: id (cuid), amount (float), type ("income"/"expense"), description (string?), categoryId, userId, createdAt **And** indices em [userId, createdAt] e [userId, type] existem para queries eficientes

## Tasks / Subtasks

- [x] Task 1 (AC: #1, #5) Criar Server Action createTransaction
  - [x] 1.1 Criar src/actions/transactions.ts com "use server" no topo
  - [x] 1.2 Definir createTransactionSchema com zod: amount (z.number().positive()), type (z.enum(["income", "expense"])), categoryId (z.string().cuid()), description (z.string().optional())
  - [x] 1.3 Implementar funcao async createTransaction(data) que retorna ActionResponse<Transaction>
  - [x] 1.4 Chamar getSession() de src/lib/auth.ts — retornar { success: false, error: "Nao autorizado" } se nao autenticado
  - [x] 1.5 Validar com createTransactionSchema.safeParse(data) — retornar { success: false, error: "Dados invalidos" } se falhar
  - [x] 1.6 Criar transacao via prisma.transaction.create({ data: { ...parsed.data, userId: session.userId } })
  - [x] 1.7 Chamar revalidatePath("/") e revalidatePath("/transactions") apos criacao
  - [x] 1.8 Retornar { success: true, data: transaction }
  - [x] 1.9 Envolver em try/catch — retornar { success: false, error: "Erro ao salvar transacao" } em caso de excecao
- [x] Task 2 (AC: #1, #5) Verificar schema Prisma (Transaction model)
  - [x] 2.1 Confirmar que o model Transaction existe em prisma/schema.prisma com campos: id (String @id @default(cuid())), amount (Float), type (String), description (String?), categoryId (String), userId (String), createdAt (DateTime @default(now()))
  - [x] 2.2 Confirmar indice @@index([userId, createdAt]) existe
  - [x] 2.3 Confirmar indice @@index([userId, type]) existe
  - [x] 2.4 Se indices nao existem, adicionar e rodar npx prisma db push
- [x] Task 3 (AC: #1, #3) Integrar botao "Registrar" no BottomSheet
  - [x] 3.1 Atualizar src/components/bottom-sheet.tsx para incluir botao "Registrar"
  - [x] 3.2 Botao: bg-emerald-500 hover:bg-emerald-600, text-white, font-semibold, w-full, h-12, rounded-lg
  - [x] 3.3 Usar useTransition() do React para gerenciar estado pending
  - [x] 3.4 Durante pending: botao mostra spinner/loading e fica disabled
  - [x] 3.5 Disabled state: quando amount === 0 OU categoryId nao selecionado OU isPending
  - [x] 3.6 Visual disabled: opacity-50, cursor-not-allowed
  - [x] 3.7 Campos faltantes indicados visualmente (borda vermelha ou texto de aviso)
- [x] Task 4 (AC: #1) Conectar form state ao Server Action
  - [x] 4.1 No handler de submit, coletar: amount (number), type ("income"/"expense"), categoryId (string), description (string opcional)
  - [x] 4.2 Chamar startTransition(() => { createTransaction(data).then(handleResult) })
  - [x] 4.3 handleResult verifica response.success para decidir feedback
- [x] Task 5 (AC: #2) Implementar feedback de sucesso
  - [x] 5.1 Animacao de pulse no botao com Framer Motion: animate={{ scale: [0.95, 1.0] }} transition={{ duration: 0.1 }}
  - [x] 5.2 Fechar bottom sheet com animacao (300ms ease-in) apos pulse
  - [x] 5.3 Exibir toast.success("Transacao salva") com configuracao Sonner
  - [x] 5.4 Resetar form state (amount = 0, categoryId = null, description = "")
- [x] Task 6 (AC: #2) Configurar Sonner toast global
  - [x] 6.1 Garantir que <Toaster /> esta no layout (src/app/layout.tsx)
  - [x] 6.2 Configurar Toaster: position="bottom-center", toastOptions com style dark (bg zinc-800, text zinc-50), duration 3000
  - [x] 6.3 Toast de sucesso: icone checkmark com cor emerald-500
- [x] Task 7 (AC: #4) Implementar feedback de erro
  - [x] 7.1 Se response.success === false: chamar toast.error(response.error)
  - [x] 7.2 Bottom sheet permanece aberto (NAO fechar)
  - [x] 7.3 Botao volta ao estado normal (nao pending, nao disabled)
  - [x] 7.4 Usuario pode corrigir e tentar novamente

## Dev Notes

### Architecture & Patterns

- **Server Actions only** — NAO usar API Routes (Next.js App Router pattern)
- Server Action em src/actions/transactions.ts com "use server" directive
- Validacao zod obrigatoria server-side — NUNCA confiar no client
- ActionResponse<T> type padrao do projeto: `{ success: boolean, data?: T, error?: string }`
- getSession() de src/lib/auth.ts para obter userId da sessao ativa
- Prisma Client singleton em src/lib/db.ts (importar como `prisma`)
- revalidatePath() apos mutacoes para invalidar cache do Next.js e atualizar dashboard
- useTransition() do React para pending state no botao (evita bloquear UI)

### Implementation Pattern — Server Action

```typescript
// src/actions/transactions.ts
"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const createTransactionSchema = z.object({
  amount: z.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().cuid("Categoria invalida"),
  description: z.string().optional(),
})

type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export async function createTransaction(data: CreateTransactionInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const parsed = createTransactionSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false as const, error: "Dados invalidos" }
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...parsed.data,
        userId: session.userId,
      },
    })

    revalidatePath("/")
    revalidatePath("/transactions")

    return { success: true as const, data: transaction }
  } catch (error) {
    console.error("Erro ao criar transacao:", error)
    return { success: false as const, error: "Erro ao salvar transacao" }
  }
}
```

### Implementation Pattern — Client Integration (BottomSheet)

```typescript
// Dentro do componente BottomSheet (src/components/bottom-sheet.tsx)
"use client"

import { useTransition } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { createTransaction } from "@/actions/transactions"

// Dentro do componente:
const [isPending, startTransition] = useTransition()

// Estado do form (vindo de Story 3.2 — NumericKeypad e CategoryGrid):
// amount: number, type: "income" | "expense", categoryId: string | null, description: string

const isFormValid = amount > 0 && categoryId !== null

async function handleSubmit() {
  if (!isFormValid || isPending) return

  startTransition(async () => {
    const result = await createTransaction({
      amount,
      type,
      categoryId: categoryId!, // validado pelo isFormValid
      description: description || undefined,
    })

    if (result.success) {
      // 1. Pulse animation no botao (controlado via state)
      setShowPulse(true)
      setTimeout(() => setShowPulse(false), 100)

      // 2. Fechar bottom sheet apos pulse (300ms)
      setTimeout(() => {
        onClose() // fecha o bottom sheet com animacao
      }, 200)

      // 3. Toast de sucesso
      toast.success("Transacao salva", {
        icon: "✓",
        duration: 3000,
      })

      // 4. Reset form
      setAmount(0)
      setCategoryId(null)
      setDescription("")
    } else {
      // Erro: toast + manter bottom sheet aberto
      toast.error(result.error || "Erro ao salvar transacao")
    }
  })
}
```

### Implementation Pattern — Botao Registrar

```tsx
// Botao dentro do BottomSheet
<motion.button
  onClick={handleSubmit}
  disabled={!isFormValid || isPending}
  animate={showPulse ? { scale: [0.95, 1.0] } : {}}
  transition={{ duration: 0.1 }}
  className={cn(
    "w-full h-12 rounded-lg font-semibold text-white transition-colors",
    isFormValid && !isPending
      ? "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
      : "bg-emerald-500/50 opacity-50 cursor-not-allowed"
  )}
>
  {isPending ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Salvando...
    </span>
  ) : (
    "Registrar"
  )}
</motion.button>
```

### Implementation Pattern — Sonner Toaster Config

```tsx
// src/app/layout.tsx — garantir que Toaster esta presente
import { Toaster } from "sonner"

// No layout:
<Toaster
  position="bottom-center"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#27272a", // zinc-800
      color: "#fafafa",      // zinc-50
      border: "1px solid #3f3f46", // zinc-700
    },
  }}
/>
```

### Implementation Pattern — Toast de Sucesso com Icone

```typescript
toast.success("Transacao salva", {
  icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  duration: 3000,
})
// OU se nao tiver Lucide:
toast.success("Transacao salva", {
  icon: "✓",
  duration: 3000,
})
```

### Prisma Schema (referencia — JA EXISTE de Story 1.1)

```prisma
model Transaction {
  id          String   @id @default(cuid())
  amount      Float
  type        String   // "income" ou "expense"
  description String?
  categoryId  String
  userId      String
  createdAt   DateTime @default(now())

  category    Category @relation(fields: [categoryId], references: [id])
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
  @@index([userId, type])
}
```

### Fluxo Completo (Sequencia)

1. Usuario abre bottom sheet (Story 3.1)
2. Usuario digita valor no NumericKeypad (Story 3.2)
3. Usuario seleciona categoria no CategoryGrid (Story 3.2)
4. Usuario (opcional) adiciona descricao
5. Botao "Registrar" fica habilitado (amount > 0 && categoryId !== null)
6. Usuario toca em "Registrar"
7. useTransition inicia — botao mostra loading spinner
8. Server Action createTransaction e chamado
9. Zod valida server-side
10. getSession() verifica autenticacao
11. prisma.transaction.create() salva no banco
12. revalidatePath("/") e revalidatePath("/transactions") invalidam cache
13. Sucesso: botao pulsa (100ms) → bottom sheet fecha (300ms) → toast "Transacao salva" (3s)
14. Dashboard atualiza automaticamente (hero card recalcula, semaforo ajusta, nova transacao aparece)
15. Erro: toast.error() exibe mensagem, bottom sheet permanece aberto

### Dashboard Auto-Update

- revalidatePath("/") faz o Next.js re-renderizar a page "/" (dashboard)
- O Server Component do dashboard re-executa as queries (saldo, transacoes)
- HeroCard recebe novo valor → AnimatedCounter anima ate novo saldo (Story 2.3)
- Semaforo ajusta cor baseado no novo saldo (Story 2.2)
- Lista de transacoes inclui a nova transacao com slide-in animation

### File Structure

```
src/actions/
└── transactions.ts          # createTransaction Server Action (NOVO - esta story)

src/components/
└── bottom-sheet.tsx         # UPDATE - integrar botao Registrar, form state, submit handler

src/app/
└── layout.tsx               # UPDATE - garantir <Toaster /> configurado com dark style
```

### CRITICO - Nao Fazer

- NAO usar API Routes (GET/POST /api/...) — Server Actions APENAS
- NAO pular validacao zod server-side — NUNCA confiar em dados do client
- NAO retornar dados sensiveis (password, tokens) no response do Server Action
- NAO esquecer revalidatePath para AMBOS "/" e "/transactions"
- NAO esquecer disabled state quando amount === 0 ou categoryId nao selecionado
- NAO esquecer toast feedback tanto para sucesso quanto para erro
- NAO criar o model Transaction no Prisma — ele JA EXISTE de Story 1.1
- NAO esquecer useTransition para pending state — sem ele a UI trava durante a request
- NAO fechar o bottom sheet em caso de erro — manter aberto para o usuario corrigir
- NAO usar useState para controlar loading — usar useTransition (isPending) do React
- NAO esquecer try/catch no Server Action — erros de banco devem ser capturados
- NAO esquecer de resetar o form apos sucesso (amount, categoryId, description)
- NAO criar subpasta meudinheiro/ — o projeto JA E o live-01

### Testing Checklist

- [ ] Server Action createTransaction salva transacao no banco com dados corretos
- [ ] Validacao zod rejeita amount <= 0, type invalido, categoryId invalido
- [ ] Retorna erro "Nao autorizado" quando sessao nao existe
- [ ] revalidatePath chamado para "/" e "/transactions" apos sucesso
- [ ] Botao "Registrar" disabled quando amount === 0
- [ ] Botao "Registrar" disabled quando categoryId nao selecionado
- [ ] Botao mostra spinner durante isPending
- [ ] Botao pulsa (scale 0.95 → 1.0) apos sucesso
- [ ] Bottom sheet fecha com animacao apos sucesso
- [ ] Toast "Transacao salva" aparece com estilo dark (zinc-800/zinc-50)
- [ ] Toast posicionado bottom-center com duracao 3s
- [ ] Toast icone checkmark com cor emerald-500
- [ ] Erro do servidor exibe toast.error com mensagem
- [ ] Bottom sheet permanece aberto em caso de erro
- [ ] Form reseta apos sucesso (amount=0, categoryId=null, description="")
- [ ] Dashboard atualiza automaticamente apos salvar (saldo, semaforo, lista)
- [ ] Campos faltantes indicados visualmente quando usuario tenta submeter

### References

- [Source: architecture.md#Server Actions] Pattern de Server Action com zod validation
- [Source: architecture.md#Data Layer] Prisma Client singleton, Transaction model
- [Source: epics.md#Story 3.3] Acceptance criteria originais
- [Source: ux-design-specification.md#Feedback Patterns] Toast dark style, button pulse
- [Source: ux-design-specification.md#Bottom Sheet] Animacao de fechar 300ms ease-in
- [Source: ux-design-specification.md#Color Tokens] emerald-500, zinc-800, zinc-50

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- createTransaction server action: 6 tests pass (auth, validation, success, error handling)
- Full suite: 71 tests pass, zero regressions
- Build: compiled successfully, no TypeScript errors

### Completion Notes List
- Created Server Action createTransaction in src/actions/transactions.ts with zod validation, session auth, prisma create, revalidatePath for "/" and "/transactions"
- Updated TransactionForm to include Registrar button with useTransition pending state, pulse animation (scale 0.95->1.0), spinner loading
- Button disabled when amount=0 or no category selected, with opacity-50 visual
- Success flow: pulse -> close bottom sheet -> toast.success("Transacao salva") with CheckCircle icon
- Error flow: toast.error with message, bottom sheet stays open
- Form resets after success (rawDigits, categoryId, description)
- Configured Sonner Toaster in root layout: bottom-center, dark style (zinc-800/zinc-50/zinc-700 border), 3s duration
- Verified Prisma schema has Transaction model with correct indices

### File List
- src/actions/transactions.ts (NEW)
- src/components/transaction-form.tsx (MODIFIED - added submit logic, useTransition, toast, pulse)
- src/components/transaction-fab-wrapper.tsx (MODIFIED - pass onSuccess callback)
- src/app/layout.tsx (MODIFIED - added Toaster)
- src/__tests__/create-transaction.test.ts (NEW)
