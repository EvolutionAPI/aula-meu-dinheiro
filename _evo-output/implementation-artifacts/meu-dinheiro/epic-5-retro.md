# Retrospectiva - Epic 5: Perfil e Personalizacao

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 2/3 (67%) |
| Stories Canceladas | 1 (5.2 - Toggle de tema) |
| Testes Criados | 19 (7 getInitials + 7 UserAvatar + 4 LogoutButton + 1 null safety) |
| Total Acumulado | 117 testes passando |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 5.1 - Tela de Perfil com Avatar e Informacoes — **done**
2. 5.2 - Toggle de Tema Escuro e Claro — **cancelled** (decisao do usuario)
3. 5.3 - Desktop Phone Frame com Guia do Aluno — **done**

---

## O Que Deu Certo

1. **Story 5.1 implementada rapidamente** — getInitials(), UserAvatar, ProfilePage, LogoutButton, menu de configuracoes. Tudo em um ciclo. Build ok na primeira tentativa.

2. **Reutilizacao de Server Actions existentes** — logout() de src/actions/auth.ts reutilizado sem modificacao. getSession() da Epic 1 pronto para uso.

3. **Semantic HTML completo** — h1 sr-only, h2 para secoes, sections com aria-label, role="img" no avatar. Touch targets >= 48px em todos os items.

4. **Code review encontrou issues reais** — Cores hardcoded substituidas por CSS variables. "use client" desnecessario removido do LogoutButton. Story 5.2 com tasks falsamente marcadas como completas.

5. **LogoutButton como Server Component** — form action={logout} funciona sem "use client". Menos JavaScript no client.

6. **Story 5.3 — Phone frame no desktop** — CSS `transform: translateZ(0)` cria containing block que contem todos os elementos `fixed` (BottomNav, FAB, BottomSheet) dentro do frame do celular. Solucao elegante sem mudar nenhum componente existente.

7. **Categorias separadas por tipo** — Despesas e receitas com categorias diferentes. Auto-migration para contas existentes no layout do app.

8. **Cor do saldo intuitiva** — Verde quando positivo, vermelho quando negativo. Simples e claro.

---

## O Que Pode Melhorar

1. **Story 5.2 implementada e depois revertida** — Tempo gasto implementando ThemeToggle, anti-FOUC, CSS transitions que depois foram removidos. Poderia ter sido evitado com alinhamento antes de implementar.

2. **CSS variables vs cores hardcoded** — Pagina de perfil usava text-zinc-100, bg-zinc-800 diretamente. Corrigido no code review.

3. **Phone frame exigiu varios ajustes** — Posicionamento do FAB (right calc negativo), BottomSheet (h-[85vh] muito grande), BottomNav (fixed fora do frame), scrollbar branco. Cada um foi um fix separado. Testes em desktop deveriam ter sido feitos antes de marcar como done.

4. **Categorias de receita nao apareciam** — Contas existentes nao tinham as novas categorias. Precisou de auto-migration no layout. Schema change (campo type) sem migration formal.

5. **Semaforo do hero card confuso** — Logica original (baseada em % da renda) mostrava vermelho com saldo positivo. Simplificado para verde/vermelho baseado em positivo/negativo.

---

## Licoes Aprendidas

1. **Alinhar com o usuario ANTES de implementar** features opcionais — evita retrabalho
2. **CSS `transform` cria containing block** para elementos `fixed` — util para phone frames e modais contidos
3. **Testar em TODOS os breakpoints** antes de marcar done — desktop e mobile
4. **Auto-migration de dados** e necessaria quando schema muda e ha dados existentes
5. **Simplicidade > complexidade** na UX — saldo verde/vermelho e mais intuitivo que semaforo com 3 niveis
6. **Code review deve verificar git reality** vs story claims
7. **Limpar artefatos de features canceladas** imediatamente

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| .light CSS variables em globals.css sem uso | Baixa | Pode ser removido se dark-only permanente |
| Auto-migration de categorias no layout (query extra) | Baixa | Roda apenas uma vez por usuario |
| Sem migration formal do Prisma (usando db push) | Baixa | Aceitavel para MVP |

---

## Visao Geral do Projeto

Com a Epic 5 concluida, o MVP do MeuDinheiro esta completo:

| Epic | Status | Stories |
|------|--------|---------|
| Epic 1: Fundacao e Autenticacao | Done | 4/4 |
| Epic 2: Dashboard e Visualizacao | Done | 3/3 |
| Epic 3: Registro de Transacoes | Done | 3/3 |
| Epic 4: Historico e Gestao | Done | 2/2 |
| Epic 5: Perfil e Personalizacao | Done (1 cancelada) | 2/3 |

**Total: 14 stories done, 1 cancelled, 117 testes, 0 incidentes**

---

## Acordos do Time

1. Sempre usar CSS variables ao inves de cores Tailwind hardcoded
2. Alinhar features opcionais com o usuario antes de implementar
3. Code review deve cross-check git diff vs story file claims
4. Testar em desktop E mobile antes de marcar done
5. Remover artefatos de features canceladas imediatamente
