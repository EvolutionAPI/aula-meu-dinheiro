# Story 2.1: Layout do App com Bottom Navigation

Status: ready-for-dev

**Depends on:** Story 1.1 (tema CSS variables), Story 1.4 (middleware auth, getSession)

## Story

As a usuario autenticado,
I want navegar entre as secoes do app com uma barra de navegacao fixa na parte inferior,
So that eu acesse rapidamente Home, Transacoes e Perfil com uma mao.

## Acceptance Criteria

1. **Given** o usuario esta autenticado e acessa qualquer rota do grupo (app) **When** a pagina e renderizada **Then** o layout (app) exibe uma bottom navigation bar fixa na parte inferior **And** a nav tem 3 abas: Home (icone house), Transacoes (icone list), Perfil (icone user) **And** a aba ativa tem icone emerald-500 com dot 4px emerald-500 abaixo (FR27) **And** as abas inativas tem icone zinc-500 **And** a nav tem height 64px + env(safe-area-inset-bottom) para iOS **And** background zinc-900 com border-top zinc-800

2. **Given** o usuario toca em uma aba da bottom nav **When** a navegacao ocorre **Then** a tela correspondente e carregada via client-side navigation (sem reload) **And** a aba ativa atualiza visualmente (FR26)

3. **Given** o layout do app **When** renderizado em mobile **Then** o container tem max-width 428px, centralizado, padding horizontal 24px **And** o conteudo e scrollable com padding-bottom suficiente para nao ficar atras da nav **And** semantic HTML: nav com aria-label="Navegacao principal" (NFR14) **And** touch targets >= 48px em todas as abas (NFR16)

4. **Given** o layout do app **When** renderizado em desktop (lg: 1024px+) **Then** o container permanece max-width 428px centralizado na tela **And** o fundo zinc-950 preenche o restante da tela

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, #3, #4) Criar layout do grupo (app)
  - [ ] 1.1 Criar src/app/(app)/layout.tsx — Server Component que busca sessao
  - [ ] 1.2 Container: max-width 428px, mx-auto, px-6 (24px)
  - [ ] 1.3 Conteudo scrollable com min-h-screen, pb-[calc(64px+env(safe-area-inset-bottom)+16px)]
  - [ ] 1.4 Renderizar BottomNav como child do layout
  - [ ] 1.5 Fundo zinc-950 no body (ja vem do globals.css)
- [ ] Task 2 (AC: #1, #2, #3) Criar componente BottomNav
  - [ ] 2.1 Criar src/components/bottom-nav.tsx como Client Component ("use client")
  - [ ] 2.2 3 abas: Home (href="/"), Transacoes (href="/transactions"), Perfil (href="/profile")
  - [ ] 2.3 Icones: house (Home), list (Transacoes), user (Perfil) — usar lucide-react (ja vem com shadcn/ui)
  - [ ] 2.4 Aba ativa: icone emerald-500 + dot 4px emerald-500 centralizado abaixo
  - [ ] 2.5 Aba inativa: icone zinc-500
  - [ ] 2.6 Usar usePathname() para detectar rota ativa
  - [ ] 2.7 Navegacao via Link do next/link (client-side, sem reload)
  - [ ] 2.8 Fixed bottom, width full, height 64px + safe-area
  - [ ] 2.9 Background zinc-900, border-top 1px zinc-800
  - [ ] 2.10 Touch targets >= 48px em cada aba (flex-1, items-center, py-2)
  - [ ] 2.11 Semantic HTML: <nav aria-label="Navegacao principal">
  - [ ] 2.12 Cada link com aria-current="page" quando ativo
- [ ] Task 3 (AC: #3) Criar paginas placeholder
  - [ ] 3.1 Criar src/app/(app)/page.tsx — Dashboard placeholder ("Dashboard")
  - [ ] 3.2 Criar src/app/(app)/transactions/page.tsx — Transacoes placeholder
  - [ ] 3.3 Criar src/app/(app)/profile/page.tsx — Perfil placeholder
- [ ] Task 4 (AC: #3) Criar loading state
  - [ ] 4.1 Criar src/app/(app)/loading.tsx com Skeleton loading basico

## Dev Notes

### Architecture & Patterns
- Layout (app) e Server Component — pode chamar getSession() diretamente
- BottomNav e Client Component — precisa de usePathname() para detectar rota ativa
- Usar Link do next/link para navegacao client-side (sem page reload)
- lucide-react ja vem instalado com shadcn/ui — usar icones de la
- Container max-width 428px simula app mobile no desktop — centralizado com mx-auto
- padding-bottom do conteudo DEVE considerar a altura da nav + safe area para nao cobrir conteudo

### BottomNav Component Pattern
```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transactions", label: "Transacoes", icon: List },
  { href: "/profile", label: "Perfil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegacao principal"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-900"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-[428px] items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-500" : "text-zinc-500")} />
              {isActive && <div className="h-1 w-1 rounded-full bg-emerald-500" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

### Layout Pattern
```typescript
// src/app/(app)/layout.tsx
import { BottomNav } from "@/components/bottom-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[428px] px-6 pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
```

### Visual Design
- Nav background: zinc-900 (levemente mais claro que zinc-950 do fundo)
- Border-top: 1px zinc-800 (sutil)
- Icones: 20x20px (h-5 w-5) — suficiente para visibilidade
- Dot ativo: 4px circulo emerald-500 abaixo do icone
- Touch target: flex-1 ocupa 1/3 da nav, py-2 garante altura >= 48px
- No desktop (lg:): nav fica na parte inferior do container 428px (nao full-width)

### Responsive
- Mobile (< 768px): Container full-width com max-width 428px e padding 24px
- Desktop (>= 1024px): Container 428px centralizado, fundo zinc-950 preenche o resto
- Nav: fixed bottom em todas as telas, max-width 428px no conteudo interno

### Accessibility
- <nav> com aria-label="Navegacao principal"
- aria-current="page" no link ativo
- Focus visible: focus-visible:ring-2 focus-visible:ring-emerald-500 em cada link
- Icones sem texto — adicionar sr-only label para screen readers
- Touch targets >= 48px

### File Structure
```
src/
├── app/(app)/
│   ├── layout.tsx           # App layout com BottomNav (NOVO)
│   ├── loading.tsx          # Skeleton loading (NOVO)
│   ├── page.tsx             # Dashboard placeholder (NOVO)
│   ├── transactions/
│   │   └── page.tsx         # Transacoes placeholder (NOVO)
│   └── profile/
│       └── page.tsx         # Perfil placeholder (NOVO)
└── components/
    └── bottom-nav.tsx       # Bottom navigation (NOVO)
```

### CRITICO - Nao Fazer
- NAO usar useRouter para navegacao — usar Link do next/link
- NAO criar sidebar ou top nav — apenas bottom nav (mobile-first)
- NAO esquecer safe-area-inset-bottom para iOS
- NAO fazer a nav full-width no desktop — manter dentro do container 428px
- NAO esquecer padding-bottom no conteudo para nao ficar atras da nav
- NAO adicionar FAB nesta story — vem na Epic 3

### References
- [Source: architecture.md#Frontend Architecture] Server vs Client Components
- [Source: architecture.md#Project Structure] Route groups (app)
- [Source: epics.md#Story 2.1] Acceptance criteria
- [Source: ux-design-specification.md#Navigation Patterns] Bottom nav specs
- [Source: ux-design-specification.md#Spacing & Layout] Container 428px, padding 24px

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
