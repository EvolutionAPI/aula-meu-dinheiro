---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments:
  - product-brief-live-01.md
  - brainstorming-session-2026-03-19-1500.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
workflowType: 'prd'
classification:
  projectType: 'web_app'
  domain: 'fintech'
  complexity: 'low'
  projectContext: 'greenfield'
---

# Product Requirements Document — MeuDinheiro

**Author:** Davidson
**Date:** 2026-03-19

## Executive Summary

MeuDinheiro é um app web de finanças pessoais que resolve exatamente dois problemas: visualizar para onde vai o dinheiro (dashboard) e registrar gastos sem fricção (bottom sheet em 3 toques). O produto ataca uma lacuna emocional no mercado — apps de finanças existentes funcionam, mas ninguém sente prazer de usar. MeuDinheiro aposta em visual dark premium inspirado no PicPay (zinc-950, verde esmeralda #10b981), animações fluidas com Framer Motion e experiência mobile-first com zona do polegar respeitada.

**Público-alvo:** Jovens adultos (20-35 anos) que vivem no celular e esperam qualidade visual de Instagram/PicPay em tudo que usam.

**Stack:** Next.js + React + TypeScript + Tailwind CSS + shadcn/ui + Prisma/SQLite + Framer Motion + Sonner.

**Contexto:** Projeto de portfólio apresentado em live — o "negócio" é provar competência técnica e entregar valor real com código limpo e visual que impressiona.

### What Makes This Special

A diferenciação do MeuDinheiro é emocional, não funcional. O insight central: pessoas desistem de controlar gastos não por falta de vontade, mas porque os apps são feios e chatos. O MeuDinheiro inverte essa equação — visual premium que hipnotiza (dark mode com profundidade, counter animations, skeleton loading), registro em 3 toques via bottom sheet que sobe do polegar, e feedback que vicia (toasts animados, semáforo de cores no saldo). O escopo cirúrgico (dashboard + registro + auth) permite execução impecável em vez de features medianas. Nenhum concorrente direto combina visual de app bancário premium com simplicidade de tracker pessoal.

## Project Classification

| Aspecto | Classificação |
|---------|--------------|
| **Tipo de Projeto** | Web App (SPA, Next.js, mobile-first) |
| **Domínio** | Fintech (finanças pessoais — sem transações reais, sem compliance) |
| **Complexidade** | Baixa (tracker pessoal, sem regulamentação, dados locais) |
| **Contexto** | Greenfield (projeto novo do zero) |

## Success Criteria

### User Success

| Critério | Target | Medição |
|----------|--------|---------|
| Tempo do primeiro registro | < 10 segundos | Timer: abertura do bottom sheet até toast de confirmação |
| Compreensão do dashboard | < 2 segundos | Teste: usuário identifica saldo e maior gasto sem instrução |
| Registros por semana (ativo) | >= 5 transações/semana | Contagem no banco por usuário |
| Tempo de onboarding | < 30 segundos | Timer: cadastro até visualização do dashboard |
| Retenção dia 7 | >= 40% | Usuários que voltam após 7 dias |
| Retenção dia 30 | >= 20% | Usuários ativos após 30 dias |

**Momento de sucesso:** Fim do mês, abre o dashboard e pela primeira vez sabe exatamente quanto gastou em cada categoria. O semáforo de cores do saldo vira termômetro financeiro pessoal.

### Business Success

| Objetivo | Meta | Prazo |
|----------|------|-------|
| App funcional e demonstrável | 100% das features MVP rodando sem erros | Fim do sprint |
| Impacto visual na live | Audiência comenta positivamente sobre o visual | Apresentação |
| Código limpo para portfólio | Repo público com README, demo e componentes reutilizáveis | Pós-live |

MeuDinheiro é projeto de portfólio/demonstração técnica. Sucesso = provar competência técnica e entregar valor real, não monetização.

### Technical Success

| KPI | Target |
|-----|--------|
| Lighthouse score (mobile) | >= 90 |
| Animações | 60fps sem jank |
| Touch response | < 100ms |
| First Load JS bundle | < 200KB |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Contraste dark mode | WCAG AA (>= 4.5:1 texto) |

### Measurable Outcomes

O MVP é bem-sucedido quando simultaneamente: (1) fluxo completo funciona sem erros (cadastro → login → registro → dashboard), (2) visual dark premium impressiona na live, (3) Lighthouse >= 90, (4) registro de transação em < 10 segundos, (5) código limpo e estruturado para evolução.

## Product Scope

### MVP Strategy

**Abordagem:** Experience MVP — o diferencial é a experiência visual e de uso, não a funcionalidade. Cortar features, nunca cortar polish.

**Recurso:** 1 desenvolvedor full-stack (Davidson), stack já instalada. Sem dependência de equipe ou infra externa.

### MVP Feature Set (Phase 1)

1. **Auth Simples** — Cadastro email/senha (bcryptjs), login/logout, onboarding com renda mensal, 7 categorias pré-definidas automáticas
2. **Dashboard (Home)** — Header com saudação + olho para ocultar valores, hero card saldo com semáforo de cores, counter animation, mini gráfico receita vs despesa, ações rápidas, últimas 5 transações, skeleton loading
3. **Registro de Transações** — FAB "+" acessível de qualquer tela, bottom sheet com abas Despesa/Receita, teclado numérico dark, grid de categorias coloridas, descrição opcional, toast de confirmação
4. **Tela de Transações** — Lista estilo feed com avatar de categoria, filtro por pills (Hoje/Semana/Mês), resumo flutuante com total do período, swipe para deletar + toast com undo
5. **Visual & UX (Transversal)** — Dark mode padrão (zinc-950/verde esmeralda #10b981), cards arredondados com profundidade, tipografia hierárquica (Inter/Geist), micro-animações (fade+slide, counter), bottom nav 3 abas com dot verde, touch targets 48px, mobile-first com breakpoints desktop
6. **Perfil** — Avatar de iniciais (círculo verde + iniciais brancas), menu em cards, toggle dark/light

**Must-Have Capabilities (justificadas):**

| # | Capability | Justificativa |
|---|-----------|---------------|
| 1 | Auth (cadastro/login/logout) | Sem auth não tem persistência de dados |
| 2 | Onboarding (renda + categorias) | Sem isso dashboard fica vazio e sem contexto |
| 3 | Dashboard com hero card + saldo | Core da proposta de valor — "ver pra onde vai" |
| 4 | Semáforo de cores no saldo | Diferencial emocional — feedback visual imediato |
| 5 | Counter animation nos valores | Wow factor visual — impressiona na live |
| 6 | Últimas transações na home | Contexto imediato sem navegar |
| 7 | FAB + Bottom sheet de registro | Core da proposta — "registrar sem pensar" |
| 8 | Grid de categorias coloridas | UX diferenciada — toque visual em vez de dropdown |
| 9 | Toast de confirmação (Sonner) | Feedback que fecha o loop da ação |
| 10 | Tela de transações com filtros | Sem histórico o dashboard perde contexto |
| 11 | Swipe delete + undo | Recovery path essencial |
| 12 | Dark mode padrão | Identidade visual core |
| 13 | Bottom nav 3 abas | Navegação mobile-first |
| 14 | Skeleton loading | Polish que diferencia de "projeto de estudo" |
| 15 | Perfil com avatar + toggle tema | Completude da experiência |

### Growth Features — Phase 2 (v1.5-v2.0)

- Google OAuth — reduz fricção do cadastro
- Export CSV — utilidade real para usuários que ficam
- Categorias customizáveis — personalização
- Metas financeiras com barra de progresso + confetti — engajamento
- Gráfico donut interativo de categorias — visualização rica
- PWA instalável com service worker — experiência nativa
- Filtros avançados na tela de transações

### Vision — Phase 3 (v3.0+)

- Registro por texto natural ("gastei 30 no almoço") — fricção zero
- Resumo semanal automático com insights — valor proativo
- Streak de economia estilo Duolingo — retenção
- Gráfico de bolhas animado por categoria — wow factor avançado

### Risk Mitigation Strategy

**Technical Risks:**
- *Animações com jank em mobile:* Framer Motion com `will-change`, testar em dispositivos reais, fallback com `prefers-reduced-motion`
- *Bundle size excedendo 200KB:* Dynamic imports para bottom sheet e tela de transações, tree-shaking de shadcn/ui
- *SQLite limitações com Prisma:* Schema simples (3 tabelas: User, Category, Transaction), sem queries complexas

**Market Risks:**
- *Audiência não se impressiona:* Focar em 3 momentos wow na demo (counter animation, bottom sheet, semáforo). Se 1 impressiona, MVP valida.
- *Ninguém usa após a live:* Risco aceitável — objetivo primário é portfólio, uso real é bônus.

**Resource Risks:**
- *Tempo insuficiente:* Escopo já é cirúrgico. Se apertar, cortar: perfil (usar apenas logout), filtros de transações, toggle light mode. Core intocável: dashboard + registro + auth.

## User Journeys

### Journey 1: Lucas, 24 — "Primeiro Mês no Controle" (Primary User - Happy Path)

**Persona:** Dev júnior, primeiro emprego CLT, R$ 3.500/mês, mora sozinho. Já deletou Mobills por ser feio. Controla nada — abre o app do banco e torce pra ter saldo.

**Opening Scene:** Sexta-feira, 23h. Lucas acabou de receber o salário e já não lembra quanto gastou de iFood essa semana. Abre o app do banco: R$ 127 na conta. "Como assim? Recebi há 10 dias." Frustrante. Vê o MeuDinheiro numa live e pensa: "esse app é bonito demais, quero testar."

**Rising Action:**
1. Abre o MeuDinheiro → tela de cadastro limpa, dark. Email, senha, pronto. "Qual sua renda mensal?" → digita 3500 → Dashboard aparece com saudação "Olá, Lucas" e categorias prontas. 25 segundos.
2. Sábado de manhã, almoço no restaurante. Abre o app, toca no FAB "+". Bottom sheet sobe suave. Digita 45 no teclado dark, toca "Alimentação" (laranja), confirma. Toast: "Transação salva". 6 segundos. "Isso foi rápido."
3. Durante a semana, registra Uber (R$ 18), Steam (R$ 89), supermercado (R$ 230). Cada registro: FAB → valor → categoria → pronto. Vira automático.

**Climax:** Domingo à noite, abre o dashboard. Hero card mostra saldo amarelo (apertado). Vê: Alimentação R$ 680, Lazer R$ 189. "Caramba, gastei quase 700 de comida." Pela primeira vez, tem o número real. O semáforo amarelo não mente.

**Resolution:** Mês seguinte, Lucas já registra no automático. Abre o app todo dia pra ver o termômetro. Primeiro mês que termina no verde. Mostra o dashboard pro colega: "olha esse app que eu uso." Não deleta.

### Journey 2: Camila, 31 — "A Prova na Ponta dos Dedos" (Primary User - Alternate Goal)

**Persona:** RH, casada, 1 filho. Renda familiar R$ 7.000. Divide gastos com marido. Usa bloco de notas pra anotar. Esquece metade. Fim do mês: briga.

**Opening Scene:** Terça-feira, fila do supermercado. Camila olha o total: R$ 347. Pensa "preciso anotar isso" e abre o bloco de notas. Já tem 6 anotações desorganizadas. Desiste. Chega em casa, marido pergunta: "quanto gastamos de mercado esse mês?" Silêncio.

**Rising Action:**
1. Cadastro rápido: email, senha, renda 7000. Dashboard com 7 categorias prontas.
2. Na próxima ida ao mercado, fila do caixa: FAB → 289 → Alimentação → pronto. Fez enquanto esperava. Sem abrir bloco de notas.
3. Registra gasolina, escola do filho, farmácia. Tudo pelo bottom sheet enquanto faz outras coisas. 5 segundos cada.

**Climax:** Fim do mês. Abre o dashboard e mostra pro marido no celular: "Olha, a gente gastou R$ 1.200 em alimentação, R$ 800 em transporte, R$ 450 em saúde." Primeira vez que tem o número real. Discussão vira planejamento.

**Resolution:** Camila registra todo gasto no momento que acontece. Zero anotações perdidas. A "briga do fim do mês" virou "reunião do dashboard" — olham juntos, decidem juntos. O app virou ferramenta de paz doméstica.

### Journey 3: Lucas — "O Registro que Deu Errado" (Primary User - Edge Case / Error Recovery)

**Opening Scene:** Lucas está no ônibus, registrando o almoço. Distração — digita R$ 450 em vez de R$ 45 na categoria Alimentação.

**Rising Action:**
1. Toast aparece: "Transação salva". Lucas olha o dashboard — saldo vermelho profundo. "Epa, errei."
2. Vai na tela de Transações. Vê o registro de R$ 450 no topo. Swipe para esquerda → botão vermelho "Excluir".
3. Toast com "Desfazer" por 3 segundos — mas ele quer deletar mesmo. Transação removida.
4. FAB → registra R$ 45 correto → Alimentação → pronto.

**Resolution:** Dashboard volta ao normal, saldo amarelo (onde deveria estar). Erro corrigido em 10 segundos. Sem frustração, sem tela de edição complexa. Swipe + novo registro = resolvido.

### Journey 4: Audiência da Live — "O Espectador que Vira Usuário" (Secondary User - Demo Context)

**Persona:** Espectador da live do Davidson. Curioso sobre desenvolvimento, nível iniciante a intermediário. Avalia projetos pelo visual antes de olhar código.

**Opening Scene:** Espectador assistindo a live. Davidson compartilha tela e abre o MeuDinheiro. Fundo dark, saldo com counter animation contando de 0 a R$ 2.350 em 500ms, cards com profundidade. Chat: "que bonito", "parece app de verdade".

**Rising Action:**
1. Davidson demonstra o registro: FAB → bottom sheet sobe com animação suave → teclado dark → toca categoria → toast com sonner. Fluido, sem travamento.
2. Dashboard atualiza em tempo real: saldo recalcula com counter, última transação aparece com fade+slide.
3. Mostra toggle dark/light, skeleton loading, filtros por pills. Cada interação tem feedback visual.

**Climax:** Espectador pensa: "isso é projeto de portfólio? Parece produto real." Vai ao repo do GitHub, vê código organizado com componentes reutilizáveis. Estrela no repo.

**Resolution:** Espectador inspira-se para construir projetos com o mesmo nível de polish. Alguns testam o MeuDinheiro pra uso pessoal. Davidson demonstra competência técnica com código vivo.

### Journey Requirements Summary

| Journey | Capabilities Reveladas |
|---------|----------------------|
| Lucas - Happy Path | Cadastro rápido, onboarding com renda, FAB + bottom sheet, categorias pré-definidas, dashboard com saldo/semáforo, counter animation, toast feedback |
| Camila - Alternate Goal | Registro ultra-rápido (5s), dashboard como ferramenta de comunicação, resumo claro por categoria, visualização mobile otimizada |
| Lucas - Error Recovery | Tela de transações com lista, swipe para deletar, toast com undo, re-registro rápido, dashboard atualiza em tempo real |
| Audiência da Live | Visual dark premium, animações fluidas 60fps, skeleton loading, toggle tema, código limpo no repo, demo flow impressionante |

## Web App Specific Requirements

### Project-Type Overview

MeuDinheiro é uma SPA construída com Next.js, operando como web app mobile-first. Navegação client-side com bottom navigation entre 3 telas (Home, Transações, Perfil). SEO não é prioridade (app pessoal, não conteúdo público). Real-time não necessário (dados locais, single user).

### Technical Architecture

- Next.js App Router com client-side navigation
- Bottom nav como layout persistente (não recarrega entre telas)
- Estado via React state + Server Actions para persistência
- Prisma + SQLite como banco local (sem infra externa)

**Browser Support:**

| Browser | Suporte | Notas |
|---------|---------|-------|
| Chrome Mobile | Primary | Target principal — maioria Android |
| Safari iOS | Primary | Target principal — usuários iPhone |
| Chrome Desktop | Secondary | Demo na live e desenvolvimento |
| Firefox/Edge | Best effort | Sem testes dedicados |

**Responsive Design:**
- Mobile-first com Tailwind breakpoints
- Coluna única no mobile (base) — experiência primária
- Grid expandido no desktop (md: e lg:) — para demo na live
- Touch targets mínimo 48px, zona do polegar respeitada

### Implementation Stack

| Tecnologia | Uso |
|-----------|-----|
| shadcn/ui | Componentes acessíveis, customizados para visual dark premium |
| Framer Motion | Animações de UI (counter, fade, slide) |
| Sonner | Toasts de feedback em todas as ações |
| Prisma/SQLite | Persistência sem servidor de banco externo |
| bcryptjs | Hash de senhas client-safe |
| react-hook-form + zod | Validação type-safe de formulários |

## Functional Requirements

### User Management

- FR1: Usuário pode criar uma conta com email e senha
- FR2: Usuário pode fazer login com email e senha
- FR3: Usuário pode fazer logout da sessão ativa
- FR4: Usuário pode informar sua renda mensal durante o onboarding
- FR5: Sistema cria categorias pré-definidas automaticamente ao registrar novo usuário

### Dashboard & Visualização Financeira

- FR6: Usuário pode visualizar seu saldo atual (receitas - despesas do mês)
- FR7: Usuário pode ocultar/exibir valores financeiros no dashboard
- FR8: Sistema exibe indicador visual de saúde financeira baseado no saldo (positivo/apertado/negativo)
- FR9: Usuário pode visualizar resumo comparativo de receitas vs despesas do mês
- FR10: Usuário pode visualizar as últimas transações registradas na home
- FR11: Usuário pode acessar ações rápidas de registro a partir do dashboard

### Registro de Transações

- FR12: Usuário pode registrar uma despesa informando valor e categoria
- FR13: Usuário pode registrar uma receita informando valor e categoria
- FR14: Usuário pode adicionar uma descrição opcional ao registrar transação
- FR15: Usuário pode selecionar uma categoria a partir de categorias visuais disponíveis
- FR16: Sistema confirma visualmente cada transação registrada com sucesso
- FR17: Usuário pode iniciar o registro de transação a partir de qualquer tela do app

### Histórico de Transações

- FR18: Usuário pode visualizar lista completa de transações registradas
- FR19: Usuário pode filtrar transações por período (hoje, semana, mês)
- FR20: Usuário pode visualizar o total consolidado do período filtrado
- FR21: Usuário pode excluir uma transação existente
- FR22: Sistema oferece opção de desfazer a exclusão de uma transação por tempo limitado

### Perfil & Preferências

- FR23: Usuário pode visualizar seu perfil com identificação visual (iniciais)
- FR24: Usuário pode alternar entre tema escuro e claro
- FR25: Usuário pode acessar opções de configuração do perfil

### Navegação

- FR26: Usuário pode navegar entre as seções principais do app (Home, Transações, Perfil)
- FR27: Sistema indica visualmente qual seção está ativa na navegação

### Feedback Visual & Experiência

- FR28: Sistema exibe estados de carregamento visuais enquanto busca dados
- FR29: Sistema exibe animações de transição ao navegar entre telas e ao carregar valores
- FR30: Sistema exibe saudação personalizada com o nome do usuário

## Non-Functional Requirements

### Performance

| Requisito | Critério | Justificativa |
|-----------|----------|---------------|
| NFR1: Lighthouse score mobile | >= 90 | Credibilidade como projeto de portfólio |
| NFR2: First Contentful Paint | < 1.5s | Primeira impressão na demo/live |
| NFR3: Largest Contentful Paint | < 2.5s | Dashboard deve carregar rapidamente |
| NFR4: Cumulative Layout Shift | < 0.1 | Elementos não podem "pular" durante carregamento |
| NFR5: First Load JS bundle | < 200KB | Mobile-first exige bundle enxuto |
| NFR6: Animações UI | 60fps sem jank | Diferencial do produto — fluidez é core |
| NFR7: Touch response | < 100ms | Toque no FAB/categorias deve ser instantâneo |
| NFR8: Counter animation | ~500ms de 0 ao valor real | Consistente com a identidade visual |

### Security

| Requisito | Critério | Justificativa |
|-----------|----------|---------------|
| NFR9: Senhas com hash | bcryptjs com salt rounds >= 10 | Nunca armazenar senha em texto puro |
| NFR10: Sessão autenticada | Todas as rotas exceto login/cadastro protegidas | Dados financeiros são pessoais |
| NFR11: Validação server-side | Todos os campos validados com zod antes de persistir | Prevenir dados corrompidos |
| NFR12: Sem exposição de dados sensíveis | Senhas e tokens nunca retornados em responses | Segurança básica da API |

### Accessibility

| Requisito | Critério | Justificativa |
|-----------|----------|---------------|
| NFR13: Contraste WCAG AA | Ratio >= 4.5:1 em texto, >= 3:1 em elementos grandes | Dark mode precisa de contraste adequado |
| NFR14: Semantic HTML | Elementos corretos (button, nav, main, heading hierarchy) | Screen readers e SEO básico |
| NFR15: Focus visible | Outline visível em navegação por teclado | Acessibilidade desktop |
| NFR16: Touch targets | Mínimo 48x48px em todos os interativos | Usabilidade mobile |
| NFR17: Reduced motion | Respeitar `prefers-reduced-motion` para animações | Sensibilidade a movimento |
