---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments: ['prd.md', 'architecture.md', 'ux-design-specification.md']
status: complete
completedAt: '2026-02-26'
---

# MeuDinheiro - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for MeuDinheiro, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitante pode criar uma conta com nome, email e senha
FR2: Usuário pode fazer login com email e senha
FR3: Usuário autenticado pode fazer logout
FR4: Sistema mantém sessão ativa entre visitas (cookies httpOnly persistentes)
FR5: Usuário não autenticado é redirecionado para login ao acessar páginas protegidas
FR6: Usuário pode registrar uma transação informando tipo (receita ou despesa), valor, categoria, data e descrição opcional
FR7: Usuário pode visualizar a lista das suas transações
FR8: Usuário pode excluir uma transação existente
FR9: Sistema filtra as categorias disponíveis conforme o tipo de transação selecionado
FR10: Sistema valida campos obrigatórios antes de salvar e exibe erros sem perder dados preenchidos
FR11: Sistema disponibiliza categorias fixas de receita: Salário, Freelance, Outros
FR12: Sistema disponibiliza categorias fixas de despesa: Alimentação, Transporte, Moradia, Saúde, Lazer, Outros
FR13: Usuário visualiza saldo atual do mês (receitas − despesas do mês corrente)
FR14: Usuário visualiza total de receitas do mês corrente
FR15: Usuário visualiza total de despesas do mês corrente
FR16: Usuário visualiza lista das últimas 5 transações registradas
FR17: Dashboard reflete estado atualizado imediatamente após criação ou exclusão de transação, sem reload
FR18: Sistema exibe feedback visual animado ao registrar transação com sucesso
FR19: Sistema exibe toast ao excluir transação
FR20: Sistema exibe erros de validação inline sem perder dados do formulário
FR21: Navegação entre páginas ocorre com transições animadas

### NonFunctional Requirements

NFR1: Time to Interactive < 2s em conexão padrão
NFR2: Resposta a ações do usuário (criar/excluir/navegar) < 300ms
NFR3: Animações e transições a 60fps — zero frames dropados visíveis
NFR4: Atualização do dashboard após operação < 100ms
NFR5: Senhas armazenadas com hash bcrypt — nunca em texto plano
NFR6: Sessão via cookies httpOnly e secure — inacessível via JavaScript
NFR7: Isolamento por userId em todas as queries — cada usuário acessa apenas seus dados
NFR8: Autenticação verificada no servidor em rotas protegidas
NFR9: Contraste WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande; labels semânticos em todos os inputs; foco visível via teclado; erros e toasts via aria-live
NFR10: Desktop 1280px+ como alvo principal, tablet 768px+ funcional

### Additional Requirements

- STARTER TEMPLATE: Projeto inicializado com `create-next-app@latest` com flags: --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack — impacta Epic 1 Story 1
- Dependências obrigatórias: shadcn/ui, Prisma 7.2.0 + SQLite, bcryptjs 3.0.3, Framer Motion, Sonner, react-hook-form + @hookform/resolvers + Zod
- Schema Prisma completo definido (models: User, Session, Transaction) com índices e relações
- Middleware de autenticação (src/middleware.ts) protege todas as rotas não-públicas; redireciona para /login se não autenticado
- Server Actions para mutations (createTransaction, deleteTransaction) com revalidatePath('/dashboard')
- API Routes para autenticação (/api/auth/register, /api/auth/login, /api/auth/logout)
- Variáveis de ambiente: DATABASE_URL e SESSION_SECRET em .env.local (nunca commitado), .env.example commitado como referência
- Paleta de cores UX: verde #16A34A, azul #2563EB, dourado #F59E0B
- Animações com Framer Motion: AnimatePresence para lista de transações, useSpring para números nos cards do dashboard
- Modal de nova transação com animação de entrada/saída
- Toast via Sonner configurado no root layout como <Toaster />
- Validação inline via react-hook-form sem perda de dados do formulário
- Estrutura de diretórios definida: src/app/(auth)/, src/app/(app)/dashboard/, src/actions/, src/components/auth/, src/components/dashboard/, src/components/transactions/, src/lib/

### FR Coverage Map

FR1: Epic 2 — Cadastro com nome, email e senha
FR2: Epic 2 — Login com email e senha
FR3: Epic 2 — Logout
FR4: Epic 2 — Sessão persistente com cookies httpOnly
FR5: Epic 2 — Redirecionamento para login em rotas protegidas
FR6: Epic 3 — Registrar transação (tipo, valor, categoria, data, descrição)
FR7: Epic 3 — Visualizar lista de transações
FR8: Epic 3 — Excluir transação
FR9: Epic 3 — Filtrar categorias por tipo de transação
FR10: Epic 3 — Validação de campos obrigatórios inline
FR11: Epic 3 — Categorias fixas de receita
FR12: Epic 3 — Categorias fixas de despesa
FR13: Epic 4 — Saldo atual do mês
FR14: Epic 4 — Total de receitas do mês
FR15: Epic 4 — Total de despesas do mês
FR16: Epic 4 — Lista das últimas 5 transações
FR17: Epic 4 — Dashboard atualiza sem reload após operações
FR18: Epic 3 — Feedback animado ao registrar transação
FR19: Epic 3 — Toast ao excluir transação
FR20: Epic 3 — Erros de validação inline sem perder dados
FR21: Epic 4 — Transições animadas de navegação

## Epic List

### Epic 1: Fundação do Projeto e Infraestrutura
Após este épico, o projeto existe com toda a infraestrutura configurada e pronta para receber funcionalidades — stack completa instalada, banco de dados inicializado com schema, estrutura de pastas criada conforme arquitetura, variáveis de ambiente configuradas e aplicação rodando localmente.
**FRs cobertos:** Requisitos de Arquitetura (starter template, Prisma schema, dependências, estrutura de diretórios)

### Epic 2: Autenticação e Sessão de Usuário
Após este épico, o usuário pode criar conta, fazer login com email e senha, manter sessão ativa entre visitas via cookies httpOnly, e fazer logout — o middleware protege todas as rotas autenticadas e redireciona usuários não autenticados para o login.
**FRs cobertos:** FR1, FR2, FR3, FR4, FR5

### Epic 3: Gestão de Transações
Após este épico, o usuário pode registrar receitas e despesas com tipo, valor, categoria, data e descrição opcional — pode visualizar a lista de transações e excluir registros. O formulário valida inline sem perder dados, categorias são filtradas por tipo, e ações fornecem feedback animado e toasts.
**FRs cobertos:** FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR18, FR19, FR20

### Epic 4: Dashboard Financeiro e Experiência Visual
Após este épico, o usuário tem visão completa do seu estado financeiro mensal — saldo atual, total de receitas e despesas em cards reativos com animações de número, lista das últimas 5 transações, tudo atualizado instantaneamente após cada operação sem reload, com transições animadas de navegação.
**FRs cobertos:** FR13, FR14, FR15, FR16, FR17, FR21

---

## Epic 1: Fundação do Projeto e Infraestrutura

Após este épico, o projeto existe com toda a infraestrutura configurada e pronta para receber funcionalidades — stack completa instalada, banco de dados inicializado com schema, estrutura de pastas criada conforme arquitetura, variáveis de ambiente configuradas e aplicação rodando localmente.

### Story 1.1: Inicialização do Projeto e Instalação de Dependências

Como desenvolvedor,
Quero criar o projeto Next.js com toda a stack de dependências instalada e configurada,
Para ter a base tecnológica pronta para receber a implementação das funcionalidades.

**Acceptance Criteria:**

**Given** o ambiente de desenvolvimento está preparado com Node.js e npm disponíveis
**When** executo o comando `create-next-app@latest`
**Then** o projeto é criado com TypeScript, Tailwind CSS, ESLint, App Router, diretório `src/`, alias `@/*` e sem Turbopack

**Given** o projeto base foi criado
**When** instalo as dependências adicionais
**Then** shadcn/ui (com `npx shadcn@latest init`), Prisma 7.2.0 + @prisma/client, bcryptjs 3.0.3 + @types/bcryptjs, Framer Motion, Sonner, react-hook-form, @hookform/resolvers e Zod estão instalados sem conflitos

**Given** todas as dependências estão instaladas
**When** executo `npm run dev`
**Then** a aplicação sobe sem erros na porta 3000 e a página inicial do Next.js é acessível no browser

**Given** o shadcn/ui foi inicializado
**When** verifico `components.json`
**Then** o arquivo existe na raiz com a configuração gerada pelo `shadcn init`

### Story 1.2: Banco de Dados, Estrutura de Pastas e Variáveis de Ambiente

Como desenvolvedor,
Quero configurar o banco de dados, criar a estrutura de diretórios da arquitetura e configurar as variáveis de ambiente,
Para que o projeto esteja completamente scaffoldado e pronto para receber código de funcionalidades.

**Acceptance Criteria:**

**Given** o Prisma está instalado
**When** configuro e aplico o schema Prisma com SQLite
**Then** `prisma/schema.prisma` contém os models User, Session e Transaction exatamente conforme a arquitetura (com índices e relações), a migration inicial existe em `prisma/migrations/`, e `prisma/dev.db` é gerado com sucesso via `npx prisma migrate dev --name init`

**Given** o schema está migrado
**When** verifico a estrutura de diretórios em `src/`
**Then** as pastas existem: `app/(auth)/login/`, `app/(auth)/register/`, `app/(app)/dashboard/`, `actions/`, `components/auth/`, `components/dashboard/`, `components/transactions/`, `components/shared/`, `components/ui/`, `lib/`, `types/`

**Given** a estrutura de pastas está criada
**When** configuro as variáveis de ambiente
**Then** `.env.local` com `DATABASE_URL="file:./dev.db"` e `SESSION_SECRET` existe e não está commitado; `.env.example` com valores placeholder está commitado como referência; `.gitignore` inclui `.env.local` e `prisma/dev.db`

**Given** toda a configuração está feita
**When** executo `npm run dev`
**Then** a aplicação sobe sem erros e o Prisma Client conecta ao banco sem warnings

---

## Epic 2: Autenticação e Sessão de Usuário

Após este épico, o usuário pode criar conta, fazer login com email e senha, manter sessão ativa entre visitas via cookies httpOnly, e fazer logout — o middleware protege todas as rotas autenticadas e redireciona usuários não autenticados para o login.

### Story 2.1: Infraestrutura de Autenticação e Proteção de Rotas

Como desenvolvedor,
Quero implementar a camada de autenticação (lib/auth.ts, middleware e API routes),
Para que a base de sessões e proteção de rotas esteja pronta antes das interfaces de usuário.

**Acceptance Criteria:**

**Given** o banco de dados está inicializado com os models User e Session
**When** implemento `src/lib/auth.ts`
**Then** as funções `hashPassword`, `comparePassword`, `createSession`, `getSession` e `deleteSession` estão implementadas e exportadas

**Given** `lib/auth.ts` está implementado
**When** implemento as API Routes de autenticação
**Then** `POST /api/auth/register` aceita `{name, email, password}`, cria o User com hash bcrypt (saltRounds=12) e retorna `{success: true}` ou erro formatado; `POST /api/auth/login` valida credenciais e cria sessão com cookie `sessionId` (httpOnly, secure em prod, sameSite: lax, maxAge: 7 dias); `POST /api/auth/logout` deleta a sessão do banco e limpa o cookie

**Given** as API Routes estão implementadas
**When** implemento `src/middleware.ts`
**Then** rotas públicas `/login` e `/register` e `/api/auth/*` são acessíveis sem autenticação; qualquer outra rota redireciona para `/login` se não houver sessão válida; usuário autenticado acessando `/login` ou `/register` é redirecionado para `/dashboard`

**Given** o middleware está ativo
**When** acesso `/dashboard` sem cookie de sessão
**Then** sou redirecionado para `/login` pelo servidor (não pelo cliente)

**Given** o middleware está ativo
**When** acesso `/login` com sessão válida
**Then** sou redirecionado para `/dashboard`

### Story 2.2: Interface de Cadastro de Usuário

Como visitante,
Quero criar uma conta com nome, email e senha,
Para que eu possa acessar o MeuDinheiro e começar a registrar minhas transações.

**Acceptance Criteria:**

**Given** acesso `/register` sem estar autenticado
**When** a página carrega
**Then** exibo um formulário com campos: Nome, Email, Senha — com labels semânticos, foco visível e contraste WCAG AA

**Given** preencho nome, email e senha válidos e clico em "Criar conta"
**When** o formulário é submetido
**Then** a requisição vai para `POST /api/auth/register`, a conta é criada, a sessão é iniciada e sou redirecionado para `/dashboard`

**Given** tento criar conta com email já cadastrado
**When** submeto o formulário
**Then** erro inline é exibido informando que o email já está em uso, sem limpar os outros campos

**Given** submeto o formulário com campos obrigatórios vazios
**When** a validação é executada
**Then** erros inline aparecem em cada campo faltante sem recarregar a página

**Given** submeto o formulário com senha muito curta (menos de 8 caracteres)
**When** a validação é executada
**Then** erro inline informa o requisito mínimo de caracteres

**Given** a requisição está sendo processada
**When** aguardo a resposta
**Then** o botão de submit está desabilitado com texto indicando carregamento, impedindo duplo envio

### Story 2.3: Interface de Login e Logout

Como usuário cadastrado,
Quero fazer login com email e senha e poder sair da minha conta,
Para que meus dados sejam acessíveis apenas por mim.

**Acceptance Criteria:**

**Given** acesso `/login` sem estar autenticado
**When** a página carrega
**Then** exibo um formulário com campos Email e Senha, link para cadastro, labels semânticos e contraste WCAG AA

**Given** preencho email e senha corretos e submeto
**When** a autenticação é validada no servidor
**Then** sou redirecionado para `/dashboard` com sessão ativa e cookie httpOnly configurado

**Given** preencho email ou senha incorretos e submeto
**When** a validação falha no servidor
**Then** erro inline é exibido indicando "Email ou senha inválidos" sem revelar qual campo está errado

**Given** submeto o formulário com campos vazios
**When** a validação client-side executa
**Then** erros inline aparecem antes de qualquer requisição ao servidor

**Given** estou autenticado no dashboard
**When** clico em "Sair"
**Then** `POST /api/auth/logout` é chamado, o cookie é limpo, a sessão é deletada do banco e sou redirecionado para `/login`

**Given** faço logout e tento acessar `/dashboard` diretamente
**When** o middleware verifica a sessão
**Then** sou redirecionado para `/login` pois o cookie não existe mais

**Given** fecho o browser e reabro após menos de 7 dias
**When** acesso a URL do app
**Then** sou redirecionado automaticamente para `/dashboard` com sessão ainda ativa

---

## Epic 3: Gestão de Transações

Após este épico, o usuário pode registrar receitas e despesas com tipo, valor, categoria, data e descrição opcional — pode visualizar a lista de transações e excluir registros. O formulário valida inline sem perder dados, categorias são filtradas por tipo, e ações fornecem feedback animado e toasts.

### Story 3.1: Server Actions e Lógica de Transações

Como desenvolvedor,
Quero implementar as Server Actions de criação e exclusão de transações,
Para que a camada de dados esteja pronta antes das interfaces de usuário.

**Acceptance Criteria:**

**Given** o model Transaction existe no banco e `src/lib/auth.ts` está implementado
**When** implemento `src/actions/transactions.ts`
**Then** o arquivo tem `'use server'` no topo e exporta `createTransaction` e `deleteTransaction`

**Given** `createTransaction` é chamada com dados válidos de uma sessão autenticada
**When** a Server Action executa
**Then** valida os dados com Zod (`createTransactionSchema`), extrai `userId` da sessão (nunca do body), cria o registro no banco com todos os campos, chama `revalidatePath('/dashboard')` e retorna `{success: true}`

**Given** `createTransaction` é chamada sem sessão válida
**When** a Server Action executa
**Then** retorna `{success: false, error: 'Não autorizado'}` sem criar nenhum registro

**Given** `deleteTransaction` é chamada com um `transactionId` e sessão válida
**When** a Server Action executa
**Then** verifica que a transação pertence ao `userId` da sessão antes de deletar, deleta o registro, chama `revalidatePath('/dashboard')` e retorna `{success: true}`

**Given** `deleteTransaction` é chamada com ID de transação de outro usuário
**When** a Server Action executa
**Then** retorna `{success: false, error: 'Não autorizado'}` sem deletar nada

**Given** qualquer Server Action lança uma exceção inesperada
**When** o erro é capturado
**Then** `console.error` registra o erro, retorna `{success: false, error: 'Erro interno'}` sem expor detalhes ao cliente

**Given** o schema Zod `createTransactionSchema` é implementado
**When** verifico `src/lib/validations/transaction.ts`
**Then** o schema valida: `type` como `'income' | 'expense'`, `amount` como número positivo, `category` como string não vazia, `date` como string de data válida, `description` como string opcional

### Story 3.2: Formulário de Nova Transação

Como usuário autenticado,
Quero registrar uma nova transação informando tipo, valor, categoria e data,
Para que eu possa acompanhar minha vida financeira.

**Acceptance Criteria:**

**Given** estou no dashboard autenticado e clico em "Nova transação"
**When** o modal abre
**Then** aparece com animação suave (Framer Motion) contendo: seletor de tipo (Receita/Despesa), campo de valor, select de categoria, campo de data e campo de descrição opcional

**Given** seleciono "Receita" no seletor de tipo
**When** o select de categoria é renderizado
**Then** exibe apenas as categorias de receita: Salário, Freelance, Outros (FR11)

**Given** seleciono "Despesa" no seletor de tipo
**When** o select de categoria é renderizado
**Then** exibe apenas as categorias de despesa: Alimentação, Transporte, Moradia, Saúde, Lazer, Outros (FR12)

**Given** preencho todos os campos corretamente e clico em "Salvar"
**When** `createTransaction` é chamada
**Then** o modal fecha com animação de saída, feedback visual animado é exibido confirmando o sucesso (FR18), e o dashboard é atualizado sem reload

**Given** tento salvar sem preencher campos obrigatórios
**When** a validação react-hook-form executa
**Then** erros inline aparecem em cada campo faltante sem fechar o modal e sem perder os dados já digitados (FR20)

**Given** digito um valor inválido (texto, negativo, zero)
**When** a validação executa
**Then** erro inline aparece no campo de valor sem limpar os outros campos

**Given** o formulário está sendo submetido
**When** aguardo a resposta da Server Action
**Then** o botão "Salvar" fica desabilitado com estado de loading

**Given** a Server Action retorna erro
**When** processo a resposta
**Then** toast de erro é exibido via Sonner com mensagem descritiva, modal permanece aberto com dados preservados

### Story 3.3: Lista de Transações com Exclusão

Como usuário autenticado,
Quero visualizar minhas transações e poder excluir registros incorretos,
Para que meu histórico financeiro seja preciso.

**Acceptance Criteria:**

**Given** estou no dashboard autenticado
**When** a página carrega
**Then** vejo a lista das últimas transações com: data formatada (dd/mm/aaaa), tipo (ícone ou badge Receita/Despesa), categoria, valor formatado em BRL e botão de exclusão para cada item

**Given** há transações registradas
**When** visualizo a lista
**Then** cada transação exibe receitas em verde e despesas em vermelho/laranja para diferenciação visual imediata

**Given** clico no botão de excluir em uma transação
**When** `deleteTransaction` é chamada com sucesso
**Then** a transação é removida da lista com animação de saída (Framer Motion AnimatePresence), toast "Transação excluída" é exibido via Sonner (FR19), e os totais do dashboard atualizam sem reload

**Given** `deleteTransaction` retorna erro
**When** processo a resposta
**Then** toast de erro é exibido e a transação permanece na lista

**Given** não há transações registradas
**When** visualizo a lista
**Then** exibe mensagem amigável indicando que não há transações ainda, com CTA para adicionar a primeira

**Given** acesso o dashboard
**When** verifico isolamento de dados
**Then** apenas transações do meu userId são listadas (nunca de outros usuários)

---

## Epic 4: Dashboard Financeiro e Experiência Visual

Após este épico, o usuário tem visão completa do seu estado financeiro mensal — saldo atual, total de receitas e despesas em cards reativos com animações de número, lista das últimas 5 transações, tudo atualizado instantaneamente após cada operação sem reload, com transições animadas de navegação.

### Story 4.1: Dashboard com Cards Financeiros Reativos

Como usuário autenticado,
Quero ver meu saldo atual, total de receitas e despesas do mês em cards,
Para que eu entenda minha situação financeira instantaneamente ao abrir o app.

**Acceptance Criteria:**

**Given** acesso `/dashboard` autenticado
**When** a página carrega (Server Component)
**Then** os dados do mês corrente são buscados no servidor: soma de receitas, soma de despesas, saldo calculado (receitas − despesas), tudo filtrado pelo `userId` da sessão e pelo mês atual

**Given** os dados foram carregados
**When** os 3 cards são renderizados
**Then** Card 1 exibe "Saldo do Mês" com valor em BRL (FR13); Card 2 exibe "Receitas" com valor em verde (FR14); Card 3 exibe "Despesas" com valor em laranja/vermelho (FR15)

**Given** uma transação é criada ou excluída
**When** `revalidatePath('/dashboard')` é chamado pela Server Action
**Then** o Server Component re-renderiza com dados atualizados e os números dos cards atualizam sem reload de página (FR17)

**Given** os cards são Client Components com Framer Motion
**When** os números são atualizados
**Then** animação `useSpring` anima a transição numérica suavemente a 60fps (NFR3)

**Given** o dashboard carrega pela primeira vez
**When** os dados ainda estão sendo buscados
**Then** `loading.tsx` exibe Skeleton do shadcn/ui nos cards e lista como placeholder de carregamento

**Given** não há transações no mês
**When** os cards são renderizados
**Then** todos exibem R$ 0,00 sem erro

### Story 4.2: Lista das Últimas 5 Transações e Experiência Visual Completa

Como usuário autenticado,
Quero ver minhas 5 transações mais recentes no dashboard e navegar pelo app com transições fluidas,
Para ter visão imediata do histórico recente e uma experiência visualmente polida.

**Acceptance Criteria:**

**Given** acesso o dashboard autenticado
**When** a página carrega
**Then** as 5 transações mais recentes do usuário são exibidas ordenadas por data decrescente (FR16), com: data, tipo (badge), categoria, valor em BRL

**Given** uma nova transação é criada
**When** o dashboard revalida
**Then** a lista das últimas 5 atualiza automaticamente sem reload, com nova transação aparecendo no topo com animação de entrada (Framer Motion AnimatePresence)

**Given** uma transação é excluída
**When** o dashboard revalida
**Then** a transação some da lista com animação de saída e a próxima transação mais recente ocupa seu lugar

**Given** navego entre páginas do app (ex: dashboard → login e volta)
**When** a transição ocorre
**Then** transições animadas suaves são aplicadas na navegação (FR21) sem flicker ou salto visual

**Given** o app está em uso no desktop (1280px+)
**When** visualizo o layout completo
**Then** cards e lista de transações são exibidos sem quebras ou overflow em 1280px+ (NFR10)

**Given** o app está em uso em tablet (768px)
**When** visualizo o layout
**Then** o layout é funcional e utilizável, sem elementos sobrepostos ou ilegíveis (NFR10)

**Given** navego pelo app usando apenas teclado
**When** foco elementos interativos
**Then** indicador de foco é visível em todos os botões, inputs e links (NFR9); toasts são anunciados via aria-live (NFR9)
