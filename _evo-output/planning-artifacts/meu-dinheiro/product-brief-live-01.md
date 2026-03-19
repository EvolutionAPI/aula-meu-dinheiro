---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - brainstorming-session-2026-03-19-1500.md
date: 2026-03-19
author: Davidson
---

# Product Brief: MeuDinheiro

## Executive Summary

MeuDinheiro é um app de finanças pessoais que resolve só duas coisas e resolve lindamente: ver pra onde vai seu dinheiro (dashboard) e registrar gastos sem pensar (bottom sheet). Visual dark premium inspirado no PicPay, animações fluidas, zero fricção. Escopo cirúrgico, execução impecável. Construído com Next.js, Tailwind, shadcn/ui e Framer Motion — mobile first de verdade.

---

## Core Vision

### Problem Statement

Controlar dinheiro é chato. Os apps financeiros parecem planilhas glorificadas — telas cinzas, menus infinitos, zero prazer de uso. As pessoas desistem não porque não querem organizar as finanças, mas porque a experiência é sofrida. Ninguém abre com vontade um app feio.

### Problem Impact

Qualquer pessoa que já baixou um app de finanças, usou 3 dias e deletou. Especialmente jovens que vivem no celular e esperam que tudo tenha a mesma qualidade visual do Instagram ou PicPay. O resultado: gastos sem consciência, zero controle, frustração acumulada.

### Why Existing Solutions Fall Short

- **Apps bancários (Nubank, PicPay):** Lindos, mas não são sobre controle de gastos pessoais
- **Apps de finanças tradicionais (Mobills, Organizze):** Funcionam, mas visual dos anos 2000 — ninguém sente prazer de usar
- **Planilhas:** Eficientes e horríveis

A lacuna é emocional: ninguém fez um app de finanças que dá orgulho de mostrar pros amigos.

### Proposed Solution

Um app que resolve só duas coisas e resolve lindamente: ver pra onde vai seu dinheiro (dashboard) e registrar gastos sem pensar (bottom sheet). Nada mais. Escopo cirúrgico, execução impecável.

**Escopo real:** Dashboard + Registro de transações + Auth simples. Sem metas, sem gráficos complexos, sem features que atrasam. Faz pouco, faz perfeito.

### Key Differentiators

1. **Visual que hipnotiza** — Dark mode zinc-950, verde esmeralda #10b981 pulsando nos pontos certos, cards com profundidade, tudo arredondado e respirando
2. **Animações que dão vida** — Valores contam de 0 ao número real, cards entram com fade+slide, barras preenchem suavemente, skeleton loading enquanto carrega
3. **Zero fricção** — FAB gigante, bottom sheet que sobe do polegar, teclado estilizado dark, categorias coloridas em grid, 3 toques e registrou
4. **Feedback que vicia** — Toast animado confirmando cada ação, semáforo de cores no saldo (verde/amarelo/vermelho), micro-interações em tudo que toca
5. **Mobile first de verdade** — Zona do polegar respeitada, touch 48px, bottom nav minimalista com dot verde, coluna única que respira

**Stack:** Next.js + Tailwind CSS + shadcn/ui + Framer Motion + Sonner + Prisma/SQLite

## Target Users

### Primary Users

#### Persona 1: Lucas, 24 anos — "O Jovem que Quer Sair do Vermelho"

**Contexto:** Dev júnior, primeiro emprego CLT, mora sozinho. Ganha R$ 3.500 e no dia 20 já não sabe onde foi o dinheiro. Vive no celular, exige visual bonito em tudo que usa.

**Dor atual:** Já baixou Mobills, achou feio, deletou em 2 dias. Já tentou planilha, durou 1 semana. Hoje controla nada — abre o app do banco e torce pra ter saldo.

**O que faria ele ficar:** Abrir o MeuDinheiro e pensar "esse app é bonito demais". Ver o saldo com animação, registrar o almoço em 3 toques no bottom sheet, ver o card mudar de verde pra amarelo quando apertar. Prazer visual = hábito.

**Momento "aha!":** Fim do mês, abre o dashboard e pela primeira vez sabe exatamente quanto gastou com delivery. "Era isso que eu precisava."

#### Persona 2: Camila, 31 anos — "A Mãe que Quer Controle Rápido"

**Contexto:** Trabalha em RH, casada, 1 filho. Renda familiar R$ 7.000. Divide gastos com o marido e perde o controle fácil. Tempo livre = zero.

**Dor atual:** Usa o bloco de notas do celular pra anotar gastos. Esquece metade. No fim do mês, briga com o marido sobre onde foi o dinheiro.

**O que faria ela ficar:** Registrar o supermercado enquanto espera na fila — FAB, bottom sheet, valor, categoria, pronto. 5 segundos. Dashboard mostra tudo sem precisar pensar.

**Momento "aha!":** Mostra pro marido o dashboard no celular: "olha, a gente gastou R$ 1.200 em alimentação esse mês". Primeira vez que tem o número real.

### Secondary Users

Para o escopo MVP, não há usuários secundários. O MeuDinheiro é 100% individual — sem compartilhamento, sem roles, sem admin. Uma pessoa, suas finanças, seu celular.

### User Journey

```
Descoberta → Onboarding → Primeiro Registro → Dashboard → Hábito
```

1. **Descoberta:** Vê o app na live/portfólio — "que visual bonito, quero testar"
2. **Onboarding (30s):** Cadastro email/senha → "Qual sua renda?" → Dashboard com categorias pré-definidas. Sem tutorial, sem tour.
3. **Primeiro Registro (<10s):** FAB → bottom sheet sobe → digita valor no teclado dark → toca na categoria → toast "Transação salva ✓". Pensou "isso foi rápido".
4. **Dashboard (momento de valor):** Volta no dia seguinte, hero card com saldo animado, últimas transações com ícones coloridos, mini gráfico receita vs despesa. Entendeu tudo em 2 segundos.
5. **Hábito (semana 2+):** Registra gastos no automático. Abre o app pra ver como tá o mês. O semáforo do saldo virou seu termômetro financeiro. Não deleta mais.

## Success Metrics

### Métricas de Sucesso do Usuário

| Métrica | Target | Como medir |
|---------|--------|------------|
| Tempo do primeiro registro | < 10 segundos | Timer desde abertura do bottom sheet até confirmação |
| Compreensão do dashboard | < 2 segundos | Teste: usuário identifica saldo e maior gasto sem instrução |
| Registros por semana (usuário ativo) | ≥ 5 transações/semana | Contagem no banco por usuário |
| Retenção dia 7 | ≥ 40% | Usuários que voltam após 7 dias do cadastro |
| Retenção dia 30 | ≥ 20% | Usuários ativos após 30 dias |
| Tempo de onboarding | < 30 segundos | Timer do cadastro até ver o dashboard |

### Business Objectives

**Contexto:** MeuDinheiro é um projeto de portfólio/demonstração técnica apresentado em live. O "negócio" aqui é provar competência técnica e entregar valor real.

| Objetivo | Meta | Prazo |
|----------|------|-------|
| App funcional e demonstrável | 100% das features MVP rodando | Fim do sprint |
| Impacto visual na live | Audiência comenta "que bonito" | Apresentação |
| Código limpo e portfólio | Repo público com README e demo | Pós-live |
| PWA instalável | Funciona offline no celular | Pós-MVP |

### Key Performance Indicators

**KPIs Técnicos (o que realmente importa pra execução):**

1. **Performance:** Lighthouse score ≥ 90 em mobile
2. **Fluidez:** Animações a 60fps sem jank (Framer Motion)
3. **Responsividade:** Touch response < 100ms em todas as interações
4. **Bundle size:** < 200KB first load JS
5. **Acessibilidade:** Contraste WCAG AA em dark mode

**KPIs de Produto (se fosse pra produção real):**

1. **DAU/MAU ratio:** ≥ 30% (indica hábito diário)
2. **Registros por sessão:** ≥ 1.5 transações por abertura
3. **Session duration:** 20-45 segundos (rápido = bom nesse caso)
4. **Crash rate:** < 0.1%
5. **NPS:** ≥ 50 (promotores > detratores)

## MVP Scope

### Core Features

**1. Auth Simples**
- Cadastro com email + senha (bcryptjs)
- Login/Logout com sessão
- Onboarding: perguntar renda mensal no primeiro acesso
- Categorias pré-definidas criadas automaticamente (7 categorias: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros)

**2. Dashboard (Home)**
- Header com saudação personalizada ("Olá, Davidson 👋") + ícone olho para ocultar valores
- Hero Card de Saldo com semáforo de cores (verde/amarelo/vermelho)
- Counter animation nos valores (framer-motion, 0 → valor real em ~500ms)
- Mini gráfico de barras horizontal: receita vs despesa do mês
- Ações rápidas em row (ícones circulares: Adicionar, Receitas, Despesas)
- Últimas 5 transações com ícone colorido da categoria + nome + valor
- Skeleton loading nos cards enquanto carrega

**3. Registro de Transações (Bottom Sheet)**
- FAB "+" fixo na tela, sempre acessível
- Bottom sheet modal com abas Despesa/Receita
- Campo valor grande com teclado numérico estilizado dark
- Grid de categorias com ícones coloridos
- Descrição opcional ("Adicionar nota...")
- Toast sonner de confirmação ("Transação salva ✓")
- Zona do polegar: tudo acessível na metade inferior

**4. Tela de Transações**
- Lista estilo feed com avatar da categoria
- Filtro por pills: Hoje, Semana, Mês
- Resumo flutuante no topo com total do período
- Swipe para deletar + toast com "Desfazer" (3s)

**5. Visual & UX (Transversal)**
- Dark mode padrão (zinc-950 fundo, zinc-800 cards, verde esmeralda #10b981)
- Cards arredondados (rounded-2xl) com profundidade
- Tipografia hierárquica (Inter/Geist): saldo 3xl bold, subtítulos semi-bold
- Micro-animações: fade+slide nos cards, counter nos valores
- Bottom nav 3 abas: Home, Transações, Perfil (dot verde ativo)
- Touch generoso 48px em todos os interativos
- Mobile first, coluna única que respira
- Responsivo com breakpoints Tailwind pra desktop

**6. Perfil**
- Avatar de iniciais (círculo verde + iniciais brancas)
- Menu em cards: Categorias, Tema, Sair
- Toggle dark/light mode

### Out of Scope for MVP

| Feature | Motivo | Quando |
|---------|--------|--------|
| Metas financeiras | Aumenta escopo significativamente | v2.0 |
| Gráfico donut de categorias | Nice-to-have, dashboard já mostra gastos | v2.0 |
| PWA/Service Worker | Foco primeiro em funcionalidade web | v2.0 |
| Streak de economia | Gamification é secundário | v2.0 |
| Gasto por texto natural (NLP) | Complexidade desproporcional | v3.0 |
| Resumo semanal com emoji | Requer cron/notificações | v3.0 |
| Múltiplos usuários/compartilhamento | Escopo individual apenas | Indefinido |
| Export CSV/PDF | Polish, não core | v2.0 |
| Google OAuth | Auth simples primeiro | v1.5 |

### MVP Success Criteria

O MVP é considerado **bem-sucedido** quando:

1. **Funcional:** Usuário consegue cadastrar, logar, registrar transações e ver dashboard — fluxo completo sem erros
2. **Visual:** Audiência da live reage positivamente ao visual dark premium — parece app "de verdade"
3. **Performance:** Lighthouse ≥ 90, animações fluidas, zero jank visível
4. **Velocidade de registro:** < 10 segundos do toque no FAB até confirmação
5. **Código:** Repo limpo, componentes reutilizáveis, estrutura clara para evolução

### Future Vision

**v1.5 — Quick Wins:**
- Google OAuth como alternativa de login
- Export de dados (CSV)
- Mais categorias customizáveis

**v2.0 — Features Completas:**
- Metas financeiras com barra de progresso + confetti ao completar
- Gráfico donut interativo de categorias
- PWA instalável com manifest + service worker
- Filtros avançados na tela de transações

**v3.0 — Inteligência:**
- Registro por texto natural ("gastei 30 no almoço")
- Resumo semanal automático com insights
- Streak de economia (gamification estilo Duolingo)
- Gráfico de bolhas animado por categoria
