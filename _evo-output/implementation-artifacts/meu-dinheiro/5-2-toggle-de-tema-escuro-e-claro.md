# Story 5.2: Toggle de Tema Escuro e Claro

Status: cancelled

**Depends on:** Story 1.1 (CSS variables em globals.css para dark/light themes), Story 5.1 (Pagina de perfil onde o toggle sera posicionado)

## Story

As a usuario,
I want alternar entre tema escuro e claro,
So that eu personalize a aparencia do app conforme minha preferencia.

## Acceptance Criteria

1. **Given** o usuario esta na tela de perfil **When** ele toca no toggle de tema **Then** o tema alterna entre dark e light instantaneamente (FR24) **And** dark mode: zinc-950 background, zinc-800 cards, emerald-500 primary **And** light mode: white background, zinc-100 cards, emerald-600 primary **And** a transicao usa crossfade suave (CSS transition em background-color, color, border-color)

2. **Given** o usuario alterou o tema **When** ele navega entre telas **Then** o tema persiste em localStorage (chave "theme", valor "dark" ou "light") **And** o tema e aplicado via class toggle no elemento html (classe "dark") **And** ao reabrir o app, o tema salvo e restaurado antes do primeiro paint

3. **Given** o toggle de tema **When** implementado **Then** usa Switch do shadcn/ui (track zinc-700, thumb emerald-500) **And** o componente e "use client" (ThemeToggle) **And** todas as combinacoes de cor em ambos os temas atingem WCAG AA (NFR13) **And** prefers-color-scheme do sistema e respeitado como padrao inicial (dark se nao houver preferencia salva)

## Tasks / Subtasks

- [ ] Task 1 (AC: #1, #3) Criar componente ThemeToggle (theme-toggle.tsx) — **CANCELLED: usuario decidiu manter apenas dark mode**
- [ ] Task 2 (AC: #1) Adicionar CSS transition para crossfade suave — **CANCELLED**
- [ ] Task 3 (AC: #2) Adicionar script anti-FOUC no layout.tsx — **CANCELLED**
- [ ] Task 4 (AC: #1, #3) Verificar e ajustar CSS variables para ambos os temas — **CANCELLED**
- [ ] Task 5 (AC: #3) Integrar ThemeToggle na pagina de perfil — **CANCELLED**

## Dev Notes

### Architecture & Patterns

- **ThemeToggle** e Client Component ("use client") — requer useState, useEffect, e acesso ao DOM (document.documentElement, localStorage, matchMedia)
- **Sem React Context/Provider** — o tema e gerenciado via classe CSS no html + localStorage. Simples e eficiente para este escopo
- **Sem next-themes** — implementacao manual com localStorage + class toggle. Mais leve e sem dependencia externa
- **CSS variables** ja configuradas na Story 1.1 em globals.css — ThemeToggle apenas alterna a classe "dark" no html, e o CSS faz o resto
- **FOUC prevention** via script inline no layout.tsx — roda antes do React, evita flash de tema errado ao carregar a pagina
- **prefers-color-scheme** como fallback inicial — se o usuario nunca alterou o tema, o sistema operacional define o padrao
- **Hydration safety** — usar estado `mounted` para nao renderizar o Switch no server (evita mismatch entre server e client)

### ThemeToggle Component Pattern
```typescript
// src/components/theme-toggle.tsx
"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Inicializacao: ler tema salvo ou preferencia do sistema
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme")
    if (saved) {
      const dark = saved === "dark"
      setIsDark(dark)
      document.documentElement.classList.toggle("dark", dark)
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setIsDark(prefersDark)
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
  }

  // Evitar hydration mismatch — nao renderizar ate o client montar
  if (!mounted) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="h-5 w-5 text-zinc-400" />
          <span className="text-sm text-foreground">Tema escuro</span>
        </div>
        {/* Placeholder do Switch para evitar layout shift */}
        <div className="h-6 w-11 rounded-full bg-zinc-700" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isDark ? (
          <Moon className="h-5 w-5 text-zinc-400" />
        ) : (
          <Sun className="h-5 w-5 text-zinc-400" />
        )}
        <span className="text-sm text-foreground">Tema escuro</span>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Alternar tema escuro"
        className="data-[state=checked]:bg-zinc-700 data-[state=unchecked]:bg-zinc-300"
      />
    </div>
  )
}
```

### Estilizacao do Switch (shadcn/ui)
O Switch do shadcn/ui aceita className e usa data attributes para estados:
- `data-[state=checked]` — quando ligado (dark mode ON)
- `data-[state=unchecked]` — quando desligado (light mode)

Para atingir track zinc-700 e thumb emerald-500:
```typescript
<Switch
  checked={isDark}
  onCheckedChange={toggleTheme}
  aria-label="Alternar tema escuro"
  className="data-[state=checked]:bg-zinc-700 data-[state=unchecked]:bg-zinc-300"
/>
```

Se necessario customizar o thumb (bolinha), verificar o arquivo src/components/ui/switch.tsx gerado pelo shadcn e ajustar a classe do thumb para incluir `data-[state=checked]:bg-emerald-500`. Exemplo de ajuste no switch.tsx:
```typescript
// Em src/components/ui/switch.tsx, no SwitchPrimitives.Thumb:
// Adicionar ou ajustar: "data-[state=checked]:bg-emerald-500"
```

### FOUC Prevention Script (layout.tsx)
```typescript
// src/app/layout.tsx — adicionar dentro do <head> ou no inicio do <body>
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var theme = localStorage.getItem('theme');
          if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          }
          document.documentElement.classList.toggle('dark', theme === 'dark');
        } catch (e) {}
      })();
    `,
  }}
/>
```

**Posicionamento do script:** Deve estar o mais cedo possivel no HTML — idealmente no `<head>` ou logo no inicio do `<body>`, ANTES de qualquer conteudo renderizado. Isso garante que a classe "dark" esteja aplicada antes do primeiro paint.

**try/catch:** Necessario porque localStorage pode lancar excecao em modo privado de alguns navegadores.

### Crossfade CSS Transition
Adicionar em globals.css para transicao suave ao trocar tema:
```css
/* Crossfade suave ao alternar tema */
*,
*::before,
*::after {
  transition-property: background-color, color, border-color, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

/* Desabilitar transicao de tema para elementos com animacoes Framer Motion */
[data-framer-motion],
.framer-motion-override {
  transition-property: none !important;
}

/* Respeitar prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0ms !important;
  }
}
```

**ATENCAO:** A transicao com `*` pode interferir com animacoes do Framer Motion ou com transicoes existentes do Tailwind. Uma alternativa mais segura e aplicar a transicao apenas durante a troca de tema, adicionando uma classe temporaria:
```typescript
// Alternativa: transicao apenas durante toggle
const toggleTheme = () => {
  // Adicionar classe de transicao
  document.documentElement.classList.add("theme-transitioning")

  const newIsDark = !isDark
  setIsDark(newIsDark)
  document.documentElement.classList.toggle("dark", newIsDark)
  localStorage.setItem("theme", newIsDark ? "dark" : "light")

  // Remover classe apos transicao completar
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning")
  }, 200)
}
```
```css
/* globals.css */
.theme-transitioning,
.theme-transitioning *,
.theme-transitioning *::before,
.theme-transitioning *::after {
  transition: background-color 200ms ease-in-out,
              color 200ms ease-in-out,
              border-color 200ms ease-in-out,
              box-shadow 200ms ease-in-out !important;
}
```
**Esta abordagem e a RECOMENDADA** — evita conflitos com Framer Motion e Tailwind transitions no uso normal do app.

### CSS Variables (Referencia — ja configuradas na Story 1.1)
```css
/* globals.css — dark mode (classe .dark no html) */
.dark {
  --background: 0 0% 3.9%;      /* #09090b — zinc-950 */
  --card: 0 0% 14.9%;            /* #27272a — zinc-800 */
  --primary: 160 84% 39.4%;      /* #10b981 — emerald-500 */
  --foreground: 0 0% 98%;        /* #fafafa — zinc-50 */
  /* ... outras variaveis */
}

/* globals.css — light mode (sem classe .dark) */
:root {
  --background: 0 0% 100%;       /* #ffffff — white */
  --card: 240 5% 96%;            /* #f4f4f5 — zinc-100 */
  --primary: 161 94% 30.4%;      /* #059669 — emerald-600 */
  --foreground: 0 0% 3.9%;       /* #09090b — zinc-950 */
  /* ... outras variaveis */
}
```
**Verificar** se os valores em globals.css correspondem exatamente a estes. Se a Story 1.1 usou formato HSL do shadcn (ex: `240 5% 96%`), manter o mesmo formato. Os valores hex sao referencia visual.

### Integracao na Pagina de Perfil
```typescript
// src/app/(app)/profile/page.tsx (ou componente de menu do perfil)
// Adicionar ThemeToggle como um item de menu

import { ThemeToggle } from "@/components/theme-toggle"

// Dentro do JSX, no menu de opcoes do perfil:
<div className="rounded-xl bg-card p-4">
  {/* ... outros itens do menu (Story 5.1) ... */}

  {/* Item de tema */}
  <div className="py-3">
    <ThemeToggle />
  </div>

  {/* ... outros itens ... */}
</div>
```

### Hydration Mismatch — Por que usar `mounted`
O server nao tem acesso a localStorage nem a matchMedia. Se renderizarmos o Switch com `checked={isDark}` no server, o valor sera o default (true), mas no client pode ser diferente (ex: usuario salvou "light"). Isso causa hydration mismatch warning. Solucao:
1. Renderizar placeholder no server (sem Switch interativo)
2. Apos mount (useEffect), ler o tema real e renderizar o Switch
3. O placeholder deve ter as mesmas dimensoes para evitar layout shift

### Fluxo Completo de Inicializacao
1. **Servidor renderiza** layout.tsx com o script anti-FOUC inline
2. **Browser recebe HTML** e executa o script ANTES do paint — classe "dark" e aplicada no html
3. **CSS variables** sao aplicadas via `.dark { ... }` ou `:root { ... }` — pagina ja aparece no tema correto
4. **React hidrata** — ThemeToggle renderiza placeholder (mounted=false)
5. **useEffect roda** — ThemeToggle le localStorage, sincroniza estado, seta mounted=true
6. **Switch aparece** com o estado correto, pronto para interacao

### File Structure
```
src/
├── components/
│   ├── theme-toggle.tsx          # ThemeToggle Client Component (NOVO)
│   └── ui/
│       └── switch.tsx            # Switch shadcn/ui (MODIFICAR thumb color)
├── app/
│   ├── layout.tsx                # MODIFICAR — adicionar script anti-FOUC
│   └── (app)/
│       └── profile/
│           └── page.tsx          # MODIFICAR — integrar ThemeToggle
└── styles/
    └── globals.css               # MODIFICAR — adicionar transicao crossfade
```

### CRITICO - Nao Fazer
- NAO instalar next-themes — implementar manualmente com localStorage + class toggle conforme arquitetura definida
- NAO usar React Context/Provider para tema — overkill para este escopo, localStorage + class e suficiente
- NAO esquecer o script anti-FOUC no layout.tsx — sem ele, o usuario vera um flash de tema errado ao carregar a pagina
- NAO esquecer prefers-color-scheme como default inicial — se nao ha tema salvo, respeitar a preferencia do sistema operacional
- NAO aplicar classe "dark" hardcoded no html do layout.tsx — o script inline cuida disso dinamicamente
- NAO renderizar o Switch no server sem o estado `mounted` — causa hydration mismatch
- NAO aplicar transicao CSS permanente em todos os elementos (`*`) — usar abordagem com classe temporaria `theme-transitioning` para evitar conflitos com Framer Motion
- NAO esquecer WCAG AA em light mode — verificar contraste de texto sobre background branco e cards zinc-100
- NAO aplicar a classe "dark" no body — deve ser no html (document.documentElement)
- NAO esquecer try/catch no script anti-FOUC — localStorage pode falhar em modo privado
- NAO criar ThemeProvider ou wrapper de contexto — o ThemeToggle e autocontido, manipula o DOM diretamente

### Testing Checklist
- [ ] Toggle aparece na pagina de perfil como item de menu com icone e label "Tema escuro"
- [ ] Switch usa visual correto: track zinc-700 (checked), thumb emerald-500 (checked)
- [ ] Clicar no toggle alterna entre dark e light instantaneamente
- [ ] Dark mode: background zinc-950, cards zinc-800, primary emerald-500, texto zinc-50
- [ ] Light mode: background branco, cards zinc-100, primary emerald-600, texto zinc-950
- [ ] Transicao crossfade suave ao alternar (200ms ease-in-out em cores)
- [ ] Transicao NAO interfere com animacoes Framer Motion (FAB, BottomSheet, etc.)
- [ ] Navegar entre telas mantem o tema selecionado (persistencia localStorage)
- [ ] Fechar e reabrir o app restaura o tema salvo
- [ ] Sem FOUC: ao carregar a pagina, o tema correto aparece desde o primeiro paint
- [ ] Sem tema salvo: prefers-color-scheme do sistema e respeitado (testar no DevTools com emulacao)
- [ ] prefers-color-scheme: dark -> app inicia em dark
- [ ] prefers-color-scheme: light -> app inicia em light
- [ ] Contraste WCAG AA em dark mode: texto zinc-50 sobre zinc-950 (ratio >= 4.5:1)
- [ ] Contraste WCAG AA em light mode: texto zinc-950 sobre branco (ratio >= 4.5:1)
- [ ] Contraste WCAG AA: primary emerald-500 sobre zinc-950 (dark) e emerald-600 sobre branco (light)
- [ ] Sem hydration mismatch warning no console do browser
- [ ] Switch tem aria-label acessivel ("Alternar tema escuro")
- [ ] Switch funciona via teclado (Space/Enter para toggle)
- [ ] localStorage armazena "dark" ou "light" corretamente (verificar no DevTools > Application > Local Storage)
- [ ] Classe "dark" adicionada/removida no elemento html (nao no body) — verificar no DevTools > Elements
- [ ] Icone muda: Moon quando dark, Sun quando light
- [ ] prefers-reduced-motion: transicao de crossfade e desabilitada (troca instantanea)
- [ ] Modo privado/incognito: app funciona sem erro mesmo se localStorage falhar

### References
- [Source: architecture.md#Frontend Architecture] Client Components, sem next-themes, localStorage + class toggle
- [Source: architecture.md#Project Structure] Componentes flat em src/components/
- [Source: epics.md#Story 5.2] Acceptance criteria e descricao da story
- [Source: ux-design-specification.md#Theme] CSS variables para dark/light, crossfade transition
- [Source: ux-design-specification.md#Accessibility] WCAG AA contraste, prefers-reduced-motion (NFR13, NFR17)
- [Source: Story 1.1] CSS variables em globals.css, configuracao Tailwind dark mode via class
- [Source: Story 5.1] Pagina de perfil com menu de opcoes (ThemeToggle placeholder)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log References
- Story cancelada a pedido do usuario — decidiu manter apenas dark mode
- Implementacao foi feita e depois revertida na mesma sessao

### Completion Notes List
- Story CANCELADA: usuario decidiu nao querer modo claro. Toda implementacao (ThemeToggle, anti-FOUC, CSS transitions) foi revertida.

### File List
(nenhum arquivo — story cancelada)

### Change Log
- 2026-03-19: Story cancelada — usuario optou por manter apenas dark mode. Implementacao revertida.
