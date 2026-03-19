# Retrospectiva - Epic 5: Perfil e Personalizacao

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 1/2 (50%) |
| Stories Canceladas | 1 (5.2 - Toggle de tema) |
| Testes Criados | 19 (7 getInitials + 7 UserAvatar + 4 LogoutButton + 1 null safety) |
| Total Acumulado | 117 testes passando |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 5.1 - Tela de Perfil com Avatar e Informacoes — **done**
2. 5.2 - Toggle de Tema Escuro e Claro — **cancelled** (decisao do usuario)

---

## O Que Deu Certo

1. **Story 5.1 implementada rapidamente** — getInitials(), UserAvatar, ProfilePage, LogoutButton, menu de configuracoes. Tudo em um ciclo. Build ok na primeira tentativa.

2. **Reutilizacao de Server Actions existentes** — logout() de src/actions/auth.ts reutilizado sem modificacao. getSession() da Epic 1 pronto para uso.

3. **Semantic HTML completo** — h1 sr-only, h2 para secoes, sections com aria-label, role="img" no avatar. Touch targets >= 48px em todos os items.

4. **Code review encontrou issues reais** — Cores hardcoded substituidas por CSS variables (text-foreground, bg-card, divide-border). "use client" desnecessario removido do LogoutButton. Story 5.2 com tasks falsamente marcadas como completas.

5. **LogoutButton como Server Component** — form action={logout} funciona sem "use client". Menos JavaScript no client.

6. **Decisao rapida do usuario sobre tema** — Davidson decidiu manter dark-only. Implementacao revertida limpa, sem codigo morto.

---

## O Que Pode Melhorar

1. **Story 5.2 implementada e depois revertida** — Tempo gasto implementando ThemeToggle, anti-FOUC, CSS transitions que depois foram removidos. Poderia ter sido evitado com alinhamento antes de implementar.

2. **CSS variables vs cores hardcoded** — Pagina de perfil usava text-zinc-100, bg-zinc-800 diretamente ao inves de text-foreground, bg-card. Corrigido no code review, mas deveria ser padrao desde o inicio.

3. **switch.tsx orfao** — Componente shadcn instalado para Story 5.2 ficou sem uso apos cancelamento. Removido no code review.

4. **Story file com tasks falsamente marcadas** — Story 5.2 tinha todas as tasks [x] mas o codigo foi deletado. Code review detectou e corrigiu para status "cancelled".

---

## Licoes Aprendidas

1. **Alinhar com o usuario ANTES de implementar** features opcionais — evita retrabalho
2. **Usar CSS variables sempre** (text-foreground, bg-card) ao inves de cores hardcoded (text-zinc-100, bg-zinc-800) — prepara para temas futuros
3. **form action={serverAction} nao precisa de "use client"** — formularios HTML nativos funcionam sem JavaScript
4. **Code review deve verificar git reality vs story claims** — tasks marcadas como completas devem ter evidencia no codigo
5. **Limpar artefatos de features canceladas** — componentes, testes e dependencias orfas devem ser removidos

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| .light CSS variables em globals.css sem uso | Baixa | Pode ser removido se dark-only permanente |
| FR24 (toggle de tema) nao implementado | N/A | Cancelado por decisao do usuario |

---

## Visao Geral do Projeto

Com a Epic 5 concluida, o MVP do MeuDinheiro esta completo:

| Epic | Status | Stories |
|------|--------|---------|
| Epic 1: Fundacao e Autenticacao | Done | 4/4 |
| Epic 2: Dashboard e Visualizacao | Done | 3/3 |
| Epic 3: Registro de Transacoes | Done | 3/3 |
| Epic 4: Historico e Gestao | Done | 2/2 |
| Epic 5: Perfil e Personalizacao | Done (1 cancelada) | 1/2 |

**Total: 13 stories done, 1 cancelled, 117 testes, 0 incidentes**

---

## Acordos do Time

1. Sempre usar CSS variables ao inves de cores Tailwind hardcoded
2. Alinhar features opcionais com o usuario antes de implementar
3. Code review deve cross-check git diff vs story file claims
4. Remover artefatos de features canceladas imediatamente
