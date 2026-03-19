# Retrospectiva - Epic 1: Fundacao e Autenticacao

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 4/4 (100%) |
| Testes Criados | ~30+ |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 1.1 - Configuracao do Schema de Banco de Dados e Tema Visual
2. 1.2 - Cadastro de Usuario com Onboarding
3. 1.3 - Login de Usuario
4. 1.4 - Middleware de Autenticacao e Logout

---

## O Que Deu Certo

1. **Fundacao solida com Prisma + SQLite** — Schema bem definido com 3 modelos (User, Category, Transaction), indices e constraints desde o inicio. Prisma Client singleton evita problemas de hot reload.

2. **Autenticacao robusta com jose** — Escolha de jose ao inves de jsonwebtoken para compatibilidade com Edge Runtime do middleware Next.js. JWT em httpOnly cookie, nunca em localStorage.

3. **Validacao dupla (client + server)** — react-hook-form + zod no client para UX, zod no server para seguranca. Padrao ActionResponse<T> consistente.

4. **Code review encontrou vulnerabilidade critica** — Story 1.2 tinha completeOnboarding() recebendo userId do client (manipulavel). Corrigido para usar httpOnly cookie (onboarding_uid). Review funcionou como gate de qualidade.

5. **Padrao de mensagem generica no login** — "Email ou senha incorretos" sem diferenciar qual campo esta errado, prevenindo enumeracao de emails.

---

## O Que Pode Melhorar

1. **Prisma v7 breaking changes** — O adapter `@prisma/adapter-better-sqlite3` era necessario mas nao estava documentado. Tempo perdido descobrindo isso.

2. **Duplicacao de jwtSecret** — Middleware e auth.ts tinham cada um sua propria copia do jwtSecret. Corrigido no code review, mas deveria ter sido pego na implementacao.

3. **Zod v4 breaking change** — `issues` ao inves de `errors` para acessar erros de validacao. Descoberto em runtime.

4. **shadcn/ui v4 usa oklch** — CSS variables em oklch ao inves de HSL. Diferente do esperado pela documentacao mais antiga.

---

## Licoes Aprendidas

1. **Sempre verificar breaking changes** antes de usar versoes major novas (Prisma v7, Zod v4, shadcn v4)
2. **Code review e essencial** — Encontrou vulnerabilidade de seguranca real (userId do client)
3. **httpOnly cookies para tudo sensivel** — JWT e onboarding token ambos em cookies seguros
4. **Server Actions simplificam muito** — Sem API Routes, sem fetch, tudo tipado end-to-end

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| DATABASE_URL com path relativo nao funciona corretamente com Prisma 7 | Media | Corrigido para `file:./prisma/dev.db` |
| Nenhuma migration formal (usando db push) | Baixa | Aceitavel para MVP |

---

## Preparacao para Epic 2

- Layout (app) precisa do getSession() da Epic 1 — pronto
- Bottom nav precisa de rotas (app) definidas — pronto
- Dashboard vai usar formatCurrency, formatDate, DEFAULT_CATEGORIES — todos prontos
- Nenhum blocker identificado

---

## Acordos do Time

1. Sempre rodar code review apos implementacao
2. Verificar breaking changes de dependencias antes de implementar
3. Nunca receber IDs do client sem validacao de ownership
