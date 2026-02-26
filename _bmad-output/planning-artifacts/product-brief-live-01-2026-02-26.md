---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments: []
date: 2026-02-26
author: Davidson
---

# Product Brief: MeuDinheiro

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

MeuDinheiro é uma aplicação web de finanças pessoais simples, funcional e visualmente elegante. Permite que usuários registrem receitas e despesas, visualizem seu saldo e acompanhem seus gastos mensais através de um dashboard intuitivo. Desenvolvida com Next.js, Tailwind CSS e shadcn/ui, serve como projeto de demonstração do processo BMAD em live coding.

---

## Core Vision

### Problem Statement

Pessoas perdem o controle financeiro por falta de uma ferramenta simples e agradável para registrar e visualizar suas movimentações. As soluções existentes são complexas demais ou feias demais para uso no dia a dia.

### Problem Impact

Sem visibilidade financeira, usuários não sabem para onde vai seu dinheiro, acumulam dívidas sem perceber e não conseguem planejar gastos futuros.

### Why Existing Solutions Fall Short

Apps de finanças existentes são pesados, cheios de funcionalidades desnecessárias ou têm UX confusa. Para quem quer algo simples e rápido, a curva de aprendizado não vale o esforço.

### Proposed Solution

Aplicação web com autenticação simples (register/login), onde cada usuário gerencia suas próprias transações. Dashboard com 3 cards de resumo (saldo atual, receitas e despesas do mês) e lista das últimas 5 transações. Categorias fixas pré-definidas para receitas e despesas.

### Key Differentiators

- Interface bonita e moderna com shadcn/ui + Tailwind
- Simples o suficiente para ser entendido em minutos
- Fullstack em um projeto só (Next.js 14+)
- Desenvolvido ao vivo seguindo o processo BMAD completo

---

## Target Users

### Primary Users

**Lucas, 28 anos — Desenvolvedor Freelancer**

- Recebe pagamentos variáveis por projeto e paga contas fixas mensais
- Nunca sabe exatamente quanto sobra no final do mês
- Usa planilha do Google mas odeia manter atualizada
- Quer algo rápido para registrar uma despesa na hora que acontece
- Motivação: ter clareza financeira sem complexidade

### Secondary Users

N/A — aplicação individual, sem colaboração ou papéis administrativos.

### User Journey

1. **Descoberta:** Vê a live no YouTube e quer usar o projeto
2. **Onboarding:** Cria conta em 30 segundos (nome, email, senha)
3. **Uso diário:** Registra uma transação em menos de 1 minuto
4. **Momento de valor:** Dashboard mostra na hora o saldo real, receitas e despesas do mês
5. **Rotina:** Abre o app sempre que faz uma compra ou recebe um pagamento

---

## Success Metrics

### Sucesso do Usuário

- Usuário consegue se cadastrar e fazer login em menos de 1 minuto
- Usuário registra uma transação em menos de 30 segundos
- Dashboard exibe saldo, receitas e despesas atualizados imediatamente após registro
- Usuário entende o app sem precisar de tutorial ou documentação

### Business Objectives

- Demonstrar o fluxo completo do BMAD (brief → PRD → arquitetura → código) ao vivo
- Entregar um projeto funcional e visualmente apresentável ao final da live
- Servir como projeto de referência/template para a comunidade

### Key Performance Indicators

- 100% das funcionalidades do MVP funcionando ao final da live
- Tempo de cadastro + primeiro registro < 2 minutos
- Zero erros críticos durante a demonstração ao vivo
- Código gerado segue as decisões de arquitetura definidas no processo BMAD

---

## MVP Scope

### Core Features

**Autenticação**
- Cadastro com nome, email e senha
- Login com email e senha
- Logout
- Sessão persistente (não precisa logar toda vez)

**Transações**
- Registrar transação (tipo: receita ou despesa, valor, categoria, data, descrição opcional)
- Listar transações com scroll
- Excluir transação

**Dashboard**
- Card: Saldo atual (receitas - despesas do mês)
- Card: Total de receitas do mês
- Card: Total de despesas do mês
- Lista das últimas 5 transações

**Categorias Fixas**
- Receitas: Salário, Freelance, Outros
- Despesas: Alimentação, Transporte, Moradia, Saúde, Lazer, Outros

### Out of Scope for MVP

- Editar transação (só registrar e excluir)
- Filtros por período ou categoria
- Gráficos e charts
- Exportar dados (CSV, PDF)
- Notificações ou alertas
- Metas financeiras
- Categorias personalizadas
- Modo escuro
- App mobile

### MVP Success Criteria

- Todas as telas funcionando sem erros durante a live
- Fluxo completo: cadastro → login → registrar transação → ver no dashboard
- Interface visualmente apresentável e responsiva

### Future Vision

- Gráfico de gastos por categoria (pizza ou barras)
- Filtros por mês/período
- Edição de transações
- Relatório mensal por email
- Metas de economia por categoria
