# Story 6.1: Migracao para Supabase PostgreSQL e Preparacao para Deploy Vercel

> **Status:** done
> **Depends on:** Todas as epics anteriores

---

## Story

**As a** desenvolvedor,
**I want** migrar o banco de dados de SQLite para Supabase PostgreSQL e atualizar o guia do aluno,
**So that** o app funcione na Vercel com banco persistente e os alunos tenham instrucoes atualizadas.

---

## Acceptance Criteria

1. **Given** o projeto usa SQLite **When** migrado para Supabase **Then** o schema Prisma usa provider "postgresql", o adapter SQLite e removido, e o DATABASE_URL aponta para Supabase

2. **Given** o projeto migrado **When** `npm run build` e executado **Then** compila sem erros e esta pronto para deploy na Vercel

3. **Given** o guia do aluno (HTML) **When** atualizado **Then** inclui instrucoes para configurar Supabase, env vars na Vercel, e deploy

---

## Tasks / Subtasks

- [x] Task 1: Atualizar schema Prisma para PostgreSQL (provider "postgresql", URLs no prisma.config.ts)
- [x] Task 2: Substituir adapter SQLite por @prisma/adapter-pg no db.ts
- [x] Task 3: Atualizar dependencias (removido @prisma/adapter-better-sqlite3, adicionado @prisma/adapter-pg)
- [x] Task 4: Atualizar .env e .env.local com template de DATABASE_URL do Supabase
- [x] Task 5: Atualizar guia do aluno com 5 passos de deploy (Supabase + Prisma db push + Vercel + Cloudflare + testes)
- [x] Task 6: Build ok + 117 testes passando

---

## Dev Notes

### Prisma 7 Breaking Changes
- URLs de conexao vao no `prisma.config.ts`, NAO no schema.prisma
- `directUrl` nao existe no tipo de config do Prisma 7
- PostgreSQL requer `@prisma/adapter-pg` — nao funciona sem adapter no Prisma 7
- `PrismaPg({ connectionString })` no db.ts

### Supabase Connection
- Usar Transaction mode (porta 6543) com `?pgbouncer=true` para o app
- Connection pooling do Supabase e necessario para serverless (Vercel)

### Env Vars necessarias na Vercel
- `DATABASE_URL` — connection string do Supabase
- `JWT_SECRET` — string segura de 32+ caracteres

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6 (1M context)

### Debug Log
- Prisma 7 nao aceita `url` e `directUrl` no schema.prisma — movido para prisma.config.ts
- `directUrl` nao existe no tipo de config — removido
- PostgreSQL requer `@prisma/adapter-pg` com `PrismaPg({ connectionString })`
- Middleware interceptava `/live-04-guia-aluno.html` e redirecionava para login — corrigido matcher
- Cookie JWT de banco antigo (SQLite) causava erro Foreign Key no Supabase — adicionado auto-clear via /api/logout
- Nao pode deletar cookie em Server Component — criada Route Handler GET /api/logout
- Scrollbar branca no iframe do guia — adicionado CSS dark scrollbar no HTML do guia
- Body scrollbar no desktop — adicionado overflow:hidden via DesktopWrapper useEffect
- Build e testes passando: 117/117

### File List
- prisma/schema.prisma (modificado — provider postgresql, removido url/directUrl)
- prisma.config.ts (modificado — datasource url do env)
- src/lib/db.ts (modificado — PrismaPg adapter ao inves de BetterSqlite3)
- .env (modificado — DATABASE_URL Supabase + JWT_SECRET)
- package.json (modificado — removido better-sqlite3, adicionado @prisma/adapter-pg)
- live-04-guia-aluno.html (modificado — deploy 5 passos com Supabase + scrollbar dark)
- public/live-04-guia-aluno.html (modificado — sync do guia)
- src/middleware.ts (modificado — excluir .html do matcher)
- src/app/(app)/layout.tsx (modificado — try/catch com redirect /api/logout para sessao invalida)
- src/app/api/logout/route.ts (novo — Route Handler que limpa cookie e redireciona para /login)
- src/components/desktop-wrapper.tsx (modificado — body overflow hidden no desktop)
- src/app/globals.css (modificado — scrollbar dark global)
- README.md (modificado — documentacao completa de setup e deploy)

### Change Log
- 2026-03-19: Migrado de SQLite para Supabase PostgreSQL (Prisma 7 + @prisma/adapter-pg)
- 2026-03-19: Guia do aluno atualizado com 5 passos de deploy (Supabase + Vercel + Cloudflare)
- 2026-03-19: Fix: middleware excluindo .html para iframe do guia funcionar
- 2026-03-19: Fix: auto-clear de sessao invalida via /api/logout Route Handler
- 2026-03-19: Fix: scrollbar dark global e no HTML do guia
- 2026-03-19: Fix: body overflow hidden no desktop para evitar scrollbar extra
- 2026-03-19: README atualizado com setup completo
