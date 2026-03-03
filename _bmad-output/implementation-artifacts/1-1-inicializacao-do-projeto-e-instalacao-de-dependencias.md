# Story 1.1: Inicialização do Projeto e Instalação de Dependências

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como desenvolvedor,
Quero criar o projeto Next.js com toda a stack de dependências instalada e configurada,
Para ter a base tecnológica pronta para receber a implementação das funcionalidades.

## Acceptance Criteria

**AC1 — Projeto criado com create-next-app:**
Dado que o ambiente de desenvolvimento está preparado com Node.js e npm disponíveis,
Quando executo o comando `create-next-app@latest`,
Então o projeto é criado com TypeScript, Tailwind CSS, ESLint, App Router, diretório `src/`, alias `@/*` e sem Turbopack.

**AC2 — Dependências adicionais instaladas:**
Dado que o projeto base foi criado,
Quando instalo as dependências adicionais,
Então shadcn/ui (com `npx shadcn@latest init`), Prisma 7.2.0 + @prisma/client, bcryptjs 3.0.3 + @types/bcryptjs, Framer Motion, Sonner, react-hook-form, @hookform/resolvers e Zod estão instalados sem conflitos.

**AC3 — Aplicação sobe sem erros:**
Dado que todas as dependências estão instaladas,
Quando executo `npm run dev`,
Então a aplicação sobe sem erros na porta 3000 e a página inicial do Next.js é acessível no browser.

**AC4 — shadcn/ui inicializado corretamente:**
Dado que o shadcn/ui foi inicializado,
Quando verifico `components.json`,
Então o arquivo existe na raiz com a configuração gerada pelo `shadcn init`.

## Tasks / Subtasks

- [ ] Task 1: Criar o projeto Next.js com create-next-app (AC: #1)
  - [ ] Executar o comando `npx create-next-app@latest meudinheiro` com todas as flags corretas
  - [ ] Verificar que a estrutura base foi criada corretamente
  - [ ] Confirmar que `npm run dev` sobe sem erros na porta 3000

- [ ] Task 2: Inicializar shadcn/ui (AC: #2, #4)
  - [ ] Executar `npx shadcn@latest init` dentro do diretório do projeto
  - [ ] Confirmar que `components.json` foi criado na raiz
  - [ ] Confirmar que `globals.css` foi atualizado com as CSS variables do shadcn/ui

- [ ] Task 3: Instalar Prisma e configurar SQLite (AC: #2)
  - [ ] Executar `npm install prisma@7.2.0 @prisma/client`
  - [ ] Executar `npx prisma init --datasource-provider sqlite`
  - [ ] Confirmar que `prisma/schema.prisma` foi criado com o datasource para SQLite

- [ ] Task 4: Instalar dependências de autenticação e segurança (AC: #2)
  - [ ] Executar `npm install bcryptjs@3.0.3`
  - [ ] Executar `npm install --save-dev @types/bcryptjs`

- [ ] Task 5: Instalar dependências de UI e formulários (AC: #2)
  - [ ] Executar `npm install framer-motion`
  - [ ] Executar `npm install sonner`
  - [ ] Executar `npm install react-hook-form @hookform/resolvers zod`

- [ ] Task 6: Verificar integridade geral (AC: #3)
  - [ ] Executar `npm run dev` e confirmar que a aplicação sobe sem erros
  - [ ] Verificar que não há conflitos de dependências no `package.json`
  - [ ] Confirmar que `npm run lint` não reporta erros

## Dev Notes

### Comandos Exatos de Execução

**IMPORTANTE:** Os comandos abaixo devem ser executados EXATAMENTE como especificados. Não modificar flags.

```bash
# 1. Criar o projeto (executar fora do diretório do projeto)
npx create-next-app@latest meudinheiro \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack

# 2. Entrar no diretório
cd meudinheiro

# 3. Inicializar shadcn/ui
npx shadcn@latest init

# 4. Instalar Prisma
npm install prisma@7.2.0 @prisma/client
npx prisma init --datasource-provider sqlite

# 5. Instalar bcryptjs (pure JS — sem binários nativos, ideal para demo ao vivo)
npm install bcryptjs@3.0.3
npm install --save-dev @types/bcryptjs

# 6. Instalar animações
npm install framer-motion

# 7. Instalar toast
npm install sonner

# 8. Instalar formulários
npm install react-hook-form @hookform/resolvers zod
```

### Por que estas versões específicas?

- **Next.js 16.1.6** — versão estável em fev/2026, garantida pelo `create-next-app@latest`
- **Prisma 7.2.0** — versão estável em fev/2026, compatível com Next.js 16
- **bcryptjs 3.0.3** — pure JavaScript (sem binários nativos), zero problemas em demo ao vivo
- **shadcn/ui** — usar `npx shadcn@latest init` (sem versão fixa), pega a versão atual unificada de fev/2026
- **`--no-turbopack`** — estabilidade máxima para demo ao vivo (Turbopack ainda é experimental)

### Stack Completa Após Esta Story

| Pacote | Versão | Finalidade |
|--------|--------|-----------|
| next | ~16.1.6 | Framework fullstack |
| react | ~18+ | UI runtime |
| typescript | ~5+ | Tipagem estática |
| tailwindcss | ~3.4+ | Utiliy-first CSS |
| shadcn/ui | latest | Componentes UI (Radix) |
| prisma | 7.2.0 | ORM |
| @prisma/client | 7.2.0 | Cliente do banco |
| sqlite | embedded | Banco de dados |
| bcryptjs | 3.0.3 | Hash de senhas |
| framer-motion | latest | Animações 60fps |
| sonner | latest | Toast notifications |
| react-hook-form | latest | Formulários controlados |
| @hookform/resolvers | latest | Integração com Zod |
| zod | latest | Validação de schema |

### Estrutura que deve existir ao final desta story

```
meudinheiro/
├── components.json          # ← shadcn/ui config (deve existir)
├── package.json             # ← com todos os pacotes listados acima
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── prisma/
│   └── schema.prisma        # ← gerado pelo prisma init (datasource sqlite)
└── src/
    ├── app/
    │   ├── globals.css      # ← atualizado pelo shadcn init
    │   ├── layout.tsx
    │   └── page.tsx
    └── components/
        └── ui/              # ← pasta criada pelo shadcn init
```

### Localização do Projeto

**IMPORTANTE:** O comando `create-next-app` cria um NOVO diretório chamado `meudinheiro/`. Execute o comando no diretório pai onde deseja que o projeto fique. O projeto resultante é independente deste repositório BMAD.

### Configuração do shadcn/ui init

Quando `npx shadcn@latest init` perguntar sobre configurações, use:
- **Style:** Default
- **Base color:** Neutral
- **CSS variables:** Yes (para suporte a theming)

### Componentes shadcn/ui necessários para o projeto completo

A Story 1.2+ vai precisar desses componentes. Você pode instalá-los agora ou nas stories que os usam:
```bash
npx shadcn@latest add button card dialog form input label select skeleton sonner
```

### Armadilhas Comuns a Evitar

1. **NÃO usar Turbopack** — a flag `--no-turbopack` é obrigatória para estabilidade
2. **NÃO omitir `--src-dir`** — toda a arquitetura assume `src/` como raiz
3. **NÃO omitir `--import-alias "@/*"`** — todos os imports subsequentes usam este alias
4. **NÃO usar `prisma@latest`** — especificar `prisma@7.2.0` para garantir compatibilidade
5. **Usar `npx shadcn@latest init`** (não `shadcn-ui`) — a CLI mudou de nome
6. **NÃO commitar `.env.local`** — deve estar no `.gitignore` (o `create-next-app` já faz isso)
7. **NÃO commitar `prisma/dev.db`** — adicionar ao `.gitignore` manualmente

### Verificações ao Final

Após completar todos os tasks, confirmar:

```bash
# Aplicação sobe corretamente
npm run dev
# → Deve abrir em http://localhost:3000 sem erros no console

# Lint passa sem erros
npm run lint
# → Deve retornar "No ESLint warnings or errors"

# prisma schema existe
cat prisma/schema.prisma
# → Deve mostrar datasource db { provider = "sqlite" url = env("DATABASE_URL") }

# components.json existe
cat components.json
# → Deve mostrar configuração JSON do shadcn/ui
```

### Project Structure Notes

- Esta story cria o projeto `meudinheiro/` (subdiretório). As stories subsequentes trabalham dentro deste diretório.
- O `prisma/schema.prisma` gerado aqui é o template base — a Story 1.2 adiciona os models completos.
- O `src/` é o diretório raiz de código-fonte para toda a arquitetura do projeto.
- O `components.json` gerado pelo shadcn/ui não deve ser editado manualmente nas stories subsequentes.

### References

- Comando de inicialização: [Source: _bmad-output/planning-artifacts/architecture.md#Comando de Inicialização]
- Stack completa e versões: [Source: _bmad-output/planning-artifacts/architecture.md#Stack Definida]
- Justificativa `--no-turbopack`: [Source: _bmad-output/planning-artifacts/architecture.md#Tooling de Build]
- Estrutura de diretórios esperada: [Source: _bmad-output/planning-artifacts/architecture.md#Estrutura Completa de Diretórios]
- Decisão bcryptjs pure JS: [Source: _bmad-output/planning-artifacts/architecture.md#Hashing de Senhas]
- ACs originais: [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
