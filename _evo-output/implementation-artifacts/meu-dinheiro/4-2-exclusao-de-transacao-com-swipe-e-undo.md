# Story 4.2: Exclusao de Transacao com Swipe e Undo

Status: done

**Depends on:** Story 4.1 (TransactionItem, lista de transacoes), Story 3.3 (createTransaction para undo)

## Story

As a usuario,
I want excluir uma transacao deslizando para a esquerda e ter a opcao de desfazer,
So that eu possa corrigir erros rapidamente sem medo de perder dados.

## Acceptance Criteria

1. **Given** o usuario esta na lista de transacoes **When** ele faz swipe para a esquerda em uma transacao **Then** um botao "Excluir" com background red-500 e revelado (FR21) **And** a animacao de swipe e suave e responsiva via Framer Motion drag gesture

2. **Given** o botao "Excluir" esta visivel **When** o usuario toca no botao **Then** o Server Action deleteTransaction e chamado com o id da transacao **And** a transacao e removida do banco (delete real, nao soft delete) **And** revalidatePath("/") e revalidatePath("/transactions") sao chamados **And** a transacao desaparece da lista com animacao de saida (slide out / fade out)

3. **Given** a transacao foi excluida **When** o toast de feedback aparece **Then** mostra "Transacao excluida" com botao "Desfazer" (FR22) **And** duracao do toast: 3 segundos **And** dark style (zinc-800 bg)

4. **Given** o usuario toca em "Desfazer" dentro dos 3 segundos **When** a acao de undo e executada **Then** a transacao e recriada chamando createTransaction com os mesmos dados (reusa Server Action da Story 3.3) **And** a lista atualiza e a transacao reaparece **And** revalidatePath("/") e revalidatePath("/transactions") sao chamados para atualizar dashboard e lista

5. **Given** o usuario nao toca em "Desfazer" **When** os 3 segundos expiram **Then** o toast desaparece **And** a exclusao e permanente (dados nao podem mais ser recuperados)

## Tasks / Subtasks

- [x] Task 1 (AC: #2) Criar Server Action deleteTransaction
  - [x] 1.1 Abrir src/actions/transactions.ts (arquivo existente da Story 3.3)
  - [x] 1.2 Adicionar schema Zod: z.object({ id: z.string().cuid() })
  - [x] 1.3 Implementar deleteTransaction(id: string) com "use server"
  - [x] 1.4 Chamar getSession() — retornar erro "Nao autorizado" se nao autenticado
  - [x] 1.5 Buscar transacao com prisma.transaction.findUnique({ where: { id } })
  - [x] 1.6 Verificar que transaction.userId === session.userId (ownership check)
  - [x] 1.7 Se transacao nao encontrada ou nao pertence ao usuario: retornar { success: false, error: "Transacao nao encontrada" }
  - [x] 1.8 Executar prisma.transaction.delete({ where: { id } }) — delete REAL
  - [x] 1.9 Chamar revalidatePath("/") e revalidatePath("/transactions")
  - [x] 1.10 Retornar { success: true, data: transaction } — retorna dados deletados para undo
  - [x] 1.11 Retorno deve seguir tipo ActionResponse<T>
- [x] Task 2 (AC: #1) Adicionar swipe-to-delete no TransactionItem
  - [x] 2.1 Abrir src/components/transaction-item.tsx (existente da Story 4.1)
  - [x] 2.2 Converter para Client Component se necessario — adicionar "use client"
  - [x] 2.3 Criar container relativo com overflow-hidden para conter o swipe
  - [x] 2.4 Posicionar botao "Excluir" atras do item (position absolute, right: 0)
  - [x] 2.5 Estilizar botao "Excluir": bg-red-500, text-white, icone de lixeira
  - [x] 2.6 Usar Framer Motion drag="x" no conteudo do item
  - [x] 2.7 Configurar dragConstraints={{ left: -80, right: 0 }} (revelar 80px do botao)
  - [x] 2.8 Configurar dragElastic={0.1} para sensacao responsiva
  - [x] 2.9 Usar onDragEnd para snap: se arrastou mais de 40px, manter aberto; senao, fechar
  - [x] 2.10 Animacao suave com transition={{ type: "spring", stiffness: 300, damping: 30 }}
- [x] Task 3 (AC: #2) Implementar acao de exclusao ao tocar "Excluir"
  - [x] 3.1 No onClick do botao "Excluir": armazenar dados da transacao em variavel local (para undo)
  - [x] 3.2 Chamar deleteTransaction(transaction.id) via Server Action
  - [x] 3.3 Se sucesso: animar saida do item (AnimatePresence + exit animation)
  - [x] 3.4 Se erro: mostrar toast de erro e resetar posicao do swipe
  - [x] 3.5 Usar estado isDeleting para mostrar loading visual e evitar cliques duplos
- [x] Task 4 (AC: #3, #4, #5) Implementar toast com undo
  - [x] 4.1 Apos exclusao bem-sucedida: chamar toast() do Sonner
  - [x] 4.2 Mensagem: "Transacao excluida"
  - [x] 4.3 Adicionar action: { label: "Desfazer", onClick: undoDelete }
  - [x] 4.4 Configurar duration: 3000 (3 segundos)
  - [x] 4.5 Estilizar com dark style: style: { background: cores zinc-800, color: zinc-50 }
  - [x] 4.6 Implementar funcao undoDelete: chamar createTransaction (da Story 3.3) com mesmos dados
  - [x] 4.7 Apos undo bem-sucedido: mostrar toast "Transacao restaurada"
  - [x] 4.8 Se undo falhar: mostrar toast de erro "Erro ao restaurar transacao"
- [x] Task 5 (AC: #1, #2) Animacoes de entrada/saida com AnimatePresence
  - [x] 5.1 Envolver lista de transacoes com AnimatePresence (se ainda nao estiver)
  - [x] 5.2 Adicionar exit animation no TransactionItem: { opacity: 0, x: -300, height: 0 }
  - [x] 5.3 Adicionar layout animation para itens remanescentes se reposicionarem suavemente
  - [x] 5.4 Quando undo restaura item: animar entrada { opacity: 0, x: -20 } -> { opacity: 1, x: 0 }

## Dev Notes

### Architecture & Patterns

- Server Action deleteTransaction em src/actions/transactions.ts — MESMO arquivo das outras actions de transacao
- Segue padrao ActionResponse<T> ja estabelecido no projeto
- Delete e REAL (prisma.transaction.delete), NAO soft delete
- Undo funciona recriando a transacao com createTransaction (reusa action existente da Story 3.3)
- Dados da transacao deletada sao armazenados temporariamente no estado local do Client Component
- Apos 3 segundos (toast expira), dados locais podem ser descartados — exclusao permanente

### Server Action — deleteTransaction

```typescript
// src/actions/transactions.ts (ATUALIZAR arquivo existente)
"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

const deleteTransactionSchema = z.object({
  id: z.string().cuid(),
})

export async function deleteTransaction(id: string): Promise<ActionResponse<Transaction>> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "Nao autorizado" }
  }

  const parsed = deleteTransactionSchema.safeParse({ id })
  if (!parsed.success) {
    return { success: false, error: "ID invalido" }
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: parsed.data.id },
  })

  if (!transaction || transaction.userId !== session.userId) {
    return { success: false, error: "Transacao nao encontrada" }
  }

  await prisma.transaction.delete({ where: { id: parsed.data.id } })

  revalidatePath("/")
  revalidatePath("/transactions")

  return { success: true, data: transaction }
}
```

### Swipe-to-Delete — TransactionItem

```typescript
// src/components/transaction-item.tsx (ATUALIZAR arquivo existente)
"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteTransaction } from "@/actions/transactions"
import { createTransaction } from "@/actions/transactions"

interface SwipeableTransactionItemProps {
  transaction: {
    id: string
    description: string
    amount: number
    type: "INCOME" | "EXPENSE"
    category: string
    date: Date
  }
}

export function SwipeableTransactionItem({ transaction }: SwipeableTransactionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const x = useMotionValue(0)

  // Opacidade do botao excluir baseada no arraste
  const deleteButtonOpacity = useTransform(x, [-80, -40, 0], [1, 0.5, 0])

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)

    // Armazenar dados para undo ANTES de deletar
    const deletedData = {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    }

    const result = await deleteTransaction(transaction.id)

    if (result.success) {
      toast("Transacao excluida", {
        action: {
          label: "Desfazer",
          onClick: async () => {
            const undoResult = await createTransaction(deletedData)
            if (undoResult.success) {
              toast("Transacao restaurada")
            } else {
              toast.error("Erro ao restaurar transacao")
            }
          },
        },
        duration: 3000,
        style: {
          background: "#27272a", // zinc-800
          color: "#fafafa",     // zinc-50
          border: "1px solid #3f3f46", // zinc-700
        },
      })
    } else {
      toast.error(result.error || "Erro ao excluir transacao")
      setIsDeleting(false)
      // Resetar posicao do swipe
      x.set(0)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: -300, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-lg"
    >
      {/* Botao Excluir (atras do item) */}
      <motion.div
        style={{ opacity: deleteButtonOpacity }}
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500"
      >
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-full w-full items-center justify-center text-white"
          aria-label="Excluir transacao"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Conteudo do item (arrastavel) */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -40) {
            x.set(-80) // Snap aberto
          } else {
            x.set(0) // Snap fechado
          }
        }}
        className="relative z-10 bg-zinc-900"
      >
        {/* Conteudo do TransactionItem existente aqui */}
        {/* ... renderizar descricao, valor, categoria, etc ... */}
      </motion.div>
    </motion.div>
  )
}
```

### AnimatePresence na Lista

```typescript
// Na lista de transacoes (parent component)
import { AnimatePresence } from "framer-motion"

<AnimatePresence mode="popLayout">
  {transactions.map((transaction) => (
    <SwipeableTransactionItem
      key={transaction.id}
      transaction={transaction}
    />
  ))}
</AnimatePresence>
```

### Toast Sonner — Configuracao de Estilo

```typescript
// Padrao de toast dark com undo
toast("Transacao excluida", {
  action: {
    label: "Desfazer",
    onClick: () => undoDelete(deletedTransaction),
  },
  duration: 3000,
  style: {
    background: "#27272a", // zinc-800
    color: "#fafafa",     // zinc-50
    border: "1px solid #3f3f46", // zinc-700
  },
})
```

### Undo — Reuso de createTransaction

```typescript
// Undo = chamar createTransaction com mesmos dados
async function undoDelete(deletedData: TransactionData) {
  const result = await createTransaction({
    description: deletedData.description,
    amount: deletedData.amount,
    type: deletedData.type,
    category: deletedData.category,
    date: deletedData.date,
  })

  if (result.success) {
    toast("Transacao restaurada")
    // revalidatePath ja e chamado dentro de createTransaction
  } else {
    toast.error("Erro ao restaurar transacao")
  }
}
```

### Drag Gesture — Detalhes Tecnicos

- `drag="x"` — permite arraste apenas no eixo horizontal
- `dragConstraints={{ left: -80, right: 0 }}` — limita arraste a 80px para esquerda
- `dragElastic={0.1}` — pequena elasticidade para sensacao natural (nao borrachuda)
- `onDragEnd` com `info.offset.x` — decide se snap aberto (-80) ou fechado (0)
- `useMotionValue(0)` para `x` — controla posicao sem re-renders
- `useTransform` para opacidade do botao — reativo ao arraste

### File Structure

```
src/actions/
└── transactions.ts           # ATUALIZAR — adicionar deleteTransaction

src/components/
└── transaction-item.tsx      # ATUALIZAR — adicionar swipe-to-delete com drag gesture
```

### CRITICO - Nao Fazer

- NAO usar soft delete (campo deletedAt) — usar prisma.transaction.delete() (delete real)
- NAO usar modal de confirmacao — o padrao e swipe + toast com undo (mais moderno e fluido)
- NAO esquecer de verificar ownership (transaction.userId === session.userId) antes de deletar
- NAO esquecer de retornar os dados da transacao deletada no response (necessario para undo)
- NAO esquecer revalidatePath para "/" E "/transactions" — ambos devem ser revalidados
- NAO criar state management complexo para undo — armazenar dados em variavel local/closure e suficiente
- NAO chamar prisma diretamente do Client Component — usar Server Actions
- NAO criar nova action para undo — reusar createTransaction da Story 3.3
- NAO usar dragDirectionLock — o arraste ja esta limitado ao eixo X com drag="x"
- NAO esquecer aria-label no botao "Excluir" para acessibilidade
- NAO esquecer de desabilitar botao durante isDeleting para evitar cliques duplos
- NAO esquecer AnimatePresence envolvendo a lista — sem ele, exit animations nao funcionam

### Testing Checklist

- [ ] Swipe para esquerda revela botao vermelho "Excluir" (bg-red-500)
- [ ] Animacao de swipe e suave e responsiva (sem travamentos)
- [ ] Swipe parcial (<40px) volta ao lugar (snap fechado)
- [ ] Swipe suficiente (>40px) mantem botao visivel (snap aberto)
- [ ] Tocar no botao "Excluir" deleta a transacao do banco
- [ ] Transacao desaparece da lista com animacao de saida
- [ ] Toast "Transacao excluida" aparece com botao "Desfazer"
- [ ] Toast tem estilo dark (zinc-800 bg, zinc-50 text)
- [ ] Toast dura exatamente 3 segundos
- [ ] Clicar "Desfazer" recria a transacao com mesmos dados
- [ ] Apos undo, transacao reaparece na lista
- [ ] Apos undo, dashboard (saldo) e atualizado
- [ ] Se nao clicar "Desfazer", exclusao e permanente
- [ ] Nao e possivel deletar transacao de outro usuario (ownership check)
- [ ] Usuario nao autenticado recebe erro "Nao autorizado"
- [ ] ID invalido retorna erro adequado (validacao Zod)
- [ ] Clique duplo no botao "Excluir" nao causa erro (isDeleting guard)
- [ ] Itens remanescentes se reposicionam suavemente (layout animation)
- [ ] Funciona em mobile (touch) e desktop (mouse drag)

### References

- [Source: architecture.md#Server Actions] Padrao de Server Actions com Zod + getSession
- [Source: architecture.md#Frontend Architecture] Client Components com Framer Motion
- [Source: epics.md#Story 4.2] Acceptance criteria — swipe-to-delete + undo
- [Source: ux-design-specification.md#Feedback Patterns] Toast com undo, 3 segundos
- [Source: ux-design-specification.md#Gestures] Swipe-to-delete com Framer Motion drag
- [Source: prd.md#FR21] Swipe para exclusao com botao vermelho
- [Source: prd.md#FR22] Toast "Transacao excluida" com botao "Desfazer"

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References

### Completion Notes List
- Server Action deleteTransaction com validacao Zod, ownership check, delete real, revalidatePath
- Swipe-to-delete no TransactionItem com Framer Motion drag="x", dragConstraints, snap logic
- Botao "Excluir" com bg-red-500, icone Trash2, disabled durante isDeleting
- Toast Sonner "Transacao excluida" com undo via createTransaction, duracao 3s, estilo dark
- Exit animation { opacity: 0, x: -300, height: 0 } com AnimatePresence mode="popLayout"
- Layout animation para reposicionamento suave dos itens restantes
- 6 testes unitarios para deleteTransaction (auth, ownership, validation, success, error)
- 98 testes totais passando, 0 regressoes, build bem-sucedido

### Change Log
- 2026-03-19: Implementacao completa da Story 4.2 — todos os 5 tasks e subtasks concluidos

### File List
- src/actions/transactions.ts (modificado — adicionado deleteTransaction server action)
- src/components/transaction-item.tsx (modificado — swipe-to-delete, delete handler, toast+undo)
- src/components/transactions-list.tsx (modificado — AnimatePresence mode="popLayout")
- src/__tests__/delete-transaction.test.ts (novo — testes do deleteTransaction)
