# Story 3.2: Teclado Numerico e Selecao de Categoria

Status: ready-for-dev

**Depends on:** Story 3.1 (BottomSheet container), Story 1.1 (DEFAULT_CATEGORIES em src/lib/constants.ts, formatCurrency em src/lib/format.ts)

## Story

As a usuario,
I want digitar o valor no teclado numerico dark e selecionar uma categoria colorida,
So that eu registre o valor e a categoria da transacao de forma rapida e visual.

## Acceptance Criteria

1. **Given** o bottom sheet esta aberto **When** o conteudo e renderizado **Then** mostra abas "Despesa" e "Receita" no topo (Despesa ativa por padrao) **And** aba ativa tem texto emerald-500 com underline, inativa zinc-400 **And** display de valor mostra "R$ 0,00" inicialmente (text-3xl, branco se despesa, emerald-500 se receita)

2. **Given** o teclado numerico e exibido **When** o usuario toca nos botoes **Then** o grid 3x4 tem botoes: [1][2][3] [4][5][6] [7][8][9] [,][0][backspace] **And** cada botao tem 64x48px, background zinc-800, texto zinc-50, rounded-xl **And** feedback de press: scale(0.95) + background zinc-700 **And** o valor e auto-formatado como moeda (R$ 1.234,56) no display **And** backspace remove ultimo digito, long-press limpa tudo

3. **Given** o grid de categorias e exibido abaixo do teclado **When** o usuario visualiza as categorias **Then** mostra as 7 categorias em grid responsivo (4 colunas) **And** cada item tem circulo 56x56px com cor da categoria (opacity 20% bg + icone solid) **And** emoji da categoria (24px) + label abaixo (caption, zinc-400) **And** role="radiogroup", cada item role="radio" (FR15)

4. **Given** o usuario toca em uma categoria **When** a categoria e selecionada **Then** a categoria selecionada tem ring emerald-500 (2px) + scale(1.05) **And** touch targets >= 48px com espacamento minimo 8px entre items (NFR16)

5. **Given** um campo de descricao opcional **When** exibido abaixo das categorias **Then** mostra placeholder "Adicionar nota..." em zinc-600 discreto (FR14) **And** o campo e collapsed por default, expande ao tocar

## Tasks / Subtasks

- [ ] Task 1 (AC: #1) Criar abas Despesa/Receita e display de valor
  - [ ] 1.1 Dentro do conteudo do BottomSheet (Story 3.1), adicionar tabs "Despesa" e "Receita"
  - [ ] 1.2 Usar componente Tabs do shadcn/ui com customizacao visual
  - [ ] 1.3 Aba ativa: text-emerald-500 + underline (border-b-2 border-emerald-500)
  - [ ] 1.4 Aba inativa: text-zinc-400 sem underline
  - [ ] 1.5 Estado: transactionType = "expense" | "income", default "expense"
  - [ ] 1.6 Display de valor: text-3xl font-bold, text-zinc-50 se despesa, text-emerald-500 se receita
  - [ ] 1.7 Valor inicial: "R$ 0,00" formatado via formatCurrency(0)
  - [ ] 1.8 O estado do valor (rawDigits: string) fica no pai e e passado via props

- [ ] Task 2 (AC: #2) Criar componente NumericKeypad
  - [ ] 2.1 Criar src/components/numeric-keypad.tsx como Client Component ("use client")
  - [ ] 2.2 Props: onDigit(digit: string), onDecimal(), onBackspace(), onClear()
  - [ ] 2.3 Grid 3x4: botoes [1][2][3] [4][5][6] [7][8][9] [,][0][backspace]
  - [ ] 2.4 Cada botao: w-16 (64px) h-12 (48px), bg-zinc-800, text-zinc-50, rounded-xl
  - [ ] 2.5 Botao backspace: icone DeleteIcon (Lucide "delete") no lugar do texto
  - [ ] 2.6 Usar grid com gap-2 e justify-center
  - [ ] 2.7 Exportar componente com dynamic import em mente (nao usar default export)

- [ ] Task 3 (AC: #2) Implementar feedback de press e interacoes
  - [ ] 3.1 Cada botao wrapped em motion.button do Framer Motion
  - [ ] 3.2 whileTap={{ scale: 0.95 }} para feedback de press
  - [ ] 3.3 whileTap tambem aplica bg-zinc-700 (via className condicional ou animate)
  - [ ] 3.4 transition: { duration: 0.1 } para resposta imediata
  - [ ] 3.5 Backspace: onPointerDown inicia timer, onPointerUp/onPointerLeave cancela
  - [ ] 3.6 Long-press (>500ms) no backspace: chama onClear() para limpar tudo
  - [ ] 3.7 Tap normal no backspace: chama onBackspace() para remover ultimo digito

- [ ] Task 4 (AC: #2) Implementar logica de formatacao de valor em tempo real
  - [ ] 4.1 Estado rawDigits (string de digitos, ex: "12345" = R$ 123,45) no componente pai
  - [ ] 4.2 Ao digitar numero: concatenar digito ao rawDigits
  - [ ] 4.3 Ao digitar virgula: se nao tem decimais ainda, marca posicao decimal
  - [ ] 4.4 Limitar a 2 casas decimais apos a virgula
  - [ ] 4.5 Limitar valor maximo (ex: 999999999 = R$ 9.999.999,99)
  - [ ] 4.6 Converter rawDigits para numero e formatar com formatCurrency() para display
  - [ ] 4.7 Backspace: remover ultimo caractere de rawDigits
  - [ ] 4.8 Clear (long-press): resetar rawDigits para ""
  - [ ] 4.9 Abordagem: tratar rawDigits como centavos (sem virgula). Ex: "12345" = 123.45

- [ ] Task 5 (AC: #3) Criar componente CategoryGrid
  - [ ] 5.1 Criar src/components/category-grid.tsx como Client Component ("use client")
  - [ ] 5.2 Props: categories (Category[]), selectedId (string | null), onSelect(id: string)
  - [ ] 5.3 Importar DEFAULT_CATEGORIES de src/lib/constants.ts
  - [ ] 5.4 Container: role="radiogroup" aria-label="Selecione uma categoria"
  - [ ] 5.5 Grid: grid-cols-4 gap-3 (minimo 8px entre items)
  - [ ] 5.6 Cada item: role="radio" aria-checked={selected} aria-label={category.name} tabIndex={0}
  - [ ] 5.7 Circulo: w-14 h-14 (56px) rounded-full
  - [ ] 5.8 Cor do circulo: backgroundColor com cor da categoria + opacity 20% (usar hex + "33")
  - [ ] 5.9 Emoji: text-2xl (24px) centralizado no circulo
  - [ ] 5.10 Label: text-xs text-zinc-400 mt-1 text-center truncate
  - [ ] 5.11 Touch target: minimo 48px (o circulo de 56px ja cumpre)

- [ ] Task 6 (AC: #4) Implementar selecao de categoria com feedback visual
  - [ ] 6.1 Categoria selecionada: ring-2 ring-emerald-500 no circulo
  - [ ] 6.2 Animacao de selecao: motion.div com scale(1.05) quando selecionada
  - [ ] 6.3 Transicao suave: { type: "spring", stiffness: 300, damping: 20 }
  - [ ] 6.4 Ao tocar: chamar onSelect(category.id)
  - [ ] 6.5 Apenas uma categoria selecionada por vez (radio behavior)
  - [ ] 6.6 Suporte a navegacao por teclado: Enter/Space para selecionar, Arrow keys para mover

- [ ] Task 7 (AC: #5) Implementar campo de descricao opcional
  - [ ] 7.1 Container colapsado por padrao (height 0, overflow hidden)
  - [ ] 7.2 Botao/area clicavel com texto "Adicionar nota..." em text-zinc-600
  - [ ] 7.3 Ao tocar: expandir com animacao (Framer Motion AnimatePresence)
  - [ ] 7.4 Campo expandido: input ou textarea com bg-transparent, text-zinc-50
  - [ ] 7.5 Placeholder: "Adicionar nota..." em text-zinc-600
  - [ ] 7.6 border-b border-zinc-700 como indicador sutil
  - [ ] 7.7 Props: description (string), onDescriptionChange(value: string)
  - [ ] 7.8 Ao perder foco e vazio: colapsar novamente

- [ ] Task 8 (AC: todos) Integrar componentes no BottomSheet
  - [ ] 8.1 No componente que renderiza o conteudo do BottomSheet (Story 3.1):
  - [ ] 8.2 Usar dynamic import para NumericKeypad e CategoryGrid
  - [ ] 8.3 Ordem vertical: Tabs > Display Valor > NumericKeypad > CategoryGrid > DescriptionField
  - [ ] 8.4 Gerenciar estado: transactionType, rawDigits, selectedCategoryId, description
  - [ ] 8.5 Passar props e callbacks para cada componente filho
  - [ ] 8.6 NAO adicionar botao de submit (Story 3.3)

## Dev Notes

### Architecture & Patterns
- Client Components obrigatorios — Framer Motion e interatividade requerem "use client"
- NumericKeypad e CategoryGrid sao componentes independentes e reutilizaveis
- Estado do formulario (valor, tipo, categoria, descricao) fica no componente pai (container do BottomSheet)
- Dynamic imports para code splitting: `const NumericKeypad = dynamic(() => import("@/components/numeric-keypad").then(m => ({ default: m.NumericKeypad })))`
- formatCurrency() de src/lib/format.ts para formatar o valor em tempo real
- DEFAULT_CATEGORIES de src/lib/constants.ts para popular o grid de categorias

### Estrutura DEFAULT_CATEGORIES (de Story 1.1)
```typescript
// src/lib/constants.ts
export const DEFAULT_CATEGORIES = [
  { id: "alimentacao", name: "Alimentacao", icon: "🍔", color: "#f97316" },  // orange
  { id: "transporte",  name: "Transporte",  icon: "🚗", color: "#3b82f6" },  // blue
  { id: "moradia",     name: "Moradia",     icon: "🏠", color: "#8b5cf6" },  // violet
  { id: "lazer",       name: "Lazer",       icon: "🎮", color: "#ec4899" },  // pink
  { id: "saude",       name: "Saude",       icon: "💊", color: "#ef4444" },  // red
  { id: "educacao",    name: "Educacao",    icon: "📚", color: "#06b6d4" },  // cyan
  { id: "outros",      name: "Outros",      icon: "📦", color: "#71717a" },  // gray
] as const

export type Category = (typeof DEFAULT_CATEGORIES)[number]
```

### Implementation Pattern — NumericKeypad
```typescript
"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Delete } from "lucide-react"

interface NumericKeypadProps {
  onDigit: (digit: string) => void
  onDecimal: () => void
  onBackspace: () => void
  onClear: () => void
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [",", "0", "backspace"],
]

export function NumericKeypad({ onDigit, onDecimal, onBackspace, onClear }: NumericKeypadProps) {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handlePointerDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      onClear()
      longPressTimer.current = null
    }, 500)
  }, [onClear])

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
      onBackspace()
    }
  }, [onBackspace])

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleKeyPress = (key: string) => {
    if (key === ",") onDecimal()
    else if (key === "backspace") return // handled by pointer events
    else onDigit(key)
  }

  return (
    <div className="grid grid-cols-3 gap-2 justify-items-center py-4">
      {KEYS.flat().map((key) => (
        <motion.button
          key={key}
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="w-16 h-12 bg-zinc-800 text-zinc-50 rounded-xl flex items-center justify-center
                     text-lg font-medium active:bg-zinc-700 select-none touch-manipulation"
          onClick={() => handleKeyPress(key)}
          {...(key === "backspace" && {
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            onPointerLeave: handlePointerLeave,
            onClick: undefined,
          })}
          aria-label={key === "backspace" ? "Apagar" : key === "," ? "Virgula" : key}
        >
          {key === "backspace" ? <Delete className="w-5 h-5" /> : key}
        </motion.button>
      ))}
    </div>
  )
}
```

### Implementation Pattern — Logica de Valor (no componente pai)
```typescript
// Estado no componente pai
const [rawDigits, setRawDigits] = useState("")  // centavos como string: "12345" = R$ 123,45
const [hasDecimal, setHasDecimal] = useState(false)
const [decimalDigits, setDecimalDigits] = useState(0)

// Abordagem simplificada: tratar tudo como centavos
// rawDigits = "0" -> R$ 0,00
// rawDigits = "1" -> R$ 0,01
// rawDigits = "12345" -> R$ 123,45
const handleDigit = (digit: string) => {
  setRawDigits(prev => {
    const next = prev + digit
    // Limitar a 9 digitos (R$ 9.999.999,99)
    if (next.length > 9) return prev
    return next
  })
}

const handleDecimal = () => {
  // Na abordagem de centavos, virgula nao e necessaria
  // Alternativamente: pode-se usar virgula como separador visual
}

const handleBackspace = () => {
  setRawDigits(prev => prev.slice(0, -1))
}

const handleClear = () => {
  setRawDigits("")
}

// Converter para valor numerico
const numericValue = rawDigits.length > 0 ? parseInt(rawDigits, 10) / 100 : 0

// Display formatado
const displayValue = formatCurrency(numericValue)
```

### Implementation Pattern — CategoryGrid
```typescript
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryItem {
  id: string
  name: string
  icon: string
  color: string
}

interface CategoryGridProps {
  categories: CategoryItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CategoryGrid({ categories, selectedId, onSelect }: CategoryGridProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Selecione uma categoria"
      className="grid grid-cols-4 gap-3 py-4"
    >
      {categories.map((category) => {
        const isSelected = selectedId === category.id
        return (
          <motion.button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={category.name}
            tabIndex={0}
            onClick={() => onSelect(category.id)}
            animate={{ scale: isSelected ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-2xl",
                isSelected && "ring-2 ring-emerald-500"
              )}
              style={{ backgroundColor: category.color + "33" }}
            >
              {category.icon}
            </div>
            <span className="text-xs text-zinc-400 text-center truncate w-full">
              {category.name}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
```

### Implementation Pattern — Campo de Descricao
```typescript
"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface DescriptionFieldProps {
  value: string
  onChange: (value: string) => void
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleBlur = () => {
    if (!value.trim()) {
      setIsExpanded(false)
    }
  }

  return (
    <div className="py-2">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="text-sm text-zinc-600 py-2"
          >
            Adicionar nota...
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Adicionar nota..."
              autoFocus
              className="w-full bg-transparent text-zinc-50 text-sm placeholder:text-zinc-600
                         border-b border-zinc-700 py-2 outline-none focus:border-emerald-500
                         transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Implementation Pattern — Abas Despesa/Receita (usando Tabs do shadcn/ui)
```typescript
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="expense" onValueChange={(v) => setTransactionType(v as "expense" | "income")}>
  <TabsList className="bg-transparent w-full justify-center gap-8 border-b border-zinc-800 rounded-none h-auto pb-0">
    <TabsTrigger
      value="expense"
      className="bg-transparent rounded-none border-b-2 border-transparent
                 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500
                 data-[state=inactive]:text-zinc-400 data-[state=active]:shadow-none
                 px-4 pb-2 text-sm font-medium"
    >
      Despesa
    </TabsTrigger>
    <TabsTrigger
      value="income"
      className="bg-transparent rounded-none border-b-2 border-transparent
                 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500
                 data-[state=inactive]:text-zinc-400 data-[state=active]:shadow-none
                 px-4 pb-2 text-sm font-medium"
    >
      Receita
    </TabsTrigger>
  </TabsList>
</Tabs>
```

### Implementation Pattern — Dynamic Imports
```typescript
import dynamic from "next/dynamic"

const NumericKeypad = dynamic(
  () => import("@/components/numeric-keypad").then(m => ({ default: m.NumericKeypad })),
  { ssr: false }
)

const CategoryGrid = dynamic(
  () => import("@/components/category-grid").then(m => ({ default: m.CategoryGrid })),
  { ssr: false }
)
```

### Layout Vertical no BottomSheet
```
+-----------------------------------+
|     Despesa     |    Receita      |  <- Tabs (shadcn/ui)
+-----------------------------------+
|          R$ 0,00                  |  <- Display valor (text-3xl)
+-----------------------------------+
|    [1]  [2]  [3]                  |
|    [4]  [5]  [6]                  |  <- NumericKeypad (grid 3x4)
|    [7]  [8]  [9]                  |
|    [,]  [0]  [<x]                 |
+-----------------------------------+
|  🍔   🚗   🏠   🎮              |
|  Ali  Tra  Mor  Laz              |  <- CategoryGrid (grid 4 cols)
|  💊   📚   📦                    |
|  Sau  Edu  Out                    |
+-----------------------------------+
|  Adicionar nota...                |  <- DescriptionField (collapsed)
+-----------------------------------+
|         (botao submit = 3.3)      |  <- NAO IMPLEMENTAR
+-----------------------------------+
```

### File Structure
```
src/components/
├── numeric-keypad.tsx    # NumericKeypad (NOVO - esta story)
├── category-grid.tsx     # CategoryGrid (NOVO - esta story)
└── ui/
    └── tabs.tsx          # shadcn/ui Tabs (ja existe via Story 1.1)
```

### CRITICO - Nao Fazer
- NAO usar teclado do sistema (input type="number") — construir teclado numerico customizado
- NAO usar dropdown/select para categorias — usar grid visual com circulos coloridos
- NAO esquecer role="radiogroup" no container e role="radio" em cada categoria — acessibilidade obrigatoria (FR15)
- NAO esquecer feedback de press scale(0.95) nos botoes do teclado — UX obrigatoria
- NAO criar botao de submit/confirmar — isso e Story 3.3
- NAO implementar envio/salvamento do formulario — isso e Story 3.3
- NAO esquecer auto-formatacao BRL durante digitacao — sempre mostrar "R$ X.XXX,XX"
- NAO esquecer long-press no backspace para limpar tudo (>500ms)
- NAO usar default export — usar named export para compatibilidade com dynamic import
- NAO esquecer touch-manipulation nos botoes (desabilita delay de 300ms no mobile)
- NAO permitir mais de 2 casas decimais
- NAO permitir valor maior que R$ 9.999.999,99
- NAO esquecer aria-label nos botoes do teclado (acessibilidade)

### Testing Checklist
- [ ] Abas "Despesa" e "Receita" renderizam, Despesa ativa por padrao
- [ ] Aba ativa tem texto emerald-500 com underline, inativa zinc-400
- [ ] Display mostra "R$ 0,00" inicialmente
- [ ] Display branco para despesa, emerald-500 para receita
- [ ] Trocar aba muda a cor do display corretamente
- [ ] Grid 3x4 do teclado renderiza com todos os 12 botoes
- [ ] Botoes tem 64x48px, bg-zinc-800, rounded-xl
- [ ] Tap no botao aplica scale(0.95) + bg-zinc-700
- [ ] Digitar "1", "2", "3", "4", "5" mostra "R$ 123,45"
- [ ] Digitar alem de 9 digitos nao adiciona mais
- [ ] Backspace remove ultimo digito corretamente
- [ ] Long-press (>500ms) no backspace limpa tudo para "R$ 0,00"
- [ ] 7 categorias renderizam em grid de 4 colunas
- [ ] Cada categoria tem circulo 56x56px com cor correta (20% opacity)
- [ ] Emoji centralizado no circulo, label abaixo em zinc-400
- [ ] Tocar categoria aplica ring emerald-500 + scale(1.05)
- [ ] Apenas uma categoria selecionada por vez
- [ ] role="radiogroup" no container, role="radio" em cada item
- [ ] aria-checked atualiza corretamente na categoria selecionada
- [ ] Campo "Adicionar nota..." aparece colapsado por padrao
- [ ] Tocar expande o campo com animacao
- [ ] Campo vazio ao perder foco: colapsa novamente
- [ ] Touch targets >= 48px em todos os elementos interativos
- [ ] Espacamento minimo 8px entre items de categoria
- [ ] Sem botao de submit (Story 3.3)

### References
- [Source: architecture.md#Frontend Architecture] Client Components com Framer Motion, dynamic imports
- [Source: epics.md#Story 3.2] Acceptance criteria originais
- [Source: ux-design-specification.md#Transaction Entry] Teclado numerico dark, grid de categorias
- [Source: ux-design-specification.md#Design Tokens] zinc-800, zinc-50, emerald-500, rounded-xl
- [Source: ux-design-specification.md#Accessibility] Touch targets >= 48px (NFR16), role="radiogroup" (FR15)
- [Source: implementation-readiness.md] formatCurrency, DEFAULT_CATEGORIES

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
