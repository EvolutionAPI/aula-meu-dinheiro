# Retrospectiva - Epic 3: Registro de Transacoes

**Data:** 2026-03-19
**Projeto:** MeuDinheiro (live-01)
**Facilitador:** Bob (Scrum Master)

---

## Resumo da Epic

| Metrica | Valor |
|---------|-------|
| Stories Completadas | 3/3 (100%) |
| Testes Criados | ~35 (19 FAB/BottomSheet + 29 Keypad/Category/Form + 6 createTransaction = ~54) |
| Incidentes em Producao | 0 |
| Divida Tecnica | Baixa |

**Stories:**
1. 3.1 - FAB e Bottom Sheet de Registro
2. 3.2 - Teclado Numerico e Selecao de Categoria
3. 3.3 - Submissao de Transacao e Feedback

---

## O Que Deu Certo

1. **Core loop implementado com sucesso** — Registro de transacao em menos de 10 segundos: FAB -> BottomSheet -> valor + categoria -> Registrar -> toast. Fluxo fluido e rapido.

2. **Abordagem cents-based para valores** — rawDigits como string evita problemas de floating point. formatCurrency formata no display. Max 9 digitos (R$ 9.999.999,99).

3. **Focus trap manual sem biblioteca externa** — Implementacao com useRef/useEffect no BottomSheet. Escape fecha, backdrop fecha, drag-to-dismiss no handle. Acessibilidade completa.

4. **Dynamic imports para otimizacao** — BottomSheet, NumericKeypad e CategoryGrid com dynamic import + ssr: false. Bundle otimizado.

5. **TransactionFabWrapper como pattern** — Client Component encapsulando FAB + BottomSheet + estado. Integrado no layout Server Component. Separacao limpa.

6. **useTransition para loading state** — Botao "Registrar" com pending state, spinner, disabled. UX profissional sem bloquear a UI.

7. **revalidatePath para cache invalidation** — Dashboard e pagina de transacoes atualizam automaticamente apos criar transacao.

---

## O Que Pode Melhorar

1. **Long-press no backspace** — Implementacao do long-press (500ms para limpar tudo) exigiu cuidado com setTimeout e cleanup. Poderia ser mais simples.

2. **Radio group semantics nas categorias** — role="radiogroup" e role="radio" manual ao inves de usar inputs nativos. Funciona, mas e mais codigo.

3. **Sonner Toaster configurado no layout root** — Hardcoded com estilos dark (zinc-800). Se o tema mudar, precisa ajustar.

---

## Licoes Aprendidas

1. **Cents-based e o caminho** para input monetario — evita floating point issues
2. **Dynamic import com named exports** requer `.then(m => m.ComponentName)` — nao e obvio
3. **Server Actions + revalidatePath** = cache invalidation automatica sem estado global
4. **useTransition > useState para loading** — nao bloqueia a UI durante a acao
5. **Focus trap manual e viavel** para projetos sem dependencia de radix/headless-ui

---

## Divida Tecnica

| Item | Prioridade | Status |
|------|-----------|--------|
| Toaster com estilos hardcoded dark | Baixa | Aceitavel para dark-mode-only |
| DEFAULT_CATEGORIES precisou de campo `id` adicionado | - | Corrigido na Story 3.2 |

---

## Preparacao para Epic 4

- Lista de transacoes vai reusar TransactionItem visual — parcialmente pronto
- deleteTransaction precisa do padrao Server Action + ActionResponse — definido
- Filtros por periodo precisam de date helpers — a criar
- Swipe-to-delete precisa de Framer Motion drag — ja instalado

---

## Acordos do Time

1. Testar interacoes tacteis (long-press, swipe) com cuidado em mobile real
2. Manter dynamic imports para componentes pesados
3. Sempre usar revalidatePath apos mutations que afetam multiplas paginas
