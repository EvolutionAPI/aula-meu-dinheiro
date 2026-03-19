# Story 3.1: FAB e Bottom Sheet de Registro de Transacao

Status: ready-for-dev

**Depends on:** Story 2.1 (layout do app com bottom navigation e container 428px)

## Story

As a usuario,
I want tocar no botao "+" flutuante e ver um bottom sheet para registrar uma transacao,
So that eu possa iniciar o registro de qualquer tela do app de forma rapida.

## Acceptance Criteria

1. **Given** o usuario esta em qualquer tela do grupo (app) **When** a tela e renderizada **Then** um FAB (Floating Action Button) "+" e exibido no canto inferior direito, acima da bottom nav (FR17) **And** o FAB tem 56x56px, background emerald-500, icone "+" branco, shadow-lg com emerald-500/20 **And** aria-label="Adicionar nova transacao" **And** z-index 50

2. **Given** o usuario toca no FAB **When** o bottom sheet e aberto **Then** o bottom sheet sobe com animacao slide-up 300ms ease-out (Framer Motion) **And** backdrop zinc-950/80 aparece atras **And** o bottom sheet ocupa ~85% da tela **And** tem drag handle (barra zinc-600, 40x4px, rounded) no topo **And** role="dialog", aria-modal="true" **And** focus trap e ativado dentro do bottom sheet

3. **Given** o bottom sheet esta aberto **When** o usuario arrasta para baixo, toca no backdrop ou pressiona Escape **Then** o bottom sheet fecha com animacao slide-down 300ms ease-in **And** focus retorna ao FAB **And** o FAB volta a ficar visivel

4. **Given** o bottom sheet **When** implementado **Then** usa dynamic import para otimizacao de bundle (NFR5) **And** o FAB desabilita (zinc-600) enquanto o bottom sheet esta aberto

5. **Given** o usuario tem prefers-reduced-motion ativado **When** o FAB e pressionado e o bottom sheet abre ou fecha **Then** as animacoes sao desabilitadas e as transicoes sao instantaneas (NFR17)

6. **Given** o FAB **When** o usuario pressiona (mousedown/touchstart) **Then** o FAB tem spring animation com scale(0.95) como feedback visual **And** ao soltar retorna a scale(1)

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, #6) Criar componente FAB (fab.tsx)
  - [ ] 1.1 Criar src/components/fab.tsx como Client Component ("use client")
  - [ ] 1.2 Botao 56x56px com rounded-full, bg-emerald-500, shadow-lg
  - [ ] 1.3 Shadow customizada: shadow-emerald-500/20 (sombra esverdeada)
  - [ ] 1.4 Icone "+" branco centralizado usando Plus do lucide-react (24px)
  - [ ] 1.5 aria-label="Adicionar nova transacao"
  - [ ] 1.6 Posicao: fixed, bottom-right, acima da bottom nav (bottom: 64px + safe-area + 16px gap)
  - [ ] 1.7 z-index: 50 (z-50)
  - [ ] 1.8 Respeitar max-width 428px do container — posicionar relativo ao container, nao a tela toda
  - [ ] 1.9 Press animation: Framer Motion whileTap={{ scale: 0.95 }} com spring transition
  - [ ] 1.10 Estado disabled: bg-zinc-600, pointer-events-none, opacity reduzida quando bottom sheet aberto
  - [ ] 1.11 Props: onClick (callback), disabled (boolean)
  - [ ] 1.12 Focus visible: focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
  - [ ] 1.13 Hover state: bg-emerald-600 transition-colors
- [ ] Task 2 (AC: #2, #3, #5) Criar componente BottomSheet (bottom-sheet.tsx)
  - [ ] 2.1 Criar src/components/bottom-sheet.tsx como Client Component ("use client")
  - [ ] 2.2 Props: isOpen (boolean), onClose (callback), children (ReactNode)
  - [ ] 2.3 Backdrop: fixed inset-0, bg-zinc-950/80, z-50
  - [ ] 2.4 Sheet container: fixed bottom-0, w-full, max-w-[428px], mx-auto, left-0, right-0
  - [ ] 2.5 Sheet height: h-[85vh] (85% da viewport)
  - [ ] 2.6 Sheet background: bg-zinc-900, rounded-t-2xl
  - [ ] 2.7 Drag handle: div 40x4px (w-10 h-1), bg-zinc-600, rounded-full, centralizado no topo com padding (pt-3 pb-2)
  - [ ] 2.8 Animacao de abertura: Framer Motion animate y: 0, transition 300ms ease-out
  - [ ] 2.9 Animacao de fechamento: Framer Motion exit y: "100%", transition 300ms ease-in
  - [ ] 2.10 AnimatePresence no wrapper para animar mount/unmount
  - [ ] 2.11 Backdrop fade-in/fade-out: opacity 0 -> 1 na abertura, 1 -> 0 no fechamento
  - [ ] 2.12 Fechar ao clicar/tocar no backdrop (onClick no backdrop)
  - [ ] 2.13 Fechar ao pressionar Escape (useEffect com keydown listener)
  - [ ] 2.14 role="dialog", aria-modal="true" no sheet container
  - [ ] 2.15 aria-label="Registrar transacao" no sheet container
  - [ ] 2.16 children renderizado dentro do sheet (conteudo vira em Stories 3.2 e 3.3)
  - [ ] 2.17 Overflow-y: auto no container de conteudo (para scroll interno se necessario)
- [ ] Task 3 (AC: #2, #3) Implementar drag-to-dismiss no BottomSheet
  - [ ] 3.1 Usar Framer Motion drag="y" com dragConstraints={{ top: 0 }}
  - [ ] 3.2 dragElastic={{ top: 0, bottom: 0.4 }} (resistencia ao arrastar para cima, elasticidade para baixo)
  - [ ] 3.3 onDragEnd: se dragOffset.y > 100px (threshold), chamar onClose()
  - [ ] 3.4 Se dragOffset.y <= threshold, animar de volta para y: 0 (snap back)
  - [ ] 3.5 Drag apenas pelo header/handle area (nao pelo conteudo inteiro, para nao conflitar com scroll)
- [ ] Task 4 (AC: #2, #3) Implementar focus trap e gerenciamento de foco
  - [ ] 4.1 Ao abrir: salvar referencia do elemento que tinha foco (FAB)
  - [ ] 4.2 Ao abrir: mover foco para o primeiro elemento focavel dentro do sheet (ou o proprio sheet)
  - [ ] 4.3 Focus trap: Tab e Shift+Tab cicla apenas dentro do sheet
  - [ ] 4.4 Ao fechar: restaurar foco ao elemento salvo (FAB)
  - [ ] 4.5 Implementar com useRef e useEffect (nao precisa de lib externa)
  - [ ] 4.6 Prevenir scroll do body quando sheet esta aberto (overflow: hidden no body)
- [ ] Task 5 (AC: #5) Implementar prefers-reduced-motion
  - [ ] 5.1 Usar useReducedMotion() do Framer Motion
  - [ ] 5.2 Se reduced motion: sheet aparece/desaparece instantaneamente (duration: 0)
  - [ ] 5.3 Se reduced motion: FAB nao tem scale animation no press
  - [ ] 5.4 Se reduced motion: backdrop aparece/desaparece instantaneamente
- [ ] Task 6 (AC: #4) Integrar FAB + BottomSheet no layout do app
  - [ ] 6.1 No layout (app) ou em um wrapper Client Component, importar FAB
  - [ ] 6.2 Dynamic import do BottomSheet: const BottomSheet = dynamic(() => import("@/components/bottom-sheet").then(m => m.BottomSheet), { ssr: false })
  - [ ] 6.3 Estado local: useState para isSheetOpen (boolean)
  - [ ] 6.4 FAB onClick: setIsSheetOpen(true)
  - [ ] 6.5 FAB disabled={isSheetOpen}
  - [ ] 6.6 BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}
  - [ ] 6.7 Placeholder children no BottomSheet: texto "Formulario de registro (Story 3.2)" para verificar que funciona
  - [ ] 6.8 Criar src/components/transaction-fab-wrapper.tsx como Client Component wrapper que gerencia estado e renderiza FAB + BottomSheet
  - [ ] 6.9 No layout (app) server component, importar e renderizar TransactionFabWrapper

## Dev Notes

### Architecture & Patterns

- **FAB** e **BottomSheet** sao Client Components ("use client") — requerem interatividade e Framer Motion
- O layout (app) e Server Component — nao pode ter useState. Por isso, criar um **TransactionFabWrapper** (Client Component) que encapsula FAB + BottomSheet + estado
- **Dynamic import** do BottomSheet dentro do wrapper — o BottomSheet so carrega quando o usuario clica no FAB (bundle optimization, NFR5)
- O BottomSheet nesta story e apenas o **container/shell** — o conteudo interno (teclado numerico, categorias, botao salvar) vem nas Stories 3.2 e 3.3
- **Focus trap** implementado manualmente com useRef/useEffect — sem dependencia externa
- **Framer Motion** para todas as animacoes: slide-up/down do sheet, fade do backdrop, scale do FAB, drag-to-dismiss

### TransactionFabWrapper Pattern (Integracao)
```typescript
// src/components/transaction-fab-wrapper.tsx
"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Fab } from "@/components/fab"

const BottomSheet = dynamic(
  () => import("@/components/bottom-sheet").then((m) => m.BottomSheet),
  { ssr: false }
)

export function TransactionFabWrapper() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpen = useCallback(() => setIsSheetOpen(true), [])
  const handleClose = useCallback(() => setIsSheetOpen(false), [])

  return (
    <>
      <Fab onClick={handleOpen} disabled={isSheetOpen} />
      {isSheetOpen && (
        <BottomSheet isOpen={isSheetOpen} onClose={handleClose}>
          {/* Conteudo do formulario vem na Story 3.2 */}
          <div className="flex items-center justify-center p-8 text-zinc-400">
            Formulario de registro (Story 3.2)
          </div>
        </BottomSheet>
      )}
    </>
  )
}
```

### FAB Component Pattern
```typescript
// src/components/fab.tsx
"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FabProps {
  onClick: () => void
  disabled?: boolean
}

export function Fab({ onClick, disabled }: FabProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label="Adicionar nova transacao"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "shadow-lg shadow-emerald-500/20",
        "focus-visible:ring-2 focus-visible:ring-emerald-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "transition-colors",
        disabled
          ? "bg-zinc-600 pointer-events-none opacity-60"
          : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
      )}
      style={{
        // Posiciona dentro do container 428px, bottom-right, acima da bottom nav
        // bottom: 64px (nav) + safe-area + 16px gap
        // right: 24px (padding do container)
        bottom: "calc(64px + env(safe-area-inset-bottom) + 16px)",
        right: "max(24px, calc((100vw - 428px) / 2 + 24px))",
      }}
    >
      <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
    </motion.button>
  )
}
```

### Posicionamento do FAB
O FAB precisa ficar posicionado **dentro do container de 428px**, nao colado na borda da tela. O calculo do `right` e:
- Em telas <= 428px: `right: 24px` (alinhado com o padding do container)
- Em telas > 428px: `right: calc((100vw - 428px) / 2 + 24px)` — deslocado para ficar dentro do container centralizado
- Usar `max()` para pegar o maior valor e funcionar em ambos os cenarios
- Bottom: 64px (altura da nav) + safe-area + 16px de gap

### BottomSheet Component Pattern
```typescript
// src/components/bottom-sheet.tsx
"use client"

import { useEffect, useRef, useCallback } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "framer-motion"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const DRAG_CLOSE_THRESHOLD = 100

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const shouldReduceMotion = useReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Salvar foco anterior e mover foco para o sheet
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Pequeno delay para garantir que o sheet renderizou
      requestAnimationFrame(() => {
        sheetRef.current?.focus()
      })
      // Prevenir scroll do body
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      // Restaurar foco
      previousFocusRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Escape para fechar
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return

    const sheet = sheetRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusableElements = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    sheet.addEventListener("keydown", handleKeyDown)
    return () => sheet.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Drag-to-dismiss handler
  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > DRAG_CLOSE_THRESHOLD) {
        onClose()
      }
    },
    [onClose]
  )

  const animationDuration = shouldReduceMotion ? 0 : 0.3

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-zinc-950/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animationDuration }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Registrar transacao"
            tabIndex={-1}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto h-[85vh] max-w-[428px] rounded-t-2xl bg-zinc-900 outline-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: animationDuration,
              ease: isOpen ? [0.32, 0.72, 0, 1] : [0.32, 0, 0.67, 0],
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            dragListener={false}
            dragControls={undefined}
          >
            {/* Drag Handle — area arrastavel */}
            <motion.div
              className="flex cursor-grab items-center justify-center pb-2 pt-3 active:cursor-grabbing"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              style={{ touchAction: "none" }}
            >
              <div className="h-1 w-10 rounded-full bg-zinc-600" />
            </motion.div>

            {/* Conteudo scrollavel */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 28px)" }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Nota sobre drag-to-dismiss:** O drag deve funcionar apenas na area do handle no topo, nao no conteudo inteiro. Isso evita conflito com scroll interno do conteudo. A implementacao exata do drag no handle area pode precisar de ajuste — a abordagem acima mostra o conceito. Na pratica, considere usar `dragControls` do Framer Motion para controlar o drag do sheet inteiro a partir do handle.

### Integracao no Layout
```typescript
// src/app/(app)/layout.tsx — adicionar TransactionFabWrapper
import { BottomNav } from "@/components/bottom-nav"
import { TransactionFabWrapper } from "@/components/transaction-fab-wrapper"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[428px] px-6 pb-24">
        {children}
      </main>
      <BottomNav />
      <TransactionFabWrapper />
    </div>
  )
}
```

### Focus Trap — Implementacao Manual
Nao usar biblioteca externa. O focus trap funciona assim:
1. Ao abrir o sheet, salvar `document.activeElement` em um ref
2. Mover foco para o sheet (via `sheetRef.current?.focus()`)
3. Interceptar Tab/Shift+Tab: se foco esta no ultimo elemento e Tab, ir para primeiro; se foco esta no primeiro e Shift+Tab, ir para ultimo
4. Ao fechar, restaurar foco ao elemento salvo (FAB)
5. Bloquear scroll do body com `document.body.style.overflow = "hidden"`

### Dynamic Import (Bundle Optimization)
```typescript
// O BottomSheet e carregado APENAS quando o usuario clica no FAB
// Isso reduz o bundle inicial da pagina (NFR5)
const BottomSheet = dynamic(
  () => import("@/components/bottom-sheet").then((m) => m.BottomSheet),
  { ssr: false }
)
```
- `ssr: false` porque o BottomSheet usa animacoes e refs que nao fazem sentido no server
- O import acontece no primeiro render do wrapper (quando isSheetOpen muda para true)
- Usar `{ ssr: false }` e nao `{ loading: () => null }` — o sheet ja tem AnimatePresence

### Visual Design
- **FAB:** 56x56px, bg-emerald-500, rounded-full, shadow-lg shadow-emerald-500/20
- **FAB hover:** bg-emerald-600
- **FAB disabled:** bg-zinc-600, opacity-60, pointer-events-none
- **FAB press:** scale(0.95) via Framer Motion spring
- **FAB position:** fixed, canto inferior direito, 24px da borda, 16px acima da nav
- **Sheet:** bg-zinc-900, rounded-t-2xl, h-[85vh]
- **Sheet handle:** 40x4px (w-10 h-1), bg-zinc-600, rounded-full, centralizado
- **Backdrop:** bg-zinc-950/80 (80% opacidade)

### Accessibility
- FAB: `aria-label="Adicionar nova transacao"`
- FAB: `focus-visible:ring-2` para navegacao via teclado
- Sheet: `role="dialog"`, `aria-modal="true"`, `aria-label="Registrar transacao"`
- Sheet: focus trap ativo (Tab/Shift+Tab cicla dentro do sheet)
- Sheet: Escape fecha o sheet
- Sheet: foco restaurado ao FAB ao fechar
- Body scroll bloqueado enquanto sheet esta aberto
- prefers-reduced-motion respeitado em todas as animacoes

### File Structure
```
src/
├── components/
│   ├── fab.tsx                       # FloatingActionButton (NOVO)
│   ├── bottom-sheet.tsx              # BottomSheet container (NOVO)
│   └── transaction-fab-wrapper.tsx   # Wrapper com estado + dynamic import (NOVO)
└── app/(app)/
    └── layout.tsx                    # Adicionar TransactionFabWrapper (MODIFICAR)
```

### CRITICO - Nao Fazer
- NAO colocar o formulario de registro nesta story — apenas o container/shell do BottomSheet. O conteudo (teclado numerico, categorias, submit) vem nas Stories 3.2 e 3.3
- NAO usar "use server" em nenhum dos arquivos desta story — sao todos Client Components
- NAO criar pastas aninhadas para componentes (ex: src/components/fab/fab.tsx) — manter flat em src/components/
- NAO esquecer focus trap no bottom sheet — acessibilidade obrigatoria
- NAO esquecer aria-label, role="dialog", aria-modal="true"
- NAO esquecer prefers-reduced-motion — usar useReducedMotion() do Framer Motion
- NAO esquecer dynamic import do BottomSheet — bundle optimization e requisito (NFR5)
- NAO posicionar o FAB fora do container 428px — usar calculo CSS com max() para manter dentro do container
- NAO esquecer de bloquear scroll do body quando sheet esta aberto
- NAO esquecer de restaurar o foco ao FAB quando o sheet fecha
- NAO usar z-index maior que 50 — manter z-50 para FAB e sheet (mesmo layer, controlado por render order)
- NAO instalar libs externas para focus trap — implementar manualmente
- NAO fazer drag-to-dismiss no conteudo inteiro — apenas no handle, para nao conflitar com scroll

### Testing Checklist
- [ ] FAB visivel em todas as telas do grupo (app): /, /transactions, /profile
- [ ] FAB posicionado corretamente: canto inferior direito, acima da bottom nav
- [ ] FAB dentro do container 428px em telas grandes (nao colado na borda da tela)
- [ ] FAB 56x56px, emerald-500, icone "+" branco, shadow esverdeada
- [ ] FAB press: scale(0.95) com spring animation
- [ ] FAB hover: bg-emerald-600
- [ ] FAB click: abre o bottom sheet
- [ ] FAB disabled (zinc-600) enquanto sheet aberto
- [ ] Bottom sheet slide-up 300ms com ease-out
- [ ] Bottom sheet ocupa ~85% da tela (h-[85vh])
- [ ] Backdrop zinc-950/80 atras do sheet
- [ ] Drag handle visivel no topo do sheet (barra 40x4px zinc-600)
- [ ] Arrastar handle para baixo > 100px: fecha o sheet
- [ ] Arrastar handle para baixo < 100px: snap back
- [ ] Clicar no backdrop: fecha o sheet
- [ ] Pressionar Escape: fecha o sheet
- [ ] Sheet fecha com slide-down 300ms ease-in
- [ ] Foco vai para dentro do sheet ao abrir
- [ ] Tab/Shift+Tab cicla dentro do sheet (focus trap)
- [ ] Foco retorna ao FAB ao fechar o sheet
- [ ] Body scroll bloqueado com sheet aberto
- [ ] Body scroll restaurado ao fechar
- [ ] prefers-reduced-motion: animacoes desabilitadas
- [ ] Screen reader: FAB anuncia "Adicionar nova transacao"
- [ ] Screen reader: sheet anuncia como dialog
- [ ] Bundle: BottomSheet carregado via dynamic import (verificar Network tab)

### References
- [Source: architecture.md#Frontend Architecture] Client Components com Framer Motion
- [Source: architecture.md#Project Structure] Componentes flat em src/components/
- [Source: epics.md#Story 3.1] Acceptance criteria e descricao
- [Source: ux-design-specification.md#FAB] Especificacoes visuais do FAB
- [Source: ux-design-specification.md#Bottom Sheet] Animacoes e layout do sheet
- [Source: ux-design-specification.md#Accessibility] Focus trap, ARIA, prefers-reduced-motion
- [Source: Story 2.1] Layout do app, bottom nav height 64px, container 428px

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
