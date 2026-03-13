# Story 2.1: Infraestrutura de Autenticação e Proteção de Rotas

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como desenvolvedor,
Quero implementar a camada de autenticação (lib/auth.ts, middleware e API routes),
Para que a base de sessões e proteção de rotas esteja pronta antes das interfaces de usuário.

## Acceptance Criteria

**AC1 — Módulo de autenticação `src/lib/auth.ts` implementado:**
Dado que o banco de dados está inicializado com os models User e Session,
Quando implemento `src/lib/auth.ts`,
Então as funções `hashPassword`, `comparePassword`, `createSession`, `getSession` e `deleteSession` estão implementadas e exportadas.

**AC2 — API Routes de autenticação implementadas:**
Dado que `lib/auth.ts` está implementado,
Quando implemento as API Routes de autenticação,
Então:
- `POST /api/auth/register` aceita `{name, email, password}`, cria o User com hash bcrypt (saltRounds=12) e retorna `{success: true}` ou erro formatado
- `POST /api/auth/login` valida credenciais e cria sessão com cookie `sessionId` (httpOnly, secure em prod, sameSite: lax, maxAge: 7 dias)
- `POST /api/auth/logout` deleta a sessão do banco e limpa o cookie

**AC3 — Middleware de proteção de rotas implementado:**
Dado que as API Routes estão implementadas,
Quando implemento `src/middleware.ts`,
Então:
- Rotas públicas `/login`, `/register` e `/api/auth/*` são acessíveis sem autenticação
- Qualquer outra rota redireciona para `/login` se não houver sessão válida
- Usuário autenticado acessando `/login` ou `/register` é redirecionado para `/dashboard`

**AC4 — Redirecionamento server-side funciona:**
Dado que o middleware está ativo,
Quando acesso `/dashboard` sem cookie de sessão,
Então sou redirecionado para `/login` pelo servidor (não pelo cliente).

**AC5 — Redirecionamento de autenticado em rotas públicas funciona:**
Dado que o middleware está ativo,
Quando acesso `/login` com sessão válida,
Então sou redirecionado para `/dashboard`.

## Tasks / Subtasks

- [ ] Task 1: Criar `src/lib/db.ts` — Prisma Client singleton (AC: #1)
  - [ ] Exportar instância singleton do PrismaClient com padrão de reutilização em dev
- [ ] Task 2: Criar `src/lib/auth.ts` — funções de autenticação (AC: #1)
  - [ ] Implementar `hashPassword(password: string): Promise<string>` com bcryptjs saltRounds=12
  - [ ] Implementar `comparePassword(password: string, hash: string): Promise<boolean>`
  - [ ] Implementar `createSession(userId: string): Promise<string>` — cria Session no banco com expiresAt = 7 dias, retorna sessionId
  - [ ] Implementar `getSession(sessionId: string): Promise<{ userId: string } | null>` — valida existência e expiresAt > now
  - [ ] Implementar `deleteSession(sessionId: string): Promise<void>` — deleta Session do banco
- [ ] Task 3: Criar schemas Zod de autenticação `src/lib/validations/auth.ts` (AC: #2)
  - [ ] `registerSchema`: name (string min 2), email (string email válido), password (string min 8)
  - [ ] `loginSchema`: email (string email válido), password (string min 1)
- [ ] Task 4: Criar API Route `src/app/api/auth/register/route.ts` (AC: #2)
  - [ ] Validar body com registerSchema via safeParse
  - [ ] Verificar se email já existe no banco
  - [ ] Criar User com passwordHash via hashPassword
  - [ ] Criar sessão via createSession e setar cookie
  - [ ] Retornar `{ success: true }` ou erro formatado com código HTTP adequado
- [ ] Task 5: Criar API Route `src/app/api/auth/login/route.ts` (AC: #2)
  - [ ] Validar body com loginSchema via safeParse
  - [ ] Buscar User por email, comparar senha via comparePassword
  - [ ] Criar sessão e setar cookie sessionId com configuração obrigatória
  - [ ] Retornar `{ success: true }` ou erro genérico "Email ou senha inválidos"
- [ ] Task 6: Criar API Route `src/app/api/auth/logout/route.ts` (AC: #2)
  - [ ] Ler cookie sessionId, deletar sessão do banco via deleteSession
  - [ ] Limpar cookie sessionId (maxAge=0)
  - [ ] Retornar `{ success: true }`
- [ ] Task 7: Criar `src/middleware.ts` — proteção de rotas (AC: #3, #4, #5)
  - [ ] Definir matcher para excluir assets estáticos (_next, favicon, etc.)
  - [ ] Definir rotas públicas: `/login`, `/register`, `/api/auth/*`
  - [ ] Se rota pública + sessão válida + rota é `/login` ou `/register` → redirect `/dashboard`
  - [ ] Se rota protegida + sem sessão válida → redirect `/login`
  - [ ] Se rota protegida + sessão válida → NextResponse.next()
- [ ] Task 8: Verificação de integração (AC: #4, #5)
  - [ ] Testar `npm run dev` sem erros
  - [ ] Testar `npm run lint` sem erros

## Dev Notes

### Arquitetura de Autenticação — Decisões Obrigatórias

**Método:** Session-based com cookies httpOnly. Implementação própria (sem NextAuth/Auth.js).

**Configuração EXATA do Cookie (NÃO alterar):**
```typescript
{
  name: 'sessionId',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 dias
  path: '/'
}
```

**Hashing:** bcryptjs@3.0.3 com saltRounds = 12. NUNCA armazenar senha em texto plano. NUNCA retornar passwordHash em respostas.

**Prisma Client Singleton (padrão obrigatório):**
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Formato de Resposta das API Routes

```typescript
// Sucesso
{ success: true, data?: T }

// Erro
{ success: false, error: { message: string } }
```

**Códigos HTTP:** 200 sucesso, 201 criado, 400 dados inválidos, 401 não autenticado, 409 email duplicado, 500 erro interno.

### Middleware — Lógica de Rotas

```
Rotas públicas (sem auth): /login, /register, /api/auth/*
Rotas protegidas (tudo mais): redirect /login se sem sessão

Regra especial: usuário autenticado em /login ou /register → redirect /dashboard
```

**ATENÇÃO ao middleware:** O middleware do Next.js NÃO pode usar Prisma diretamente (roda no Edge Runtime por padrão). Para validar sessão no middleware, há duas abordagens:

1. **Opção recomendada:** Configurar o middleware para rodar no Node.js runtime (`export const runtime = 'nodejs'`) E usar Prisma para verificar sessão
2. **Opção alternativa:** Fazer verificação básica no middleware (cookie existe?) e validar sessão completa nas API Routes/Server Components

O dev agent DEVE escolher a abordagem que funcione com Next.js 16 + Prisma 7. Pesquisar compatibilidade antes de implementar.

### Schemas Zod de Validação

```typescript
// src/lib/validations/auth.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})
```

### Regras de Segurança OBRIGATÓRIAS

- `userId` SEMPRE extraído da sessão no servidor, NUNCA do request body
- `passwordHash` NUNCA incluído em respostas de API ou props de componentes
- Erros de banco NUNCA retornam mensagens brutas para o cliente
- Email duplicado deve retornar erro genérico sem revelar informações
- Todas as queries ao banco que envolvam dados do usuário DEVEM incluir `WHERE userId`

### Convenções de Código

- Arquivos de lib/util: camelCase → `auth.ts`, `db.ts`
- Funções e variáveis: camelCase → `hashPassword`, `createSession`
- Types e Interfaces: PascalCase → `UserSession`
- Import alias: `@/*` para imports absolutos a partir de `src/`

### Prisma 7 — Particularidade Importante

O projeto usa Prisma 7.2.0, que tem uma diferença em relação a versões anteriores: a configuração do datasource é feita via `prisma.config.ts` na raiz do projeto (já existe), e NÃO via `url` no `schema.prisma`. O `schema.prisma` atual NÃO tem `url` no bloco `datasource` — isso é intencional. O Prisma Client lê a URL do `prisma.config.ts` que usa `dotenv/config`.

O arquivo `prisma.config.ts` já existe na raiz:
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

### Estrutura de Arquivos a Criar/Modificar

**Criar:**
- `src/lib/db.ts` — Prisma Client singleton
- `src/lib/auth.ts` — funções de autenticação
- `src/lib/validations/auth.ts` — schemas Zod
- `src/app/api/auth/register/route.ts` — API Route de cadastro
- `src/app/api/auth/login/route.ts` — API Route de login
- `src/app/api/auth/logout/route.ts` — API Route de logout
- `src/middleware.ts` — proteção de rotas

**Já existentes (NÃO recriar):**
- `prisma/schema.prisma` — models User, Session, Transaction já definidos
- `prisma.config.ts` — configuração Prisma 7
- `.env.local` — DATABASE_URL e SESSION_SECRET já configurados
- Pastas `src/app/(auth)/login/`, `src/app/(auth)/register/`, `src/app/api/` — já criadas no Epic 1

### Project Structure Notes

- Esta story cria a infraestrutura backend de autenticação SEM interfaces de usuário
- As stories 2.2 e 2.3 criarão os formulários de cadastro e login que consomem estas API Routes
- O middleware protegerá rotas mesmo antes de as páginas terem conteúdo real
- `src/app/(auth)/login/page.tsx` e `src/app/(auth)/register/page.tsx` podem conter apenas um placeholder mínimo nesta story (se necessário para que o redirect funcione)

### Learnings da Story 1.2 (Story Anterior)

- Prisma 7 usa `prisma.config.ts` com `dotenv/config` para URL do banco — NÃO adicionar `url` no `schema.prisma`
- Lint script no package.json é `next lint` (não `eslint`)
- O `.env.local` já tem `DATABASE_URL="file:./prisma/dev.db"` (path inclui `prisma/`)
- A pasta `src/lib/` já existe mas contém apenas `utils.ts` (do shadcn/ui)
- A pasta `src/lib/validations/` NÃO existe ainda — precisa ser criada

### References

- Requisitos da Story 2.1: [Source: _evo-output/planning-artifacts/setup-mvp/epics.md#Story 2.1]
- Autenticação e Segurança: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#2. Autenticação e Segurança]
- Padrões de API: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#3. Padrões de API e Comunicação]
- Estrutura do Projeto: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#Estrutura Completa de Diretórios]
- Schema Prisma: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#1. Arquitetura de Dados]
- Cookie Config: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#Configuração do Cookie]
- Story 1.2 Learnings: [Source: _evo-output/implementation-artifacts/setup-mvp/1-2-banco-de-dados-estrutura-de-pastas-e-variaveis-de-ambiente.md#Dev Agent Record]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
