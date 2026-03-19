---
title: 'Cadastro de Categorias de Despesas e Receitas'
slug: 'cadastro-categorias'
created: '2026-03-19'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 16', 'React', 'TypeScript', 'Prisma 7', 'PostgreSQL', 'Tailwind CSS', 'shadcn/ui', 'framer-motion', 'sonner', 'zod', 'vitest', 'testing-library']
files_to_modify: ['src/actions/categories.ts', 'src/app/(app)/profile/categories/page.tsx', 'src/components/category-management.tsx', 'src/components/category-form-dialog.tsx', 'src/components/category-grid.tsx', 'src/components/transaction-form.tsx', 'src/app/(app)/profile/page.tsx', 'src/lib/validations.ts', 'src/__tests__/categories-actions.test.ts', 'src/__tests__/category-management.test.tsx']
code_patterns: ['Server Actions in src/actions/ with zod validation', 'getSession() for auth guard', 'revalidatePath for cache invalidation', 'ActionResponse type for return values', 'Components use framer-motion for animations', 'CategoryGrid is readonly radiogroup grid', 'Layout loads categories via ensureAndGetCategories and passes to TransactionFabWrapper', 'Profile page has Configuracoes section with card list items']
test_patterns: ['vitest + testing-library', 'vi.mock for dependencies (prisma, auth, next/cache)', 'vi.mocked() for typed mocks', 'Separate test files in src/__tests__/', 'Mock framer-motion in component tests', 'MOCK_CATEGORIES pattern for test data']
---

# Tech-Spec: Cadastro de Categorias de Despesas e Receitas

**Created:** 2026-03-19

## Overview

### Problem Statement

O usuario nao consegue personalizar suas categorias de despesas e receitas. As categorias sao fixas e hardcoded em `src/lib/constants.ts`, criadas automaticamente no signup. Nao ha como criar, editar ou excluir categorias apos o cadastro.

### Solution

Implementar CRUD completo de categorias com tela dedicada de gerenciamento (acessivel via Configuracoes/Perfil) e opcao de criacao inline no formulario de transacao. Ao deletar uma categoria com transacoes vinculadas, migrar as transacoes para a categoria "Outros".

### Scope

**In Scope:**
- CRUD completo de categorias (criar, listar, editar, deletar)
- Campos: nome, tipo (receita/despesa), icone (emoji)
- Categorias padrao pre-populadas via seed no onboarding
- Tela dedicada de gerenciamento de categorias
- Opcao "+ Nova categoria" inline no select/grid do formulario de transacao
- Logica de delecao com migracao de transacoes para categoria "Outros"

**Out of Scope:**
- Subcategorias / hierarquia
- Campo cor (usar apenas emoji como identificador visual)
- Compartilhamento de categorias entre usuarios
- Reordenacao de categorias
- Importacao/exportacao de categorias

## Context for Development

### Codebase Patterns

- **Server Actions**: Definidas em `src/actions/` com padrao `'use server'`, validacao zod, `getSession()` para auth, retorno `ActionResponse`, `revalidatePath` para cache
- **Schema Prisma**: Model `Category` ja existe com campos `id, name, icon, color, type, userId` + unique constraint `[userId, name]`. Model `Transaction` tem FK `categoryId` para Category
- **Categorias atuais**: `DEFAULT_CATEGORIES` hardcoded em `src/lib/constants.ts` com 11 categorias (7 despesa, 3 receita, 1 "both"). Criadas no onboarding via `auth.ts:completeOnboarding`
- **Layout carrega categorias**: `src/app/(app)/layout.tsx` tem funcao `ensureAndGetCategories(userId)` que busca do banco e cria faltantes. Passa categorias para `TransactionFabWrapper`
- **CategoryGrid**: Componente readonly com `role="radiogroup"`, grid 4 colunas, navegacao por teclado. Recebe `categories` como props readonly
- **TransactionForm**: Filtra categorias por tipo (expense/income/both) e passa para CategoryGrid
- **Profile page**: Tem secao "Configuracoes" com itens em card list (Moon/tema, UserCog/conta). Ideal para adicionar link "Categorias"
- **Campo `color`**: Existe no schema e e usado no CategoryGrid para background circle (`category.color + "33"`). MANTER para compatibilidade visual — nao remover

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `prisma/schema.prisma` | Model Category (id, name, icon, color, type, userId) e Transaction (categoryId FK) |
| `src/lib/constants.ts` | DEFAULT_CATEGORIES array hardcoded — usado no seed e ensureAndGetCategories |
| `src/actions/auth.ts` | `completeOnboarding` cria categorias padrao via `prisma.category.createMany` |
| `src/actions/transactions.ts` | Padrao de server action com zod + getSession + revalidatePath |
| `src/app/(app)/layout.tsx` | `ensureAndGetCategories()` busca categorias do banco, passa para TransactionFabWrapper |
| `src/components/category-grid.tsx` | Grid visual readonly radiogroup 4 colunas com keyboard nav |
| `src/components/transaction-form.tsx` | Form que filtra categorias por tipo e usa CategoryGrid |
| `src/components/transaction-fab-wrapper.tsx` | Wrapper do FAB que recebe categories e passa pro form |
| `src/app/(app)/profile/page.tsx` | Tela de perfil com secao Configuracoes — ponto de entrada para gerenciamento |
| `src/lib/validations.ts` | Schemas zod existentes (registerSchema, loginSchema, onboardingSchema) |

### Technical Decisions

- **Manter campo `color`**: O schema ja tem `color` e o CategoryGrid usa para background visual. Manter para compatibilidade. Ao criar nova categoria, atribuir cor padrao (ex: `#6b7280`)
- **Categoria "Outros" protegida**: Nao pode ser deletada nem editada. Tipo `both` para ser usada como fallback na migracao de transacoes
- **Constraint unique `[userId, name]`**: Ja existe no schema — validar nome duplicado nas actions
- **Migracao na delecao**: Usar `prisma.$transaction` para atomicamente migrar transacoes e deletar categoria
- **Inline no form**: Adicionar botao "+" no final do CategoryGrid que abre dialog de criacao rapida

## Implementation Plan

### Tasks

- [x] Task 1: Criar schema de validacao zod para categorias
  - File: `src/lib/validations.ts`
  - Action: Adicionar `categorySchema` com campos `name` (string, min 1, max 30), `icon` (string emoji, min 1), `type` (enum "expense" | "income")
  - Notes: Seguir padrao dos schemas existentes (registerSchema, loginSchema)

- [x] Task 2: Criar server actions de CRUD de categorias
  - File: `src/actions/categories.ts` (novo)
  - Action: Implementar 4 server actions seguindo padrao de `transactions.ts`:
    - `createCategory(data)`: Valida com zod, getSession, cria com `color: '#6b7280'` default, revalidatePath `/`, `/profile/categories`
    - `updateCategory(id, data)`: Valida, verifica ownership (userId), bloqueia edicao de "Outros", atualiza, revalidatePath
    - `deleteCategory(id)`: Valida, verifica ownership, bloqueia delecao de "Outros", usa `prisma.$transaction` para: (1) buscar categoria "Outros" do usuario, (2) migrar transacoes com `updateMany({where: {categoryId: id}, data: {categoryId: outrosId}})`, (3) deletar categoria. revalidatePath
    - `getCategories()`: getSession, findMany com orderBy name asc
  - Notes: Retornar `ActionResponse` em todas. Tratar erro de unique constraint `[userId, name]` com mensagem amigavel "Ja existe uma categoria com esse nome"

- [x] Task 3: Criar componente de dialog para criar/editar categoria
  - File: `src/components/category-form-dialog.tsx` (novo)
  - Action: Componente client com:
    - Props: `open`, `onOpenChange`, `category?` (para edicao), `onSuccess`, `type` (expense/income default)
    - Campos: input nome, seletor de emoji (grid de emojis comuns pre-definidos), tipo (tabs expense/income)
    - Submit chama `createCategory` ou `updateCategory` via server action
    - Toast de sucesso/erro via sonner
    - Usar shadcn Dialog/Sheet component
  - Notes: Grid de emojis pode ser uma lista curada de ~20 emojis relevantes (comida, transporte, casa, saude, etc). Manter simples

- [x] Task 4: Criar componente de gerenciamento de categorias
  - File: `src/components/category-management.tsx` (novo)
  - Action: Componente client com:
    - Recebe `categories` como props
    - Lista categorias agrupadas por tipo (Despesas / Receitas)
    - Cada item mostra: emoji + nome + botoes editar/excluir
    - Categoria "Outros" sem botoes de acao (protegida)
    - Botao "Nova categoria" no topo de cada grupo
    - Editar abre `CategoryFormDialog` em modo edicao
    - Excluir mostra confirmacao ("Transacoes serao movidas para Outros") e chama `deleteCategory`
    - Animacoes com framer-motion (enter/exit de itens)
  - Notes: Usar padrao visual consistente com o resto do app (bg-card, rounded-2xl, divide-y)

- [x] Task 5: Criar pagina de gerenciamento de categorias
  - File: `src/app/(app)/profile/categories/page.tsx` (novo)
  - Action: Server component que:
    - Busca session com `getSession()`, redirect se nao autenticado
    - Busca categorias do usuario via `prisma.category.findMany`
    - Renderiza header com titulo "Categorias" + botao voltar
    - Passa categorias para `CategoryManagement`
  - Notes: Seguir padrao de ProfilePage (getSession + redirect)

- [x] Task 6: Adicionar link de categorias na pagina de perfil
  - File: `src/app/(app)/profile/page.tsx`
  - Action: Adicionar novo item na secao "Configuracoes" entre "Tema escuro" e "Informacoes da conta":
    - Icone: `Tags` ou `Grid2X2` do lucide-react
    - Texto: "Categorias"
    - Wrappado em `<Link href="/profile/categories">`
    - Adicionar chevron right para indicar navegacao
  - Notes: Manter estilo consistente com itens existentes (min-h-[48px], gap-3, px-4)

- [x] Task 7: Adicionar botao "+ Nova" no CategoryGrid do formulario de transacao
  - File: `src/components/category-grid.tsx`
  - Action:
    - Adicionar prop opcional `onAddNew?: () => void`
    - Se `onAddNew` fornecido, renderizar botao "+" como ultimo item do grid (apos categorias)
    - Botao com estilo: circulo tracejado (dashed border), icone "+" centralizado, label "Nova"
    - Ao clicar, chama `onAddNew()`
  - Notes: Manter compatibilidade — prop opcional nao quebra usos existentes

- [x] Task 8: Integrar criacao inline no TransactionForm
  - File: `src/components/transaction-form.tsx`
  - Action:
    - Adicionar state `showNewCategoryDialog` (boolean)
    - Passar `onAddNew={() => setShowNewCategoryDialog(true)}` para CategoryGrid
    - Renderizar `CategoryFormDialog` controlado pelo state
    - No `onSuccess` do dialog: fechar dialog. O layout recarrega categorias automaticamente via revalidatePath
    - Passar `type={transactionType}` para o dialog pre-selecionar o tipo correto
  - Notes: O revalidatePath no server action faz o layout re-executar `ensureAndGetCategories`, atualizando as props

- [x] Task 9: Criar testes das server actions de categorias
  - File: `src/__tests__/categories-actions.test.ts` (novo)
  - Action: Testes seguindo padrao de `create-transaction.test.ts`:
    - `createCategory`: nao autenticado retorna erro, dados invalidos retorna erro, nome duplicado retorna erro amigavel, sucesso cria e revalida
    - `updateCategory`: nao autenticado, categoria nao encontrada, tentar editar "Outros" bloqueado, sucesso atualiza
    - `deleteCategory`: nao autenticado, tentar deletar "Outros" bloqueado, delecao sem transacoes (deleta direto), delecao com transacoes (migra para "Outros" e deleta)
    - `getCategories`: nao autenticado, sucesso retorna lista ordenada
  - Notes: Mock prisma, auth, next/cache. Usar vi.mocked()

- [x] Task 10: Criar testes dos componentes de categorias
  - File: `src/__tests__/category-management.test.tsx` (novo)
  - Action: Testes seguindo padrao de `category-grid.test.tsx`:
    - Renderiza lista de categorias agrupadas por tipo
    - Categoria "Outros" nao tem botoes de acao
    - Botao "Nova categoria" presente em cada grupo
    - Botao excluir mostra confirmacao
    - CategoryGrid com botao "+" renderiza quando onAddNew fornecido
    - CategoryGrid sem onAddNew nao renderiza botao "+"
  - Notes: Mock framer-motion, server actions

### Acceptance Criteria

- [x] AC 1: Given usuario autenticado, when acessa /profile/categories, then ve lista de categorias agrupadas por Despesas e Receitas com emoji + nome
- [x] AC 2: Given usuario na tela de categorias, when clica "Nova categoria" e preenche nome + emoji + tipo, then categoria e criada e aparece na lista
- [x] AC 3: Given usuario na tela de categorias, when tenta criar categoria com nome duplicado, then ve mensagem "Ja existe uma categoria com esse nome"
- [x] AC 4: Given usuario na tela de categorias, when clica editar em uma categoria, then pode alterar nome, emoji e tipo, e salvar
- [x] AC 5: Given usuario na tela de categorias, when tenta editar/deletar categoria "Outros", then botoes de acao nao sao exibidos (protegida)
- [x] AC 6: Given categoria com transacoes vinculadas, when usuario confirma exclusao, then transacoes sao migradas para "Outros" e categoria e deletada
- [x] AC 7: Given categoria sem transacoes, when usuario confirma exclusao, then categoria e deletada diretamente
- [x] AC 8: Given usuario no formulario de transacao, when clica "+" no grid de categorias, then dialog de criacao rapida abre com tipo pre-selecionado
- [x] AC 9: Given usuario cria categoria inline no form, when salva, then nova categoria aparece no grid sem recarregar pagina
- [x] AC 10: Given tela de perfil, when usuario ve secao Configuracoes, then item "Categorias" aparece com link para /profile/categories

## Additional Context

### Dependencies

- Nenhuma nova dependencia necessaria — stack atual suporta tudo
- shadcn/ui Dialog ou Sheet para o form dialog (verificar se ja esta instalado, senao adicionar)

### Testing Strategy

- **Server Actions** (`categories-actions.test.ts`): Testes unitarios com vi.mock para prisma, auth, next/cache. Cobrir: auth guard, validacao zod, unique constraint, protecao "Outros", migracao atomica na delecao
- **Componentes** (`category-management.test.tsx`): Testes com testing-library + mock framer-motion. Cobrir: renderizacao, agrupamento, protecao "Outros", botao "+", confirmacao de delecao
- **Cenarios criticos**: Delecao com migracao atomica ($transaction), nome duplicado (unique constraint), protecao "Outros"

### Notes

- `ensureAndGetCategories` no layout ja sincroniza categorias default — continua funcionando normalmente apos CRUD
- revalidatePath no server action faz o layout re-executar, atualizando categorias em toda a app
- Tipo `both` na categoria "Outros" permite que ela apareca em despesas e receitas
- Grid de emojis no dialog: manter curado e simples (~20 emojis), nao usar emoji picker externo

## Review Notes
- Adversarial review completed
- Findings: 16 total, 8 fixed, 8 skipped (noise/design decisions)
- Resolution approach: auto-fix
- Critical fix: dialog state reset via key remount
- High fixes: isolated delete pending state, specific error for missing "Outros", varied category colors
- Medium fixes: icon validation max(8), preserve "both" type on edit
