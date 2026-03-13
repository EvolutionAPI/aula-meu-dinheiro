# Story 1.2: Banco de Dados, Estrutura de Pastas e Variáveis de Ambiente

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como desenvolvedor,
Quero configurar o banco de dados, criar a estrutura de diretórios da arquitetura e configurar as variáveis de ambiente,
Para que o projeto esteja completamente scaffoldado e pronto para receber código de funcionalidades.

## Acceptance Criteria

**AC1 — Schema Prisma completo e migration inicial aplicados:**
Dado que o Prisma está instalado,
Quando configuro e aplico o schema Prisma com SQLite,
Então `prisma/schema.prisma` contém os models `User`, `Session` e `Transaction` exatamente conforme a arquitetura (com índices e relações), a migration inicial existe em `prisma/migrations/`, e `prisma/dev.db` é gerado com sucesso via `npx prisma migrate dev --name init`.

**AC2 — Estrutura de diretórios da arquitetura criada:**
Dado que o schema está migrado,
Quando verifico a estrutura de diretórios em `src/`,
Então as pastas existem: `app/(auth)/login/`, `app/(auth)/register/`, `app/(app)/dashboard/`, `actions/`, `components/auth/`, `components/dashboard/`, `components/transactions/`, `components/shared/`, `components/ui/`, `lib/`, `types/`.

**AC3 — Variáveis de ambiente e gitignore configurados corretamente:**
Dado que a estrutura de pastas está criada,
Quando configuro as variáveis de ambiente,
Então `.env.local` com `DATABASE_URL="file:./dev.db"` e `SESSION_SECRET` existe e não está commitado; `.env.example` com valores placeholder está commitado como referência; `.gitignore` inclui `.env.local` e `prisma/dev.db`.

**AC4 — Aplicação e Prisma Client funcionam sem warnings:**
Dado que toda a configuração está feita,
Quando executo `npm run dev`,
Então a aplicação sobe sem erros e o Prisma Client conecta ao banco sem warnings.

## Tasks / Subtasks

- [x] Task 1: Definir schema Prisma completo e gerar migração inicial (AC: #1)
  - [x] Atualizar `prisma/schema.prisma` com os models `User`, `Session` e `Transaction`
  - [x] Garantir relações e índices: `@@index([userId])` em `Session`, `@@index([userId])` e `@@index([userId, date])` em `Transaction`
  - [x] Executar `npx prisma migrate dev --name init`
  - [x] Validar geração de `prisma/migrations/` e `prisma/dev.db`

- [x] Task 2: Criar estrutura de diretórios base da arquitetura (AC: #2)
  - [x] Criar `src/app/(auth)/login/` e `src/app/(auth)/register/`
  - [x] Criar `src/app/(app)/dashboard/`
  - [x] Criar `src/actions/`, `src/lib/`, `src/types/`
  - [x] Criar `src/components/auth/`, `src/components/dashboard/`, `src/components/transactions/`, `src/components/shared/`
  - [x] Confirmar presença de `src/components/ui/` (gerado pelo shadcn/ui)

- [x] Task 3: Configurar variáveis de ambiente e arquivos de referência (AC: #3)
  - [x] Criar/ajustar `.env.local` com `DATABASE_URL="file:./dev.db"` e `SESSION_SECRET="<gerar-valor-seguro>"`
  - [x] Criar `.env.example` com placeholders para `DATABASE_URL` e `SESSION_SECRET`
  - [x] Garantir que `.gitignore` contém `.env.local` e `prisma/dev.db`

- [x] Task 4: Verificação final de execução local (AC: #4)
  - [x] Executar `npx prisma generate` e confirmar client gerado sem erros
  - [x] Executar `npm run dev` e validar inicialização sem erro/warning crítico
  - [x] Executar `npm run lint` para confirmar baseline limpa

## Dev Notes

### Schema Prisma de Referência (deve ser reproduzido fielmente)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  sessions     Session[]
  transactions Transaction[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}

model Transaction {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String
  amount      Float
  category    String
  date        DateTime
  description String?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([userId, date])
}
```

### Sequência sugerida de execução

```bash
# 1) Atualizar schema e aplicar migration
npx prisma migrate dev --name init

# 2) Regenerar Prisma Client (se necessário)
npx prisma generate

# 3) Verificar app
npm run dev
npm run lint
```

### Regras e Restrições Importantes

- Banco de dados local é SQLite com arquivo em `prisma/dev.db`
- `DATABASE_URL` esperado: `file:./dev.db` (resolvido dentro de `prisma/`)
- Não commitar `.env.local`
- Não commitar `prisma/dev.db`
- Manter alias de import `@/*` e estrutura de código em `src/`

### Project Structure Notes

- Esta story conclui o scaffold técnico do Epic 1 para iniciar implementação funcional do Epic 2
- A criação das pastas não implica implementação de telas/rotas completas, apenas estrutura base pronta
- `components/ui/` deve continuar sendo gerenciado pelo shadcn/ui

### References

- ACs e escopo da Story 1.2: [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- Schema Prisma e índices: [Source: _bmad-output/planning-artifacts/architecture.md#1. Arquitetura de Dados]
- Comandos de Prisma e setup: [Source: _bmad-output/planning-artifacts/architecture.md#Comando de Inicialização]
- Estrutura de diretórios-alvo: [Source: _bmad-output/planning-artifacts/architecture.md#Estrutura Completa de Diretórios]

## Change Log

| Date       | Who  | Change |
|------------|------|--------|
| 2026-03-03 | AI   | Code review: HIGH/MEDIUM fixes applied (.gitignore, .env.example DATABASE_URL, package.json lint, File List, Dev Agent Record). Status → done. |

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

- `npx prisma migrate dev --name init` executed correctly.
- Removed `url      = env("DATABASE_URL")` as it is handled by `prisma.config.ts` in Prisma 7.
- `npx prisma generate` config loaded.

### Completion Notes List

- All requested folders inside `src/` created.
- `.env.local` and `.env.example` created. `.gitignore` updated.
- Lint passed. Scaffold successful.

### Code Review (AI) — Fixes Applied

- **HIGH:** `.env.example` — DATABASE_URL set to `file:./prisma/dev.db` so DB is created under `prisma/`; ensure `.env.example` is committed (`git add .env.example`). `.gitignore` updated: explicit `.env.local`, and `/dev.db` added to avoid committing root-level DB if present.
- **MEDIUM:** File List updated to include `prisma.config.ts`, `prisma/migrations/`, migration SQL file, and `package.json`. Lint script changed from `eslint` to `next lint` in `package.json`.
- Schema datasource left without `url` (Prisma 7 uses `prisma.config.ts`); no change to avoid breaking config.

### File List

- `prisma/schema.prisma`
- `prisma.config.ts`
- `prisma/migrations/`
- `prisma/migrations/20260303230949_init/migration.sql`
- `.env.local`
- `.env.example`
- `.gitignore`
- `package.json`
