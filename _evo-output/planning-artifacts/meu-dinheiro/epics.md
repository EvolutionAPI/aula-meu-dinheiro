---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# MeuDinheiro - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for MeuDinheiro, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**User Management**
- FR1: Usuario pode criar uma conta com email e senha
- FR2: Usuario pode fazer login com email e senha
- FR3: Usuario pode fazer logout da sessao ativa
- FR4: Usuario pode informar sua renda mensal durante o onboarding
- FR5: Sistema cria categorias pre-definidas automaticamente ao registrar novo usuario

**Dashboard & Visualizacao Financeira**
- FR6: Usuario pode visualizar seu saldo atual (receitas - despesas do mes)
- FR7: Usuario pode ocultar/exibir valores financeiros no dashboard
- FR8: Sistema exibe indicador visual de saude financeira baseado no saldo (positivo/apertado/negativo)
- FR9: Usuario pode visualizar resumo comparativo de receitas vs despesas do mes
- FR10: Usuario pode visualizar as ultimas transacoes registradas na home
- FR11: Usuario pode acessar acoes rapidas de registro a partir do dashboard

**Registro de Transacoes**
- FR12: Usuario pode registrar uma despesa informando valor e categoria
- FR13: Usuario pode registrar uma receita informando valor e categoria
- FR14: Usuario pode adicionar uma descricao opcional ao registrar transacao
- FR15: Usuario pode selecionar uma categoria a partir de categorias visuais disponiveis
- FR16: Sistema confirma visualmente cada transacao registrada com sucesso
- FR17: Usuario pode iniciar o registro de transacao a partir de qualquer tela do app

**Historico de Transacoes**
- FR18: Usuario pode visualizar lista completa de transacoes registradas
- FR19: Usuario pode filtrar transacoes por periodo (hoje, semana, mes)
- FR20: Usuario pode visualizar o total consolidado do periodo filtrado
- FR21: Usuario pode excluir uma transacao existente
- FR22: Sistema oferece opcao de desfazer a exclusao de uma transacao por tempo limitado

**Perfil & Preferencias**
- FR23: Usuario pode visualizar seu perfil com identificacao visual (iniciais)
- FR24: Usuario pode alternar entre tema escuro e claro
- FR25: Usuario pode acessar opcoes de configuracao do perfil

**Navegacao**
- FR26: Usuario pode navegar entre as secoes principais do app (Home, Transacoes, Perfil)
- FR27: Sistema indica visualmente qual secao esta ativa na navegacao

**Feedback Visual & Experiencia**
- FR28: Sistema exibe estados de carregamento visuais enquanto busca dados
- FR29: Sistema exibe animacoes de transicao ao navegar entre telas e ao carregar valores
- FR30: Sistema exibe saudacao personalizada com o nome do usuario

### NonFunctional Requirements

**Performance**
- NFR1: Lighthouse score mobile >= 90
- NFR2: First Contentful Paint < 1.5s
- NFR3: Largest Contentful Paint < 2.5s
- NFR4: Cumulative Layout Shift < 0.1
- NFR5: First Load JS bundle < 200KB
- NFR6: Animacoes UI 60fps sem jank
- NFR7: Touch response < 100ms
- NFR8: Counter animation ~500ms de 0 ao valor real

**Security**
- NFR9: Senhas com hash bcryptjs com salt rounds >= 10
- NFR10: Sessao autenticada — todas as rotas exceto login/cadastro protegidas
- NFR11: Validacao server-side — todos os campos validados com zod antes de persistir
- NFR12: Sem exposicao de dados sensiveis — senhas e tokens nunca retornados em responses

**Accessibility**
- NFR13: Contraste WCAG AA — ratio >= 4.5:1 em texto, >= 3:1 em elementos grandes
- NFR14: Semantic HTML — elementos corretos (button, nav, main, heading hierarchy)
- NFR15: Focus visible — outline visivel em navegacao por teclado
- NFR16: Touch targets — minimo 48x48px em todos os interativos
- NFR17: Reduced motion — respeitar prefers-reduced-motion para animacoes

### Additional Requirements

**Da Arquitetura:**
- Starter template: Projeto ja inicializado com create-next-app (Next.js 16, TypeScript, Tailwind, ESLint, shadcn/ui, Prisma). Primeiro story deve configurar schema Prisma, CSS variables de tema e layout base — nao inicializar o projeto.
- Schema Prisma com 3 tabelas: User, Category, Transaction (schema completo definido no architecture.md)
- Autenticacao via JWT em httpOnly cookie, usando jose (edge-compatible) para middleware Next.js
- Server Actions para todas as mutations (sem API Routes)
- Server Components por padrao, Client Components apenas onde necessario
- Formato de resposta padrao: { success: boolean, data?: T, error?: string }
- Prisma Client singleton em src/lib/db.ts
- Dynamic imports para bottom sheet e teclado numerico (bundle optimization)
- Organizacao de componentes flat por tipo (nao nested por feature)
- Rotas: (auth)/login, (auth)/register, (app)/, (app)/transactions, (app)/profile
- Sequencia de implementacao recomendada: Schema+migrations → Auth → Layout base → Dashboard → Bottom sheet+FAB → Transacoes → Perfil → Polish

**Da UX Design:**
- Dark mode como padrao (zinc-950 background, emerald-500 primary)
- Semaforo de saldo: verde (>40% renda), amarelo (10-40%), vermelho (<10%)
- 7 categorias pre-definidas com cores individuais: Alimentacao (orange), Transporte (blue), Moradia (violet), Lazer (pink), Saude (red), Educacao (cyan), Outros (gray)
- Bottom sheet com teclado numerico customizado (grid 3x4), abas Despesa/Receita, grid de categorias, descricao opcional
- FAB 56x56px emerald-500, posicao fixed bottom-right acima da bottom nav
- Bottom nav com 3 abas (Home, Transacoes, Perfil), dot verde ativo, height 64px + safe-area
- Hero card com counter animation (500ms spring), toggle olho para ocultar valores, borda-left cor do semaforo
- Swipe-to-delete em transacoes com toast undo (3s)
- Container max-width 428px mobile, centralizado no desktop
- Skeleton loading com pulso zinc-700/zinc-800 em todos os cards
- Toast Sonner para toda confirmacao/erro, posicao bottom-center, dark style
- Responsive: mobile-first, md (768px), lg (1024px)
- WCAG 2.1 AA compliance, focus trap no bottom sheet, aria-labels descritivos
- Tipografia Inter, type scale de caption (12px) a display (36px)

### FR Coverage Map

| FR | Epic | Descricao |
|----|------|-----------|
| FR1 | Epic 1 | Criar conta com email e senha |
| FR2 | Epic 1 | Login com email e senha |
| FR3 | Epic 1 | Logout da sessao |
| FR4 | Epic 1 | Informar renda no onboarding |
| FR5 | Epic 1 | Categorias pre-definidas automaticas |
| FR6 | Epic 2 | Visualizar saldo atual |
| FR7 | Epic 2 | Ocultar/exibir valores |
| FR8 | Epic 2 | Semaforo de saude financeira |
| FR9 | Epic 2 | Resumo receitas vs despesas |
| FR10 | Epic 2 | Ultimas transacoes na home |
| FR11 | Epic 2 | Acoes rapidas no dashboard |
| FR12 | Epic 3 | Registrar despesa |
| FR13 | Epic 3 | Registrar receita |
| FR14 | Epic 3 | Descricao opcional |
| FR15 | Epic 3 | Selecionar categoria visual |
| FR16 | Epic 3 | Confirmacao visual (toast) |
| FR17 | Epic 3 | Registro de qualquer tela (FAB) |
| FR18 | Epic 4 | Lista completa de transacoes |
| FR19 | Epic 4 | Filtrar por periodo |
| FR20 | Epic 4 | Total consolidado do periodo |
| FR21 | Epic 4 | Excluir transacao |
| FR22 | Epic 4 | Desfazer exclusao |
| FR23 | Epic 5 | Perfil com avatar iniciais |
| FR24 | Epic 5 | Toggle tema escuro/claro |
| FR25 | Epic 5 | Configuracoes do perfil |
| FR26 | Epic 2 | Navegacao entre secoes |
| FR27 | Epic 2 | Indicador de secao ativa |
| FR28 | Epic 2 | Estados de carregamento (skeleton) |
| FR29 | Epic 2 | Animacoes de transicao |
| FR30 | Epic 2 | Saudacao personalizada |

## Epic List

### Epic 1: Fundacao e Autenticacao
O usuario pode criar uma conta, fazer login, configurar sua renda mensal e ter categorias prontas — tudo pronto para comecar a usar o app.
**FRs cobertos:** FR1, FR2, FR3, FR4, FR5

### Epic 2: Dashboard e Visualizacao Financeira
O usuario pode ver seu saldo com semaforo de cores, resumo de receitas vs despesas, ultimas transacoes e saudacao personalizada — entende sua situacao financeira num olhar.
**FRs cobertos:** FR6, FR7, FR8, FR9, FR10, FR11, FR26, FR27, FR28, FR29, FR30

### Epic 3: Registro de Transacoes
O usuario pode registrar despesas e receitas em menos de 10 segundos via bottom sheet com teclado numerico, categorias coloridas e confirmacao visual — o core loop do app.
**FRs cobertos:** FR12, FR13, FR14, FR15, FR16, FR17

### Epic 4: Historico e Gestao de Transacoes
O usuario pode visualizar todas as transacoes, filtrar por periodo, ver o total consolidado, deletar com swipe e desfazer — controle completo sobre seus registros.
**FRs cobertos:** FR18, FR19, FR20, FR21, FR22

### Epic 5: Perfil e Personalizacao
O usuario pode ver seu perfil com avatar de iniciais, alternar entre tema escuro e claro, e acessar configuracoes — experiencia completa e personalizavel.
**FRs cobertos:** FR23, FR24, FR25

---

## Epic 1: Fundacao e Autenticacao

O usuario pode criar uma conta, fazer login, configurar sua renda mensal e ter categorias prontas — tudo pronto para comecar a usar o app.

### Story 1.1: Configuracao do Schema de Banco de Dados e Tema Visual

As a desenvolvedor,
I want configurar o schema Prisma com as tabelas User e Category, o Prisma Client singleton, as CSS variables do tema dark/light e os tipos base do projeto,
So that a fundacao tecnica esteja pronta para implementar autenticacao e funcionalidades.

**Acceptance Criteria:**

**Given** o projeto Next.js ja inicializado com Prisma instalado
**When** o schema Prisma for configurado
**Then** as tabelas User e Category existem com todos os campos definidos na arquitetura (id cuid, email unique, password, name, monthlyIncome para User; id cuid, name, icon, color, userId para Category com unique constraint [userId, name])
**And** o Prisma Client singleton esta configurado em src/lib/db.ts
**And** a migration inicial foi executada com sucesso

**Given** o arquivo globals.css
**When** as CSS variables de tema forem configuradas
**Then** o tema dark (padrao) usa zinc-950 como background, zinc-800 como card, emerald-500 como primary
**And** o tema light usa white como background, zinc-100 como card, emerald-600 como primary
**And** todas as combinacoes de cor atingem WCAG AA (>= 4.5:1 texto)

**Given** a necessidade de tipos compartilhados
**When** os tipos base forem criados
**Then** existe ActionResponse<T> em src/types/index.ts com { success: boolean, data?: T, error?: string }
**And** existe o tipo Session com userId e outros campos necessarios

**Given** a necessidade de utilitarios
**When** os utilitarios base forem criados
**Then** existe formatCurrency em src/lib/format.ts usando Intl.NumberFormat pt-BR
**And** existe formatDate e formatDateTime em src/lib/date.ts
**And** existe cn() helper em src/lib/utils.ts
**And** existe DEFAULT_CATEGORIES em src/lib/constants.ts com as 7 categorias (Alimentacao/orange, Transporte/blue, Moradia/violet, Lazer/pink, Saude/red, Educacao/cyan, Outros/gray)

### Story 1.2: Cadastro de Usuario com Onboarding

As a novo usuario,
I want criar minha conta com email e senha e informar minha renda mensal,
So that eu tenha acesso ao app com minhas categorias prontas para usar.

**Acceptance Criteria:**

**Given** o usuario esta na tela de cadastro (/register)
**When** ele preenche email, senha, nome e submete o formulario
**Then** o sistema valida os campos com zod (email valido, senha min 6 chars, nome obrigatorio)
**And** a senha e armazenada com hash bcryptjs (salt rounds >= 10)
**And** o usuario e criado no banco de dados
**And** NFR9, NFR11 sao atendidos

**Given** o usuario acabou de criar a conta
**When** a tela de onboarding e exibida pedindo a renda mensal
**Then** o usuario pode digitar sua renda mensal
**And** ao confirmar, o campo monthlyIncome e salvo no User
**And** as 7 categorias pre-definidas sao criadas automaticamente para o usuario (FR5)
**And** um JWT e gerado e salvo em httpOnly cookie
**And** o usuario e redirecionado para o dashboard (/)

**Given** o formulario de cadastro com dados invalidos
**When** o usuario submete email ja cadastrado ou campos vazios
**Then** mensagens de erro aparecem inline abaixo dos campos
**And** nenhum dado e salvo no banco
**And** senhas nunca sao retornadas em responses (NFR12)

**Given** a tela de cadastro
**When** renderizada
**Then** usa layout (auth) centralizado, sem nav
**And** estilo dark com inputs zinc-800, border zinc-700, focus ring emerald-500
**And** botao primary "Criar conta" emerald-500, h-12, touch target >= 48px (NFR16)
**And** link "Ja tenho conta" para /login

### Story 1.3: Login de Usuario

As a usuario existente,
I want fazer login com meu email e senha,
So that eu acesse meus dados financeiros de forma segura.

**Acceptance Criteria:**

**Given** o usuario esta na tela de login (/login)
**When** ele preenche email e senha validos e submete
**Then** o sistema valida com zod, busca o usuario, compara o hash da senha com bcryptjs
**And** um JWT e gerado com jose (edge-compatible) e salvo em httpOnly cookie
**And** o usuario e redirecionado para o dashboard (/)

**Given** email ou senha incorretos
**When** o usuario submete o formulario
**Then** uma mensagem generica "Email ou senha incorretos" e exibida (sem revelar qual esta errado)
**And** nenhum JWT e gerado

**Given** a tela de login
**When** renderizada
**Then** usa layout (auth) centralizado, dark mode
**And** campos email e senha com toggle show/hide no campo de senha
**And** botao primary "Entrar" emerald-500
**And** link "Criar conta" para /register

### Story 1.4: Middleware de Autenticacao e Logout

As a usuario autenticado,
I want que minhas rotas sejam protegidas e poder fazer logout,
So that meus dados financeiros estejam seguros e eu controle minha sessao.

**Acceptance Criteria:**

**Given** um usuario nao autenticado (sem JWT cookie valido)
**When** ele tenta acessar qualquer rota do grupo (app) (/, /transactions, /profile)
**Then** o middleware Next.js intercepta a request
**And** redireciona para /login
**And** NFR10 e atendido

**Given** um usuario autenticado (JWT cookie valido)
**When** ele acessa rotas do grupo (app)
**Then** o middleware permite o acesso
**And** o userId e extraido do JWT para uso nos Server Components

**Given** um usuario autenticado em qualquer tela do app
**When** ele clica em "Sair" (logout)
**Then** o cookie JWT e limpo via Server Action
**And** o usuario e redirecionado para /login

**Given** a funcao getSession em src/lib/auth.ts
**When** chamada em Server Components ou Server Actions
**Then** retorna o objeto Session com userId, name, email, monthlyIncome
**And** retorna null se o JWT for invalido ou ausente

---

## Epic 2: Dashboard e Visualizacao Financeira

O usuario pode ver seu saldo com semaforo de cores, resumo de receitas vs despesas, ultimas transacoes e saudacao personalizada — entende sua situacao financeira num olhar.

### Story 2.1: Layout do App com Bottom Navigation

As a usuario autenticado,
I want navegar entre as secoes do app com uma barra de navegacao fixa na parte inferior,
So that eu acesse rapidamente Home, Transacoes e Perfil com uma mao.

**Acceptance Criteria:**

**Given** o usuario esta autenticado e acessa qualquer rota do grupo (app)
**When** a pagina e renderizada
**Then** o layout (app) exibe uma bottom navigation bar fixa na parte inferior
**And** a nav tem 3 abas: Home (icone house), Transacoes (icone list), Perfil (icone user)
**And** a aba ativa tem icone emerald-500 com dot 4px emerald-500 abaixo (FR27)
**And** as abas inativas tem icone zinc-500
**And** a nav tem height 64px + env(safe-area-inset-bottom) para iOS
**And** background zinc-900 com border-top zinc-800

**Given** o usuario toca em uma aba da bottom nav
**When** a navegacao ocorre
**Then** a tela correspondente e carregada via client-side navigation (sem reload)
**And** a aba ativa atualiza visualmente (FR26)

**Given** o layout do app
**When** renderizado em mobile
**Then** o container tem max-width 428px, centralizado, padding horizontal 24px
**And** o conteudo e scrollable com padding-bottom suficiente para nao ficar atras da nav
**And** semantic HTML: nav com aria-label="Navegacao principal" (NFR14)
**And** touch targets >= 48px em todas as abas (NFR16)

**Given** o layout do app
**When** renderizado em desktop (lg: 1024px+)
**Then** o container permanece max-width 428px centralizado na tela
**And** o fundo zinc-950 preenche o restante da tela

### Story 2.2: Dashboard com Hero Card e Saldo

As a usuario autenticado,
I want ver meu saldo atual com indicador visual de saude financeira no dashboard,
So that eu entenda minha situacao financeira num olhar.

**Acceptance Criteria:**

**Given** o usuario acessa o dashboard (/)
**When** a pagina carrega
**Then** o header exibe "Ola, {nome}" como saudacao personalizada (FR30)
**And** o header tem icone de olho para ocultar/exibir valores (FR7)

**Given** o dashboard carregou
**When** o hero card e exibido
**Then** mostra o label "Saldo atual" em body-sm zinc-400
**And** mostra o valor do saldo (receitas - despesas do mes) em display bold com counter animation de 0 ao valor em ~500ms spring (FR6, NFR8)
**And** o hero card tem borda-left 4px com cor do semaforo:
  - Verde (#10b981) se saldo > 40% da renda mensal
  - Amarelo (#f59e0b) se saldo entre 10-40% da renda
  - Vermelho (#ef4444) se saldo < 10% da renda (FR8)
**And** abaixo do saldo mostra "Receitas R$X | Despesas R$X" em caption (FR9)
**And** o card tem background zinc-800, rounded-2xl, shadow-lg

**Given** o usuario toca no icone de olho
**When** os valores sao ocultados
**Then** todos os valores monetarios viram "R$ ••••••" com fade transition
**And** o estado persiste na sessao (nao entre sessoes)

**Given** o dashboard com dados
**When** a secao de ultimas transacoes e exibida
**Then** mostra as 5 ultimas transacoes registradas (FR10)
**And** cada transacao mostra avatar de categoria (circulo colorido + emoji), nome da categoria, valor formatado
**And** transacoes aparecem com animacao fade+slide (FR29)
**And** se nao houver transacoes, mostra empty state "Registre sua primeira transacao"

**Given** o dashboard
**When** esta carregando dados
**Then** exibe skeleton loading com pulso zinc-700/zinc-800 nos formatos dos cards (FR28)
**And** skeleton tem o formato exato do conteudo final (hero card shape, transaction rows)
**And** transicao skeleton → conteudo com fade 200ms

**Given** o dashboard com acoes rapidas
**When** a secao e exibida
**Then** mostra botoes/atalhos para acoes rapidas de registro (FR11)
**And** os atalhos sao acessiveis na zona do polegar

### Story 2.3: Componente de Counter Animation

As a usuario,
I want ver os valores monetarios animando de 0 ate o valor real,
So that a experiencia visual seja premium e impressionante.

**Acceptance Criteria:**

**Given** um componente AnimatedCounter recebe um valor numerico
**When** o componente e renderizado ou o valor muda
**Then** o numero anima de 0 (ou valor anterior) ate o valor real em ~500ms com easing spring (NFR8)
**And** o valor e formatado como moeda BRL durante a animacao (R$ X.XXX,XX)
**And** usa font-variant-numeric: tabular-nums para alinhamento

**Given** o usuario tem prefers-reduced-motion ativado
**When** o counter e renderizado
**Then** o valor aparece instantaneamente sem animacao (NFR17)

**Given** o componente AnimatedCounter
**When** implementado
**Then** usa Framer Motion com "use client"
**And** a animacao roda a 60fps sem jank (NFR6)
**And** e reutilizavel em qualquer lugar que exiba valores monetarios

---

## Epic 3: Registro de Transacoes

O usuario pode registrar despesas e receitas em menos de 10 segundos via bottom sheet com teclado numerico, categorias coloridas e confirmacao visual — o core loop do app.

### Story 3.1: FAB e Bottom Sheet de Registro

As a usuario,
I want tocar no botao "+" flutuante e ver um bottom sheet para registrar uma transacao,
So that eu possa iniciar o registro de qualquer tela do app de forma rapida.

**Acceptance Criteria:**

**Given** o usuario esta em qualquer tela do grupo (app)
**When** a tela e renderizada
**Then** um FAB (Floating Action Button) "+" e exibido no canto inferior direito, acima da bottom nav (FR17)
**And** o FAB tem 56x56px, background emerald-500, icone "+" branco, shadow-lg com emerald-500/20
**And** aria-label="Adicionar nova transacao"
**And** z-index 50

**Given** o usuario toca no FAB
**When** o bottom sheet e aberto
**Then** o bottom sheet sobe com animacao slide-up 300ms ease-out (Framer Motion)
**And** backdrop zinc-950/80 aparece atras
**And** o bottom sheet ocupa ~85% da tela
**And** tem drag handle (barra zinc-600, 40x4px, rounded) no topo
**And** role="dialog", aria-modal="true"
**And** focus trap e ativado dentro do bottom sheet

**Given** o bottom sheet esta aberto
**When** o usuario arrasta para baixo, toca no backdrop ou pressiona Escape
**Then** o bottom sheet fecha com animacao slide-down 300ms ease-in
**And** focus retorna ao FAB
**And** o FAB volta a ficar visivel

**Given** o bottom sheet
**When** implementado
**Then** usa dynamic import para otimizacao de bundle (NFR5)
**And** o FAB desabilita (zinc-600) enquanto o bottom sheet esta aberto

### Story 3.2: Teclado Numerico e Selecao de Categoria

As a usuario,
I want digitar o valor no teclado numerico dark e selecionar uma categoria colorida,
So that eu registre o valor e a categoria da transacao de forma rapida e visual.

**Acceptance Criteria:**

**Given** o bottom sheet esta aberto
**When** o conteudo e renderizado
**Then** mostra abas "Despesa" e "Receita" no topo (Despesa ativa por padrao)
**And** aba ativa tem texto emerald-500 com underline, inativa zinc-400
**And** display de valor mostra "R$ 0,00" inicialmente (text-3xl, branco se despesa, emerald-500 se receita)

**Given** o teclado numerico e exibido
**When** o usuario toca nos botoes
**Then** o grid 3x4 tem botoes: [1][2][3] [4][5][6] [7][8][9] [,][0][backspace]
**And** cada botao tem 64x48px, background zinc-800, texto zinc-50, rounded-xl
**And** feedback de press: scale(0.95) + background zinc-700
**And** o valor e auto-formatado como moeda (R$ 1.234,56) no display
**And** backspace remove ultimo digito, long-press limpa tudo

**Given** o grid de categorias e exibido abaixo do teclado
**When** o usuario visualiza as categorias
**Then** mostra as 7 categorias em grid responsivo (4 colunas)
**And** cada item tem circulo 56x56px com cor da categoria (opacity 20% bg + icone solid)
**And** emoji da categoria (24px) + label abaixo (caption, zinc-400)
**And** role="radiogroup", cada item role="radio" (FR15)

**Given** o usuario toca em uma categoria
**When** a categoria e selecionada
**Then** a categoria selecionada tem ring emerald-500 (2px) + scale(1.05)
**And** touch targets >= 48px com espacamento minimo 8px entre items (NFR16)

**Given** um campo de descricao opcional
**When** exibido abaixo das categorias
**Then** mostra placeholder "Adicionar nota..." em zinc-600 discreto (FR14)
**And** o campo e collapsed por default, expande ao tocar

### Story 3.3: Submissao de Transacao e Feedback

As a usuario,
I want confirmar o registro da transacao e receber feedback visual,
So that eu saiba que a transacao foi salva com sucesso e veja o impacto no dashboard.

**Acceptance Criteria:**

**Given** o usuario digitou um valor > 0 e selecionou uma categoria
**When** ele toca no botao "Registrar" (emerald-500, full-width, h-12)
**Then** o Server Action createTransaction e chamado com: amount, type (income/expense), categoryId, description opcional
**And** a validacao zod server-side confirma todos os campos (NFR11)
**And** a transacao e criada no banco com o userId da sessao
**And** revalidatePath("/") e revalidatePath("/transactions") sao chamados

**Given** a transacao foi salva com sucesso
**When** o feedback e exibido
**Then** o botao pulsa (scale 0.95 → 1.0, 100ms)
**And** o bottom sheet desce com animacao (300ms ease-in) (FR16)
**And** toast Sonner aparece: "Transacao salva" com icone checkmark emerald-500
**And** toast dark style (zinc-800 bg, zinc-50 text), posicao bottom-center, duracao 3s
**And** o dashboard atualiza automaticamente (hero card recalcula saldo com counter, semaforo ajusta cor, nova transacao aparece com slide-in)

**Given** o usuario nao preencheu valor ou nao selecionou categoria
**When** ele toca em "Registrar"
**Then** o botao nao submete (disabled state)
**And** campos faltantes sao indicados visualmente

**Given** um erro no servidor ao salvar
**When** o Server Action retorna { success: false, error: "..." }
**Then** toast.error exibe a mensagem de erro
**And** o bottom sheet permanece aberto para o usuario corrigir

**Given** a tabela Transaction no banco
**When** uma transacao e criada
**Then** o schema tem: id (cuid), amount (float), type ("income"/"expense"), description (string?), categoryId, userId, createdAt
**And** indices em [userId, createdAt] e [userId, type] existem para queries eficientes

---

## Epic 4: Historico e Gestao de Transacoes

O usuario pode visualizar todas as transacoes, filtrar por periodo, ver o total consolidado, deletar com swipe e desfazer — controle completo sobre seus registros.

### Story 4.1: Tela de Transacoes com Lista e Filtros

As a usuario,
I want ver todas as minhas transacoes em uma lista e filtrar por periodo,
So that eu saiba exatamente onde gastei meu dinheiro.

**Acceptance Criteria:**

**Given** o usuario navega para a tela de Transacoes (/transactions)
**When** a pagina carrega (Server Component)
**Then** exibe a lista completa de transacoes do mes atual (FR18)
**And** cada transacao mostra: avatar de categoria (circulo colorido 40x40px + emoji), nome da categoria, descricao ou data (body-sm, zinc-400), valor formatado (bold, emerald-500 se receita, zinc-50 se despesa com "- R$" prefix)
**And** transacoes ordenadas por data decrescente (mais recente primeiro)
**And** transacoes aparecem com animacao fade + translateY (FR29)

**Given** os filter pills sao exibidos no topo
**When** o usuario toca em um pill (Hoje/Semana/Mes)
**Then** o pill ativo tem background emerald-500, texto white (FR19)
**And** pills inativos tem background zinc-800, texto zinc-400
**And** a lista filtra para mostrar apenas transacoes do periodo selecionado
**And** "Mes" e o filtro padrao ativo

**Given** um filtro esta ativo
**When** a lista e exibida
**Then** um resumo flutuante no topo mostra o total consolidado do periodo (FR20)
**And** formato: "Total: R$ X.XXX,XX" com receitas e despesas separadas

**Given** a tela de transacoes
**When** nao existem transacoes no periodo filtrado
**Then** mostra empty state "Sem transacoes neste periodo" com icone
**And** sugestao de outro filtro

**Given** a tela esta carregando
**When** os dados estao sendo buscados
**Then** exibe skeleton loading com formato de transaction rows (FR28)

### Story 4.2: Exclusao de Transacao com Swipe e Undo

As a usuario,
I want excluir uma transacao deslizando para a esquerda e ter a opcao de desfazer,
So that eu possa corrigir erros rapidamente sem medo de perder dados.

**Acceptance Criteria:**

**Given** o usuario esta na lista de transacoes
**When** ele faz swipe para a esquerda em uma transacao
**Then** um botao "Excluir" com background red-500 e revelado (FR21)
**And** a animacao de swipe e suave e responsiva

**Given** o botao "Excluir" esta visivel
**When** o usuario toca no botao
**Then** o Server Action deleteTransaction e chamado com o id da transacao
**And** a transacao e removida do banco (delete real, nao soft delete)
**And** revalidatePath("/") e revalidatePath("/transactions") sao chamados
**And** a transacao desaparece da lista com animacao

**Given** a transacao foi excluida
**When** o toast de feedback aparece
**Then** mostra "Transacao excluida" com botao "Desfazer" (FR22)
**And** duracao do toast: 3 segundos
**And** dark style (zinc-800 bg)

**Given** o usuario toca em "Desfazer" dentro dos 3 segundos
**When** a acao de undo e executada
**Then** a transacao e recriada com os mesmos dados (createTransaction com mesmos valores)
**And** a lista atualiza e a transacao reaparece
**And** o dashboard e revalidado

**Given** o usuario nao toca em "Desfazer"
**When** os 3 segundos expiram
**Then** o toast desaparece
**And** a exclusao e permanente

---

## Epic 5: Perfil e Personalizacao

O usuario pode ver seu perfil com avatar de iniciais, alternar entre tema escuro e claro, e acessar configuracoes — experiencia completa e personalizavel.

### Story 5.1: Tela de Perfil com Avatar e Informacoes

As a usuario,
I want ver meu perfil com avatar de iniciais e minhas informacoes,
So that eu tenha identidade visual no app e acesse configuracoes.

**Acceptance Criteria:**

**Given** o usuario navega para a tela de Perfil (/profile)
**When** a pagina carrega (Server Component)
**Then** exibe avatar com iniciais do nome do usuario (circulo emerald-500 + iniciais brancas, tamanho grande) (FR23)
**And** nome do usuario abaixo do avatar
**And** email do usuario em zinc-400

**Given** a tela de perfil
**When** as opcoes de configuracao sao exibidas
**Then** mostra menu em cards (zinc-800, rounded-2xl) com opcoes: (FR25)
  - Toggle tema escuro/claro
  - Informacoes da conta
  - Sair (logout)
**And** cada card tem touch target >= 48px (NFR16)
**And** semantic HTML com heading hierarchy (NFR14)

**Given** o usuario toca em "Sair"
**When** a acao de logout e executada
**Then** o cookie JWT e limpo
**And** o usuario e redirecionado para /login (FR3)

### Story 5.2: Toggle de Tema Escuro e Claro

As a usuario,
I want alternar entre tema escuro e claro,
So that eu personalize a aparencia do app conforme minha preferencia.

**Acceptance Criteria:**

**Given** o usuario esta na tela de perfil
**When** ele toca no toggle de tema
**Then** o tema alterna entre dark e light instantaneamente (FR24)
**And** dark mode: zinc-950 background, zinc-800 cards, emerald-500 primary
**And** light mode: white background, zinc-100 cards, emerald-600 primary
**And** a transicao usa crossfade suave

**Given** o usuario alterou o tema
**When** ele navega entre telas
**Then** o tema persiste em localStorage
**And** o tema e aplicado via class toggle no elemento html
**And** ao reabrir o app, o tema salvo e restaurado

**Given** o toggle de tema
**When** implementado
**Then** usa Switch do shadcn/ui (track zinc-700, thumb emerald-500)
**And** o componente e "use client" (ThemeToggle)
**And** todas as combinacoes de cor em ambos os temas atingem WCAG AA (NFR13)
**And** prefers-color-scheme do sistema e respeitado como padrao inicial (dark se nao houver preferencia salva)
