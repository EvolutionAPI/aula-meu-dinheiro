# Story 5.1: Tela de Perfil com Avatar e Informacoes

> **Status:** ready-for-dev
> **Depends on:** Story 1.1 (utils, cn()), Story 1.4 (logout Server Action, getSession), Story 2.1 (app layout com bottom nav)

---

## Story

**As a** usuario,
**I want** ver meu perfil com avatar de iniciais e minhas informacoes,
**So that** eu tenha identidade visual no app e acesse configuracoes.

---

## Acceptance Criteria

1. **Given** o usuario navega para a tela de Perfil (/profile) **When** a pagina carrega (Server Component) **Then** exibe avatar com iniciais do nome do usuario (circulo emerald-500 + iniciais brancas, tamanho grande) (FR23) **And** nome do usuario abaixo do avatar **And** email do usuario em zinc-400

2. **Given** a tela de perfil **When** as opcoes de configuracao sao exibidas **Then** mostra menu em cards (zinc-800, rounded-2xl) com opcoes: Toggle tema escuro/claro, Informacoes da conta, Sair (logout) (FR25) **And** cada card tem touch target >= 48px (NFR16) **And** semantic HTML com heading hierarchy (h1 para titulo, h2 para secoes) e elementos section (NFR14)

3. **Given** o usuario toca em "Sair" **When** a acao de logout e executada **Then** o cookie JWT e limpo **And** o usuario e redirecionado para /login (FR3)

---

## Tasks / Subtasks

- [ ] **Task 1** (AC: #1) Adicionar funcao getInitials() em src/lib/utils.ts
  - [ ] 1.1 Abrir `src/lib/utils.ts` (ja existe da Story 1.1 com cn())
  - [ ] 1.2 Adicionar funcao `getInitials(name: string): string` que extrai ate 2 iniciais do nome
  - [ ] 1.3 Tratar edge cases: nome vazio, nome com uma palavra, nome com 3+ palavras (pegar primeira e ultima)

- [ ] **Task 2** (AC: #1) Criar componente UserAvatar
  - [ ] 2.1 Criar `src/components/user-avatar.tsx` — componente de apresentacao (Server Component, sem "use client")
  - [ ] 2.2 Props: `name: string` e `size?: "sm" | "md" | "lg"` (default "lg")
  - [ ] 2.3 Renderizar circulo com bg-emerald-500 e iniciais brancas centralizadas
  - [ ] 2.4 Tamanhos: sm = h-10 w-10 text-sm, md = h-16 w-16 text-xl, lg = h-24 w-24 text-3xl
  - [ ] 2.5 Usar getInitials() de src/lib/utils.ts
  - [ ] 2.6 Adicionar role="img" e aria-label="Avatar de {name}" para acessibilidade

- [ ] **Task 3** (AC: #1, #2, #3) Criar pagina de Perfil
  - [ ] 3.1 Criar/substituir `src/app/(app)/profile/page.tsx` como Server Component
  - [ ] 3.2 Chamar `getSession()` de `src/lib/auth.ts` no topo — redirecionar para /login se null
  - [ ] 3.3 Estruturar com semantic HTML: `<section>` para area do avatar, `<section>` para menu
  - [ ] 3.4 Usar `<h1>` para "Perfil" (visualmente hidden ou como titulo da pagina)
  - [ ] 3.5 Renderizar `<UserAvatar name={session.name} size="lg" />` centralizado
  - [ ] 3.6 Exibir nome do usuario abaixo do avatar (font-bold, text-lg ou text-xl)
  - [ ] 3.7 Exibir email abaixo do nome (text-zinc-400, text-sm)
  - [ ] 3.8 Usar `<h2>` para "Configuracoes" acima do menu de opcoes

- [ ] **Task 4** (AC: #2) Criar menu de opcoes em cards
  - [ ] 4.1 Container do menu: bg-zinc-800, rounded-2xl, overflow-hidden, divide-y divide-zinc-700
  - [ ] 4.2 Item "Tema escuro" com icone Moon (lucide-react) — apenas visual, sem funcionalidade (placeholder para Story 5.2)
  - [ ] 4.3 Item "Informacoes da conta" com icone UserCog (lucide-react) — apenas visual placeholder
  - [ ] 4.4 Item "Sair" com icone LogOut (lucide-react) e texto text-red-400
  - [ ] 4.5 Cada item: min-h-[48px], flex items-center, px-4, gap-3 (touch target >= 48px)
  - [ ] 4.6 Icones: h-5 w-5 text-zinc-400 (exceto Sair que e text-red-400)
  - [ ] 4.7 Texto: text-zinc-100 (exceto Sair que e text-red-400)

- [ ] **Task 5** (AC: #3) Conectar botao "Sair" ao logout
  - [ ] 5.1 Criar Client Component wrapper `src/components/logout-button.tsx` para o item "Sair"
  - [ ] 5.2 Importar `logout` de `src/actions/auth.ts` (Server Action existente da Story 1.4)
  - [ ] 5.3 Usar `<form action={logout}>` com `<button type="submit">` para submeter a Server Action
  - [ ] 5.4 Estilizar o button para parecer identico aos outros items do menu (sem aparencia de botao)
  - [ ] 5.5 Touch target >= 48px no button

---

## Dev Notes

### Architecture & Patterns

- A pagina `/profile` e um **Server Component** — busca sessao diretamente com `getSession()`
- `getSession()` retorna `{ userId, name, email, monthlyIncome }` ou `null`
- O logout usa **Server Action** ja existente em `src/actions/auth.ts` (Story 1.4)
- Para submeter Server Action sem JavaScript: usar `<form action={logout}>` em vez de onClick
- O componente `LogoutButton` e o unico Client Component nesta story (precisa de `<form>` interativo)
- O `UserAvatar` e Server Component puro — nao precisa de "use client"
- O toggle de tema e apenas um **placeholder visual** nesta story — a funcionalidade vem na Story 5.2

### getInitials Utility

```typescript
// Adicionar em src/lib/utils.ts (arquivo ja existe com cn())

export function getInitials(name: string): string {
  if (!name || !name.trim()) return "?"

  const words = name.trim().split(/\s+/)

  if (words.length === 1) {
    return words[0][0].toUpperCase()
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
```

### UserAvatar Component

```typescript
// src/components/user-avatar.tsx

import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/utils"

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
} as const

interface UserAvatarProps {
  name: string
  size?: keyof typeof sizeClasses
  className?: string
}

export function UserAvatar({ name, size = "lg", className }: UserAvatarProps) {
  return (
    <div
      role="img"
      aria-label={`Avatar de ${name}`}
      className={cn(
        "flex items-center justify-center rounded-full bg-emerald-500 font-bold text-white",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
```

### Profile Page Pattern

```typescript
// src/app/(app)/profile/page.tsx

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { UserAvatar } from "@/components/user-avatar"
import { LogoutButton } from "@/components/logout-button"
import { Moon, UserCog } from "lucide-react"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center pt-12">
      {/* Titulo da pagina — visualmente hidden para acessibilidade */}
      <h1 className="sr-only">Perfil</h1>

      {/* Secao: Avatar e informacoes do usuario */}
      <section className="flex flex-col items-center gap-3" aria-label="Informacoes do usuario">
        <UserAvatar name={session.name} size="lg" />
        <div className="text-center">
          <p className="text-xl font-bold text-zinc-100">{session.name}</p>
          <p className="text-sm text-zinc-400">{session.email}</p>
        </div>
      </section>

      {/* Secao: Menu de configuracoes */}
      <section className="mt-10 w-full" aria-label="Configuracoes">
        <h2 className="mb-3 text-sm font-medium text-zinc-400">Configuracoes</h2>
        <div className="overflow-hidden rounded-2xl bg-zinc-800 divide-y divide-zinc-700">
          {/* Tema — placeholder para Story 5.2 */}
          <div className="flex min-h-[48px] items-center gap-3 px-4">
            <Moon className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-100">Tema escuro</span>
          </div>

          {/* Informacoes da conta — placeholder */}
          <div className="flex min-h-[48px] items-center gap-3 px-4">
            <UserCog className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-100">Informacoes da conta</span>
          </div>

          {/* Sair — conectado ao logout */}
          <LogoutButton />
        </div>
      </section>
    </div>
  )
}
```

### LogoutButton Component

```typescript
// src/components/logout-button.tsx
"use client"

import { logout } from "@/actions/auth"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full min-h-[48px] items-center gap-3 px-4 text-red-400 hover:bg-zinc-700/50 transition-colors cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </form>
  )
}
```

### Visual Design

- **Avatar**: circulo 96x96px (h-24 w-24) com bg-emerald-500, iniciais brancas bold text-3xl, centralizado no topo
- **Nome**: text-xl font-bold text-zinc-100, abaixo do avatar com gap-3
- **Email**: text-sm text-zinc-400, abaixo do nome
- **Menu cards**: container bg-zinc-800 rounded-2xl, items divididos por divide-y divide-zinc-700
- **Menu items**: min-h-[48px] para touch target, icone 20x20 + texto, gap-3, px-4
- **Item Sair**: texto e icone em text-red-400 para destaque visual de acao destrutiva
- **Spacing**: pt-12 no topo, mt-10 entre avatar e menu, breathing space generoso

### File Structure

```
src/
├── app/(app)/profile/
│   └── page.tsx              # Pagina de Perfil — Server Component (NOVO ou substituir placeholder)
├── components/
│   ├── user-avatar.tsx       # Componente UserAvatar com iniciais (NOVO)
│   └── logout-button.tsx     # Wrapper Client Component para logout (NOVO)
└── lib/
    └── utils.ts              # ADICIONAR getInitials() (arquivo ja existe)
```

### Dependencias Existentes (NAO instalar nada novo)

- `lucide-react` — icones Moon, UserCog, LogOut (ja instalado via shadcn/ui)
- `src/lib/auth.ts` — `getSession()` (Story 1.4)
- `src/actions/auth.ts` — `logout()` Server Action (Story 1.4)
- `src/lib/utils.ts` — `cn()` (Story 1.1)

### CRITICO - Nao Fazer

- **NAO** criar uma nova Server Action de logout — reutilizar `logout()` de `src/actions/auth.ts` (Story 1.4)
- **NAO** implementar funcionalidade do toggle de tema — e apenas placeholder visual (Story 5.2)
- **NAO** buscar dados em Client Components — a pagina e Server Component, busca sessao no servidor
- **NAO** esquecer semantic HTML: h1 (sr-only), h2 para secoes, section com aria-label
- **NAO** esquecer touch targets >= 48px (min-h-[48px]) em TODOS os items do menu
- **NAO** criar formulario de edicao de perfil — fora do escopo MVP
- **NAO** instalar pacotes novos — tudo ja esta disponivel
- **NAO** usar onClick para logout — usar `<form action={logout}>` para funcionar sem JS
- **NAO** colocar "use client" no UserAvatar ou na pagina — apenas o LogoutButton precisa ser Client Component

### Testing Checklist

- [ ] Acessar /profile logado — avatar com iniciais corretas, nome e email exibidos
- [ ] Verificar que o avatar mostra 2 letras para nome composto (ex: "Davidson Silva" -> "DS")
- [ ] Verificar que o avatar mostra 1 letra para nome simples (ex: "Davidson" -> "D")
- [ ] Verificar que menu tem 3 opcoes: Tema escuro, Informacoes da conta, Sair
- [ ] Clicar em "Sair" — cookie JWT limpo, redirecionado para /login
- [ ] Verificar touch targets >= 48px em todos os items do menu (inspecionar min-height)
- [ ] Verificar semantic HTML: h1 (sr-only), h2 "Configuracoes", sections com aria-label
- [ ] Verificar que "Tema escuro" e "Informacoes da conta" nao fazem nada ao clicar (apenas visual)
- [ ] Verificar acessibilidade: avatar tem role="img" e aria-label
- [ ] Testar com nome vazio ou edge cases no getInitials()
- [ ] Verificar que a pagina funciona como Server Component (sem "use client" na page.tsx)
- [ ] Verificar responsive: layout centralizado, max-width 428px no desktop

### References

- [Source: architecture.md#Frontend Architecture] Server vs Client Components
- [Source: architecture.md#Project Structure] Route groups (app), componentes
- [Source: architecture.md#Authentication & Security] getSession(), JWT cookie
- [Source: epics.md#Story 5.1] Acceptance criteria — avatar com iniciais, menu configuracoes
- [Source: ux-design-specification.md#Profile Screen] Avatar emerald-500, menu cards zinc-800
- [Source: ux-design-specification.md#Spacing & Layout] Container 428px, padding 24px
- [Source: Story 1.4] logout Server Action, getSession()
- [Source: Story 2.1] App layout, bottom nav, pagina placeholder de perfil

---

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
