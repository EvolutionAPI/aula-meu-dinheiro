# Retrospectiva - Epic 6: Deploy e Infraestrutura

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 1/1 (100%) |
| Testes | 117 passando (sem regressao) |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 6.1 - Migracao Supabase PostgreSQL e Preparacao Deploy Vercel — **done**

---

## O Que Deu Certo

1. **Migracao SQLite -> PostgreSQL limpa** — Schema Prisma atualizado, adapter trocado, dependencias limpas. Build compilou sem erros na primeira tentativa apos correcoes.

2. **Guia do aluno atualizado** — Seção de deploy expandida de 4 para 5 passos com instrucoes claras de Supabase (criar projeto, copiar connection string, prisma db push).

3. **README completo** — Documentacao atualizada com todos os passos de setup, deploy, estrutura e variaveis de ambiente.

4. **Zero regressao** — 117 testes continuam passando apos a migracao. Nenhum teste precisou mudar por causa da troca de banco.

---

## O Que Pode Melhorar

1. **Prisma 7 breaking changes nao documentados** — URLs no `prisma.config.ts` (nao schema), `directUrl` inexistente, `@prisma/adapter-pg` obrigatorio. Tres erros consecutivos antes de acertar.

2. **Middleware bloqueava o iframe do guia** — `/live-04-guia-aluno.html` era interceptado pelo middleware e redirecionado para `/login`. Corrigido excluindo `.html` do matcher.

3. **Sessao JWT invalida causava crash** — Cookie JWT do SQLite antigo referenciava userId inexistente no Supabase. Nao pode deletar cookie em Server Component — precisou criar Route Handler `/api/logout`.

4. **Scrollbar branca no iframe** — CSS do app nao se aplica dentro do iframe. Precisou adicionar scrollbar dark diretamente no HTML do guia.

5. **Body scrollbar extra no desktop** — O body principal scrollava atras do DesktopWrapper. Corrigido com `overflow: hidden` via useEffect.

6. **Dois arquivos HTML do guia** — Existe na raiz E em `public/`. Sync manual propenso a erro.

---

## Licoes Aprendidas

1. **Prisma 7 com PostgreSQL exige adapter** — `@prisma/adapter-pg` obrigatorio
2. **Middleware afeta arquivos em public/** — Precisa excluir explicitamente no matcher
3. **Nao pode deletar cookie em Server Component** — Usar Route Handler (GET /api/logout)
4. **Sessao invalida precisa de auto-clear** — try/catch no layout com redirect para logout
5. **CSS de iframe e isolado** — Estilos precisam estar no proprio HTML do iframe
6. **Validar conexao real antes de marcar done** — Build passando nao garante que banco conecta
7. **SQLite -> PostgreSQL no Prisma e indolor** — Queries, schema e testes ficaram identicos

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| Arquivo HTML duplicado (raiz + public/) | Baixa | Funcional, mas redundante |
| Sem migration formal (usando db push) | Baixa | Aceitavel para MVP |

---

## Visao Geral Final do Projeto

| Epic | Status | Stories |
|------|--------|---------|
| Epic 1: Fundacao e Autenticacao | Done | 4/4 |
| Epic 2: Dashboard e Visualizacao | Done | 3/3 |
| Epic 3: Registro de Transacoes | Done | 3/3 |
| Epic 4: Historico e Gestao | Done | 2/2 |
| Epic 5: Perfil e Personalizacao | Done (1 cancelada) | 2/3 |
| Epic 6: Deploy e Infraestrutura | Done | 1/1 |

**Total: 15 stories done, 1 cancelled, 117 testes, 6 epics, 0 incidentes**

---

## Acordos do Time

1. Sempre validar conexao real com banco remoto antes de marcar done
2. Documentar breaking changes de versoes major ao encontra-las
3. Manter README atualizado como fonte de verdade para setup
4. Evitar duplicacao de arquivos — usar uma unica fonte
