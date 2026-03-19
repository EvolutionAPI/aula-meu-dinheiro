# Story 5.3: Desktop Phone Frame com Guia do Aluno

> **Status:** done
> **Depends on:** Story 2.1 (app layout com bottom nav)

---

## Story

**As a** usuario em desktop,
**I want** ver o app dentro de um frame de celular com o guia do aluno ao lado,
**So that** o layout fique bonito no desktop e eu tenha o conteudo educacional acessivel.

---

## Acceptance Criteria

1. **Given** o usuario acessa o app em tela >= 1024px (lg) **When** a pagina carrega **Then** exibe um layout side-by-side: guia do aluno (iframe) no lado esquerdo e app dentro de phone frame no lado direito

2. **Given** o usuario acessa o app em tela < 1024px (mobile/tablet) **When** a pagina carrega **Then** exibe apenas o app normalmente sem frame de celular e sem guia

3. **Given** o phone frame no desktop **When** exibido **Then** tem aparencia de smartphone com bordas arredondadas, notch/dynamic island, e o app renderizado dentro

---

## Tasks / Subtasks

- [x] Task 1: Criar componente DesktopWrapper com PhoneFrame para envolver o app no desktop
- [x] Task 2: Copiar HTML do guia para public/ e usar iframe
- [x] Task 3: Integrar DesktopWrapper no root layout
- [x] Task 4: Mobile continua funcionando normalmente (sem wrapper)
- [x] Task 5: Categorias separadas por tipo (despesa vs receita) com auto-migration para contas existentes
- [x] Task 6: Scrollbar dark no guia e no phone frame
- [x] Task 7: BottomNav/FAB/BottomSheet contidos dentro do phone frame via transform containment
- [x] Task 8: Cor do saldo no hero card: verde quando positivo, vermelho quando negativo (valor e borda)

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### File List
- src/components/desktop-wrapper.tsx (novo - phone frame com transform containment)
- src/app/layout.tsx (modificado - integrado DesktopWrapper)
- src/app/globals.css (modificado - scrollbar dark)
- public/live-04-guia-aluno.html (novo - copia do HTML do guia com scrollbar dark)
- src/lib/constants.ts (modificado - categorias separadas por tipo expense/income/both + categorias de receita)
- prisma/schema.prisma (modificado - campo type na tabela Category)
- src/actions/auth.ts (modificado - inclui type ao criar categorias)
- src/app/(app)/layout.tsx (modificado - auto-migration categorias + select type)
- src/components/transaction-form.tsx (modificado - filtra categorias por tipo, reset ao trocar tipo)
- src/components/transaction-fab-wrapper.tsx (modificado - type na interface)
- src/components/hero-card.tsx (modificado - cor do saldo verde/vermelho)
- src/components/animated-counter.tsx (modificado - suporte a prop style)
- src/components/bottom-sheet.tsx (modificado - h-[75%] para phone frame)
- src/components/fab.tsx (modificado - right: 24px fixo)
- src/__tests__/transaction-form.test.tsx (modificado - type nos mocks)
- src/__tests__/bottom-sheet.test.tsx (modificado - h-[75%] no assert)

### Change Log
- 2026-03-19: Implementada Story 5.3 - Desktop phone frame com guia do aluno side-by-side
- 2026-03-19: Fix: BottomNav/FAB/BottomSheet contidos dentro do phone frame via CSS transform containment
- 2026-03-19: Scrollbar dark no guia e no app
- 2026-03-19: Categorias separadas por tipo (despesas vs receitas) com auto-migration para contas existentes
- 2026-03-19: Cor do saldo: verde quando positivo, vermelho quando negativo (valor + borda do hero card)
