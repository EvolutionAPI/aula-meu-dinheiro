# Retrospectiva - Epic 2: Dashboard e Visualizacao Financeira

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 3/3 (100%) |
| Testes Criados | ~25+ |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 2.1 - Layout do App com Bottom Navigation
2. 2.2 - Dashboard com Hero Card e Saldo
3. 2.3 - Componente de Counter Animation

---

## O Que Deu Certo

1. **Separacao Server/Client Component exemplar** — Layout como Server Component, BottomNav como Client Component com usePathname(). Dashboard busca dados no server, DashboardClient gerencia estado de visibilidade. Padrao consistente e performante.

2. **AnimatedCounter com Framer Motion useSpring** — Abordagem com MotionValue evita re-renders do React em cada frame. formatCurrency via useTransform roda fora do ciclo de render. 60fps sem jank.

3. **Semaforo de saude financeira** — Reutilizou SEMAPHORE_THRESHOLDS da Epic 1. Verde/amarelo/vermelho com borda-left no hero card. Visual intuitivo.

4. **Acessibilidade completa** — aria-label na nav, aria-current="page", sr-only labels, focus-visible ring, safe-area-inset-bottom para iOS, prefers-reduced-motion no counter.

5. **Code review melhorou performance** — formatCurrency caching, aggregate queries ao inves de loops, tratamento de saldo negativo, constantes TRANSACTION_TYPE.

---

## O Que Pode Melhorar

1. **Container 428px requer atencao** — Posicionamento do FAB (Epic 3) e bottom nav dentro do container de 428px exigiu cuidado especial. Padding e margem precisam ser consistentes.

2. **Serializacao de Date para Client Components** — Dates do Prisma precisam ser convertidas para strings ao passar para Client Components. Descoberto durante implementacao.

3. **Dashboard complexo em uma story** — Story 2.2 era grande (hero card + eye toggle + transacoes recentes + skeleton + acoes rapidas). Poderia ter sido dividida.

---

## Licoes Aprendidas

1. **Framer Motion useSpring > useState + setInterval** — MotionValue evita re-renders, performance muito melhor
2. **Server Component para data fetching direto com Prisma** — Sem API layer, sem loading states desnecessarios
3. **useReducedMotion() deve ser padrao** em todo componente com animacao
4. **Skeleton loading deve ter formato exato** do conteudo final para evitar layout shift

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| Nenhuma divida significativa identificada | - | - |

---

## Preparacao para Epic 3

- FAB precisa ser posicionado dentro do container 428px — layout pronto
- BottomSheet precisa de AnimatePresence do Framer Motion — ja instalado
- TransactionForm vai usar DEFAULT_CATEGORIES e formatCurrency — prontos
- Server Action createTransaction vai usar padrao ActionResponse — definido

---

## Acordos do Time

1. Stories grandes devem ser divididas quando possivel
2. Sempre testar serializacao de dados entre Server e Client Components
3. useReducedMotion() obrigatorio em componentes animados
