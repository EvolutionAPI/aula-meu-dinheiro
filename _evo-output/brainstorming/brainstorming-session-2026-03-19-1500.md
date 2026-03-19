---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Sistema de finanças pessoais (MeuDinheiro) — simples, bonito, para live com iniciantes'
session_goals: 'Gerar ideias práticas e implementáveis para um app completo e pronto para produção'
selected_approach: 'ai-recommended'
techniques_used: ['What If Scenarios']
ideas_generated: 50
context_file: ''
session_active: false
workflow_completed: true
facilitation_notes: 'Davidson tem visão clara de produto — referência PicPay, mobile first, foco em impressionar audiência iniciante'
---

# Brainstorming Session Results

**Facilitador:** Davidson
**Data:** 2026-03-19

## Session Overview

**Tópico:** Sistema de finanças pessoais (MeuDinheiro) — simples, bonito, pronto para produção
**Objetivos:** Ideias práticas e implementáveis, visual bonito, demonstrável na live para iniciantes
**Referência Visual:** PicPay (dark, clean, verde como destaque)
**Abordagem:** Mobile First

### Session Setup

_Sessão simplificada com foco em resultado concreto e processo demonstrável para audiência de live._

## Technique Selection

**Abordagem:** Técnicas Recomendadas por IA (simplificada)
**Contexto:** App de finanças pessoais com foco em simplicidade, visual e produção

**Técnica Selecionada:**

- **What If Scenarios:** Explorar possibilidades com perguntas "E se..." para gerar funcionalidades, ideias visuais e diferenciais de forma rápida e prática.

**Racional da IA:** Técnica única e direta, ideal para sessão curta com foco em resultados concretos e demonstração do processo.

## Technique Execution Results

**What If Scenarios:**

- **Foco Interativo:** Funcionalidades, UX, visual, mobile first, onboarding, metas, polish
- **Breakthroughs:** Inspiração PicPay como identidade visual, bottom sheet para registro, confetti em metas, PWA instalável
- **Contribuições do Davidson:** Visão clara de home com dashboard, mobile first como prioridade, referência PicPay
- **Nível de Energia:** Alto — ideias fluíram naturalmente com direcionamento claro

### Creative Facilitation Narrative

_Sessão objetiva e produtiva. Davidson trouxe direção clara desde o início: dashboard na home, mobile first, visual inspirado no PicPay. A facilitação construiu em cima dessa visão, expandindo para 50 ideias concretas cobrindo todas as telas do app. O resultado é um mapa completo de produto pronto para virar PRD._

## Inventário Completo de Ideias (50 ideias)

### Tema 1: Home / Dashboard

| # | Ideia | Descrição |
|---|-------|-----------|
| #10 | Hero Card de Saldo | Card grande no topo com saldo atual. Verde se positivo, vermelho se negativo. Receitas e despesas com setas |
| #11 | Mini Gráfico de Barras | Gráfico horizontal comparando receita vs despesa do mês, com animação de preenchimento |
| #13 | Últimas Transações | Lista das últimas 5-7 transações com ícone da categoria + nome + valor colorido |
| #14 | Top 3 Categorias | Três cards lado a lado mostrando maiores gastos do mês com barrinhas de proporção |
| #27 | Header Saudação + Saldo | "Olá, Davidson 👋" + saldo bold + ícone de olho para esconder/mostrar valores |
| #28 | Ações Rápidas em Row | Ícones circulares horizontais: Adicionar, Receitas, Despesas, Metas — estilo PicPay |
| #49 | Counter Animation | Valores contam de 0 até o número real em ~500ms com framer-motion |
| #50 | Gráfico Donut | Distribuição de gastos por categoria, centro mostra total, toque destaca fatia |
| #26 | Feedback Semafórico | Cor de fundo do hero card muda: verde (positivo), amarelo (apertado), vermelho (negativo) |

### Tema 2: Visual / Identidade (Estilo PicPay)

| # | Ideia | Descrição |
|---|-------|-----------|
| #22 | Dark Mode Padrão | Fundo zinc-900/950, cards zinc-800, valores brancos, receitas verde-esmeralda, despesas vermelho-suave |
| #29 | Cards Arredondados | rounded-2xl, fundo zinc-800/850 sobre zinc-950, sombra sutil para profundidade |
| #30 | Verde Esmeralda | #10b981 como cor primária em botões, ícones ativos, valores positivos, gradiente no header |
| #24 | Ícones Coloridos por Categoria | Cada categoria com ícone + cor própria em círculo (Alimentação=laranja, Transporte=azul, etc.) |
| #25 | Tipografia Hierárquica | Saldo text-3xl bold, subtítulos semi-bold cinza claro, valores medium. Fonte Inter/Geist |
| #23 | Micro-Animações | Cards entram com fade+slide, valores com counter, FAB pulsa quando sem transação no dia |
| #41 | Toggle Dark/Light | Switch animado para alternar tema. Demonstra domínio técnico com Tailwind dark: |

### Tema 3: Registro de Transações

| # | Ideia | Descrição |
|---|-------|-----------|
| #33 | Bottom Sheet Modal | Toque em Adicionar → sheet sobe com abas Despesa/Receita. Campo valor gigante + grid categorias |
| #34 | Teclado Numérico Estilizado | Teclado próprio estilo calculadora dark, botões grandes arredondados, confirmar verde |
| #35 | Descrição Opcional | Campo "Adicionar nota..." discreto em cinza. Não obriga, não atrapalha |
| #17 | Zona do Polegar | Bottom sheet com tudo acessível na metade inferior da tela |
| #12 | FAB / Botão Adicionar | Botão redondo "+" fixo, sempre visível, sempre acessível |

### Tema 4: Tela de Transações

| # | Ideia | Descrição |
|---|-------|-----------|
| #36 | Filtro por Pills | Pills horizontais: Hoje, Semana, Mês, Ano. Ativo com fundo verde |
| #37 | Resumo Flutuante | Card fixo no topo com total do período filtrado, atualiza ao trocar filtro |
| #31 | Lista Estilo Feed | Avatar da categoria (círculo colorido + ícone), título, data cinza, valor alinhado à direita |
| #38 | Swipe Delete + Undo | Swipe esquerda → botão vermelho Excluir → toast sonner com "Desfazer" por 3s |
| #18 | Gestos Nativos | Swipe editar (direita, azul) e deletar (esquerda, vermelho) |

### Tema 5: Metas

| # | Ideia | Descrição |
|---|-------|-----------|
| #42 | Card com Barra de Progresso | Nome da meta, valor alvo, valor atual, barra com gradiente verde + porcentagem animada |
| #43 | Criar Meta Simples | Bottom sheet com 3 campos: nome, valor alvo, prazo opcional. Botão verde "Criar" |
| #44 | Alimentar Meta pelo Registro | Terceira aba no bottom sheet de registro: "Meta". Escolhe meta → digita valor |
| #45 | Confetti ao Completar | Barra chega em 100% → explosão de confetti animado + toast "Parabéns! 🎉" |
| #9 | Streak de Economia | Contador de dias consecutivos dentro do orçamento, estilo Duolingo |

### Tema 6: Mobile First & Navegação

| # | Ideia | Descrição |
|---|-------|-----------|
| #15 | Bottom Tab Bar 3 Abas | Home, Transações, Perfil. FAB centralizado maior que os outros ícones |
| #32 | Nav Minimalista | Só ícones sem texto + dot verde indicando aba ativa |
| #16 | Touch Generoso 48px | Área de toque mínima de 48px em todos os elementos interativos |
| #19 | Responsivo | Coluna única no mobile (base), grid no desktop com breakpoints Tailwind |

### Tema 7: Onboarding & Perfil

| # | Ideia | Descrição |
|---|-------|-----------|
| #20 | Cadastro em 30 Segundos | Email/senha (ou Google) → "Qual sua renda mensal?" → dashboard. Sem tutorial |
| #21 | Categorias Pré-Definidas | 7 categorias prontas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros |
| #39 | Avatar de Iniciais | Círculo verde com iniciais do nome em branco. Sem upload de foto |
| #40 | Menu em Cards | Lista: Categorias, Metas, Exportar, Tema, Sair. Ícone + seta, espaçamento generoso |

### Tema 8: Polish & Wow Factor (Live)

| # | Ideia | Descrição |
|---|-------|-----------|
| #46 | Skeleton Loading | Placeholders animados (pulso cinza) nos formatos dos cards ao carregar |
| #47 | Toasts com Sonner | Feedback em toda ação: "Transação salva ✓", "Meta criada! 🎯", com animação suave |
| #48 | PWA Instalável | manifest.json + service worker. Instala no celular como app nativo |

### Ideias Extras de UX

| # | Ideia | Descrição |
|---|-------|-----------|
| #1 | Registro Relâmpago | Tela inicial já é campo de valor. Abriu → digita → categoria → pronto |
| #2 | Botões de Gasto Rápido | Cards coloridos na home com categorias favoritas como atalhos |
| #3 | Gasto por Texto Natural | Campo chat: "gastei 30 no almoço" → app interpreta automaticamente |
| #4 | Gráfico de Bolhas Animado | Bolhas flutuantes por categoria, tamanho = valor gasto |
| #5 | Gradientes por Status | Cards mudam de cor: verde (ok), laranja (limite), vermelho (estourou) |
| #6 | Animações de Transição | Valor "cai" no card, barra cresce suave, confetti em metas |
| #7 | Metas com Barra Visual | "Quero juntar R$500" com progresso animado satisfatório |
| #8 | Resumo Semanal com Emoji | Card domingo: "Gastou R$320, maior: Alimentação 🍔, economizou R$80 🎯" |

## Layout Final — Wireframe Mobile

```
┌──────────────────────────┐
│  Olá, Davidson 👋    [👁] │
│  R$ 1.350,00             │
│  ══════════════════════   │
│                           │
│  ◉ Adicionar  ◉ Receitas │
│  ◉ Despesas   ◉ Metas    │
│                           │
│ ┌───────────────────────┐ │
│ │ Resumo do Mês         │ │
│ │ Receitas    R$ 3.200  │ │
│ │ Despesas    R$ 1.850  │ │
│ │ ████████████░░░░ 58%  │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Últimas Transações    │ │
│ │ 🍔 Almoço      -45,00│ │
│ │ 💰 Salário  +3.200,00│ │
│ │ 🚗 Uber        -18,50│ │
│ │ 🎮 Steam       -89,90│ │
│ │       Ver todas →     │ │
│ └───────────────────────┘ │
│                           │
│  🏠        📋        👤   │
│   ·                       │
└──────────────────────────┘
```

## Priorização

### Top Prioridade (MVP)

1. **Home/Dashboard** — Saudação, saldo oculável, resumo do mês, últimas transações, ações rápidas
2. **Registro via Bottom Sheet** — Abas despesa/receita, teclado estilizado, categorias em grid
3. **Visual Dark + Verde Esmeralda** — Identidade PicPay, cards arredondados, tipografia hierárquica
4. **Auth Simples** — Cadastro email/senha, onboarding rápido, categorias pré-definidas
5. **Bottom Nav 3 Abas** — Home, Transações, Perfil com dot verde ativo

### Quick Wins (Polish Premium)

- Counter animation nos valores (framer-motion)
- Skeleton loading nos cards
- Toasts com sonner em toda ação
- Toggle dark/light mode
- Avatar de iniciais no perfil

### Features Completas (Pós-MVP)

- Tela de transações com filtro por pills + swipe delete
- Metas com barra de progresso + confetti ao completar
- Gráfico donut de categorias
- PWA instalável
- Streak de economia

## Próximos Passos

1. **Usar este brainstorming como base** para o Product Brief do MeuDinheiro
2. **Definir escopo do MVP** — Home + Registro + Auth + Visual Dark
3. **Criar stories de implementação** seguindo o fluxo EVO
4. **Desenvolver mobile first** com Tailwind + shadcn/ui + Framer Motion

## Session Summary

**Conquistas da Sessão:**

- **50 ideias** geradas para o MeuDinheiro
- **8 temas organizados** cobrindo todas as áreas do app
- **Layout wireframe** definido para a home
- **Priorização clara** em 3 níveis: MVP, Quick Wins, Pós-MVP
- **Identidade visual definida:** Dark mode + verde esmeralda, inspiração PicPay

**Insight Principal:** O MeuDinheiro deve ser um app que a pessoa abre e entende tudo em 2 segundos — saldo, pra onde foi o dinheiro, e como registrar mais. Visual premium com dark mode e animações sutis transforma um app simples em algo que impressiona na live.

**Stack Confirmada:** Next.js + React + TypeScript + Tailwind CSS + shadcn/ui + Prisma + SQLite + Framer Motion + Sonner
