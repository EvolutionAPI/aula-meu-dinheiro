---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
status: complete
inputDocuments: ['product-brief-live-01-2026-02-26.md']
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
classification:
  projectType: web_app
  domain: fintech
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - MeuDinheiro

**Author:** Davidson
**Date:** 2026-02-26

## Executive Summary

MeuDinheiro é uma aplicação web fullstack de finanças pessoais construída com Next.js 14+, Tailwind CSS e shadcn/ui. Resolve o problema de controle financeiro pessoal para usuários que querem registrar receitas e despesas rapidamente, sem a complexidade de apps tradicionais ou a fricção de planilhas. Entrega um dashboard com saldo atual, totais mensais e histórico de transações em uma interface visualmente polida, com transições animadas e experiência limpa.

**Tipo de Projeto:** Web App SPA/fullstack (Next.js 14+ App Router) | **Domínio:** Fintech pessoal — sem compliance regulatório | **Contexto:** Greenfield

Construído como demonstração ao vivo do processo BMAD, o critério de sucesso é duplo: funcionalidade completa E qualidade estética da experiência — transições suaves, microinterações refinadas, zero erros visíveis durante a apresentação.

### O Que Torna Este Produto Especial

O diferencial não está no conjunto de funcionalidades — está na qualidade da execução visual. Interface bonita por padrão, transições que dão vida às interações, clareza visual que permite ao usuário entender seu estado financeiro em segundos. A beleza é funcional, não decorativa. O produto também serve como prova de conceito de que o processo BMAD produz software com qualidade de produto real.

## Success Criteria

### User Success

- Usuário cria conta e faz login em menos de 1 minuto
- Usuário registra uma transação em menos de 30 segundos
- Dashboard exibe saldo, receitas e despesas atualizados imediatamente após cada registro
- Usuário completa o fluxo principal sem tutorial ou suporte
- Interface transmite qualidade visual percebida — transições suaves, sem quebras ou saltos visuais

### Business Success

- 100% das funcionalidades do MVP operando durante a live sem erros críticos
- Fluxo completo demonstrado ao vivo: cadastro → login → registrar transação → ver no dashboard
- Projeto serve como referência concreta do processo BMAD para a comunidade

### Technical Success

- Zero erros de runtime visíveis durante a demonstração
- Animações e transições a 60fps sem jank
- Resposta a ações do usuário < 300ms
- Código segue as decisões de arquitetura definidas no processo BMAD

### Measurable Outcomes

- Cadastro + primeiro registro de transação: < 2 minutos end-to-end
- Dashboard atualiza sem reload de página após cada operação
- Nenhuma tela com layout quebrado em viewport desktop (1280px+)

## Product Scope

### MVP (Phase 1)

**MVP Approach:** Experience MVP — funcionalidade mínima com execução máxima de qualidade visual.
**Resources:** 1 desenvolvedor, ~4-6h de live coding

- Autenticação: cadastro, login, logout, sessão persistente com cookies httpOnly
- Transações: criar (tipo, valor, categoria, data, descrição opcional), listar, excluir
- Dashboard: 3 cards reativos (saldo, receitas, despesas do mês) + lista das últimas 5 transações
- Categorias fixas: Receitas (Salário, Freelance, Outros) / Despesas (Alimentação, Transporte, Moradia, Saúde, Lazer, Outros)
- Transições animadas e microinterações nas ações principais
- Validação de formulário com feedback inline + toast notifications
- Atualização de estado local imediata após cada operação (sem reload)

**Contingência:** Se o tempo apertar, microinterações secundárias são descartáveis — fluxo funcional tem prioridade sobre polish extra.

### Growth Features (Phase 2)

- Filtros por período e categoria
- Gráfico de gastos por categoria (pizza ou barras)
- Edição de transações
- Relatório mensal por email

### Vision (Phase 3)

- Metas de economia por categoria
- Categorias personalizadas
- App mobile
- Modo escuro

## User Journeys

### Jornada 1 — Lucas descobre seu saldo real (Happy Path)

É sexta à noite. Lucas acabou de receber o pagamento de um projeto freelance e quer saber quanto sobrou no mês. Abre o MeuDinheiro no browser.

**Onboarding:** Cria conta em 30 segundos — nome, email, senha. Redirecionado direto pro dashboard. Vê os três cards zerados. A interface é bonita — ele já gosta.

**Primeiro registro:** Clica em "Nova transação". Modal abre com animação suave. Seleciona "Receita", digita R$ 4.500, escolhe categoria "Freelance", confirma a data. Salva. Card de receitas atualiza na hora — sem reload. Animação no número subindo para R$ 4.500.

**Realidade financeira:** Registra três despesas — aluguel R$ 1.800, supermercado R$ 650, Uber R$ 120. A cada registro o saldo atualiza. Resultado: Saldo R$ 1.930. Pela primeira vez em meses ele sabe exatamente o que sobrou.

*Capabilities: autenticação, dashboard reativo, modal de transação, atualização em tempo real, animações de feedback.*

### Jornada 2 — Lucas tenta registrar e algo dá errado (Edge Case)

Lucas com pressa abre nova transação e digita valor com vírgula. App valida e mostra erro inline — sem quebrar a tela, sem perder o que já digitou. Tenta salvar sem categoria — outro erro inline. Corrige, salva — transação aparece na lista com animação.

Depois exclui uma transação registrada errado. Toast confirma "Transação excluída". Saldo atualiza automaticamente.

*Capabilities: validação com feedback inline, toast notifications, exclusão com atualização automática.*

### Jornada 3 — Lucas volta depois de uma semana (Returning User)

Lucas não abre o app há 7 dias. Acessa a URL, é redirecionado direto pro dashboard — sessão ainda ativa. Vê as últimas 5 transações. Registra duas despesas rapidamente e fecha.

*Capabilities: sessão persistente, dashboard carregado ao retornar, fluxo sem fricção.*

### Journey Requirements Summary

| Capability | Jornadas |
|---|---|
| Autenticação (cadastro, login, logout, sessão) | J1, J3 |
| Dashboard com 3 cards reativos | J1, J2, J3 |
| Modal/form de transação com validação | J1, J2 |
| Atualização imediata dos cards após operação | J1, J2 |
| Animações de feedback | J1 |
| Toast notifications | J2 |
| Exclusão com atualização automática | J2 |
| Lista das últimas 5 transações | J1, J3 |
| Sessão persistente | J3 |

## Web App Requirements

### Architecture Decisions

- **Renderização:** App Router — Server Components para carregamento inicial, Client Components para interatividade e animações
- **Estado:** Reatividade local do cliente após cada mutation — sem WebSockets, sem polling, sem sync entre abas
- **Autenticação:** Session-based com cookies httpOnly/secure — redirecionamento server-side para login quando não autenticado
- **Banco de dados:** Prisma ORM com SQLite — sem dependências externas, tudo roda na própria aplicação

### Responsive Design

- **Target:** Desktop 1280px+ (contexto da live)
- **Mínimo:** Funcional em tablet 768px+
- **Mobile:** Best-effort, fora do escopo do MVP

### SEO

Não aplicável — aplicação privada. Páginas públicas (login/cadastro) recebem apenas meta tags básicas.

## Functional Requirements

### Gestão de Usuário

- **FR1:** Visitante pode criar uma conta com nome, email e senha
- **FR2:** Usuário pode fazer login com email e senha
- **FR3:** Usuário autenticado pode fazer logout
- **FR4:** Sistema mantém sessão ativa entre visitas (cookies httpOnly persistentes)
- **FR5:** Usuário não autenticado é redirecionado para login ao acessar páginas protegidas

### Gestão de Transações

- **FR6:** Usuário pode registrar uma transação informando tipo (receita ou despesa), valor, categoria, data e descrição opcional
- **FR7:** Usuário pode visualizar a lista das suas transações
- **FR8:** Usuário pode excluir uma transação existente
- **FR9:** Sistema filtra as categorias disponíveis conforme o tipo de transação selecionado
- **FR10:** Sistema valida campos obrigatórios antes de salvar e exibe erros sem perder dados preenchidos

### Categorias

- **FR11:** Sistema disponibiliza categorias fixas de receita: Salário, Freelance, Outros
- **FR12:** Sistema disponibiliza categorias fixas de despesa: Alimentação, Transporte, Moradia, Saúde, Lazer, Outros

### Dashboard Financeiro

- **FR13:** Usuário visualiza saldo atual do mês (receitas − despesas do mês corrente)
- **FR14:** Usuário visualiza total de receitas do mês corrente
- **FR15:** Usuário visualiza total de despesas do mês corrente
- **FR16:** Usuário visualiza lista das últimas 5 transações registradas
- **FR17:** Dashboard reflete estado atualizado imediatamente após criação ou exclusão de transação, sem reload

### Feedback e Experiência

- **FR18:** Sistema exibe feedback visual animado ao registrar transação com sucesso
- **FR19:** Sistema exibe toast ao excluir transação
- **FR20:** Sistema exibe erros de validação inline sem perder dados do formulário
- **FR21:** Navegação entre páginas ocorre com transições animadas

## Non-Functional Requirements

### Performance

- Time to Interactive < 2s em conexão padrão
- Resposta a ações do usuário (criar/excluir/navegar) < 300ms
- Animações e transições a 60fps — zero frames dropados visíveis
- Atualização do dashboard após operação < 100ms

### Security

- Senhas armazenadas com hash bcrypt — nunca em texto plano
- Sessão via cookies httpOnly e secure — inacessível via JavaScript
- Isolamento por userId em todas as queries — cada usuário acessa apenas seus dados
- Autenticação verificada no servidor em rotas protegidas — sem depender de redirecionamento client-only

### Accessibility

- Contraste WCAG AA: 4.5:1 para texto normal, 3:1 para texto grande
- Labels semânticos associados a todos os inputs de formulário
- Foco visível em todos os elementos interativos ao navegar via teclado
- Erros e toasts anunciados via aria-live para leitores de tela
