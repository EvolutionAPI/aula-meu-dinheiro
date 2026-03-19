# Retrospectiva - Epic 4: Historico e Gestao de Transacoes

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 2/2 (100%) |
| Testes Criados | ~21 (15 date/filter/list + 6 deleteTransaction) |
| Total Acumulado | 98 testes passando |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 4.1 - Tela de Transacoes com Lista e Filtros
2. 4.2 - Exclusao de Transacao com Swipe e Undo

---

## O Que Deu Certo

1. **Filtragem client-side sobre dados server-side** — Server Component busca todas as transacoes, Client Component filtra por periodo. UX rapida sem round-trips adicionais.

2. **Date helpers bem testados** — getMonthRange, getWeekRange, getTodayRange com tipo DateRange. 15 testes unitarios cobrindo edge cases.

3. **Swipe-to-delete com Framer Motion drag** — useMotionValue + useTransform para opacidade reativa. dragConstraints para limitar o swipe. Snap logic para decidir se deleta ou volta.

4. **Undo via recriacao** — deleteTransaction faz delete real, undo usa createTransaction com mesmos dados. Simples e eficaz. Dados transientes armazenados durante os 3s do toast.

5. **AnimatePresence mode="popLayout"** — Lista reorganiza suavemente quando item e removido. Layout animation para reposicionamento dos itens restantes.

6. **Ownership check no delete** — Server Action valida que a transacao pertence ao usuario da sessao antes de deletar. Seguranca adequada.

---

## O Que Pode Melhorar

1. **Todas as transacoes carregadas de uma vez** — Para MVP esta ok, mas com muitas transacoes vai precisar de paginacao.

2. **useMemo para filtros e totais** — Calculo refeito a cada re-render do filter. Funciona, mas e otimizacao de performance a monitorar.

3. **Serializacao de Date objects** — Novamente encontrado (como na Epic 2). Dates do Prisma precisam ser serializadas para Client Components.

---

## Licoes Aprendidas

1. **Server fetch + client filter** e um padrao poderoso para datasets pequenos/medios
2. **Swipe gestures com Framer Motion** sao surpreendentemente simples com drag + useMotionValue
3. **Undo por recriacao** e mais simples que soft-delete para MVP
4. **AnimatePresence mode="popLayout"** e essencial para listas animadas com remocao
5. **Sempre verificar ownership** em Server Actions de delete/update

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| Sem paginacao na lista de transacoes | Media | Aceitavel para MVP, necessario se >100 transacoes |
| Date serialization repetida entre epics | Baixa | Padrao estabelecido, nao e problema |

---

## Preparacao para Epic 5

- Pagina de perfil precisa de getSession() — pronto
- Logout Server Action ja existe (Epic 1) — reusar
- Avatar com iniciais precisa de getInitials() — a criar
- Nenhum blocker identificado

---

## Acordos do Time

1. Monitorar performance de listas grandes — considerar paginacao se necessario
2. Sempre validar ownership em Server Actions destrutivas
3. Padronizar serializacao de Dates para Client Components
