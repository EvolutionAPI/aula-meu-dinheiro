# Story 1.2: Cadastro de Usuario com Onboarding

**Status:** ready-for-dev

**Depende de:** Story 1.1 (schema, tipos, utilitarios, tema)

---

## Story

As a novo usuario,
I want criar minha conta com email e senha e informar minha renda mensal,
So that eu tenha acesso ao app com minhas categorias prontas para usar.

---

## Acceptance Criteria

### AC #1 — Cadastro com validacao
**Given** o usuario esta na tela de cadastro (/register)
**When** ele preenche email, senha, nome e submete o formulario
**Then** o sistema valida os campos com zod (email valido, senha min 6 chars, nome obrigatorio)
**And** a senha e armazenada com hash bcryptjs (salt rounds >= 10)
**And** o usuario e criado no banco de dados
**And** NFR9, NFR11 sao atendidos

### AC #2 — Onboarding com renda mensal e categorias
**Given** o usuario acabou de criar a conta
**When** a tela de onboarding e exibida pedindo a renda mensal
**Then** o usuario pode digitar sua renda mensal
**And** ao confirmar, o campo monthlyIncome e salvo no User
**And** as 7 categorias pre-definidas sao criadas automaticamente para o usuario (FR5)
**And** um JWT e gerado e salvo em httpOnly cookie
**And** o usuario e redirecionado para o dashboard (/)

### AC #3 — Tratamento de erros
**Given** o formulario de cadastro com dados invalidos
**When** o usuario submete email ja cadastrado ou campos vazios
**Then** mensagens de erro aparecem inline abaixo dos campos
**And** nenhum dado e salvo no banco
**And** senhas nunca sao retornadas em responses (NFR12)

### AC #4 — Layout e estilo visual
**Given** a tela de cadastro
**When** renderizada
**Then** usa layout (auth) centralizado, sem nav
**And** estilo dark com inputs zinc-800, border zinc-700, focus ring emerald-500
**And** botao primary "Criar conta" emerald-500, h-12, touch target >= 48px (NFR16)
**And** link "Ja tenho conta" para /login

---

## Tasks / Subtasks

- [ ] **Task 1** (AC: #4) Criar layout do grupo (auth)
  - [ ] 1.1 Criar `src/app/(auth)/layout.tsx` — layout centralizado, sem bottom nav, fundo zinc-950
  - [ ] 1.2 Centralizar conteudo vertical e horizontalmente, max-width 400px, padding 24px

- [ ] **Task 2** (AC: #1, #3, #4) Criar pagina de cadastro
  - [ ] 2.1 Criar `src/app/(auth)/register/page.tsx` com formulario de cadastro
  - [ ] 2.2 Campos: nome (text), email (email), senha (password com toggle show/hide)
  - [ ] 2.3 Usar react-hook-form + zod para validacao client-side
  - [ ] 2.4 Zod schema: name (min 1), email (email valido), password (min 6 chars)
  - [ ] 2.5 Botao "Criar conta" emerald-500, full-width, h-12
  - [ ] 2.6 Link "Ja tenho conta" apontando para /login
  - [ ] 2.7 Erros inline abaixo de cada campo (text red-400, body-sm)

- [ ] **Task 3** (AC: #1, #2) Criar Server Action de registro
  - [ ] 3.1 Criar `src/actions/auth.ts` com funcao register
  - [ ] 3.2 Validar dados com zod server-side (NUNCA confiar no client)
  - [ ] 3.3 Verificar se email ja existe no banco
  - [ ] 3.4 Hash da senha com bcryptjs (SALT_ROUNDS = 10)
  - [ ] 3.5 Criar user no banco (sem monthlyIncome inicialmente — sera preenchido no onboarding)
  - [ ] 3.6 Retornar `ActionResponse<{ userId: string }>`

- [ ] **Task 4** (AC: #2) Criar tela de onboarding (renda mensal)
  - [ ] 4.1 Criar `src/app/(auth)/register/onboarding/page.tsx` OU usar state na mesma pagina de registro (step 2)
  - [ ] 4.2 Campo de renda mensal com formatacao monetaria (R$)
  - [ ] 4.3 Botao "Continuar" emerald-500
  - [ ] 4.4 Ao confirmar: salvar monthlyIncome no User, criar 7 categorias (DEFAULT_CATEGORIES de constants.ts), gerar JWT com jose, salvar em httpOnly cookie, redirect para /

- [ ] **Task 5** (AC: #2) Criar funcoes JWT
  - [ ] 5.1 Criar `src/lib/auth.ts` com createToken(userId) — gera JWT usando jose
  - [ ] 5.2 Criar verifyToken(token) — verifica e decodifica JWT
  - [ ] 5.3 Criar getSession() — le cookie, verifica token, retorna Session ou null
  - [ ] 5.4 JWT_SECRET vem de `process.env.JWT_SECRET` (definido em .env.local)
  - [ ] 5.5 Cookie config: httpOnly, secure (prod), sameSite lax, path /, maxAge 7 dias

---

## Dev Notes

### Architecture & Patterns
- Server Actions em `src/actions/auth.ts` com `"use server"` no topo do arquivo
- Retornar `ActionResponse<T>` de TODAS as Server Actions
- Validacao DUPLA: zod no client (react-hook-form) E no server (Server Action)
- NUNCA retornar senha ou dados sensiveis em responses
- jose para JWT (edge-compatible, funciona no middleware Next.js)
- Cookie httpOnly — NAO usar localStorage para auth
- Layout (auth) e um route group separado — NAO tem bottom nav nem FAB
- O registro pode ser 2 steps na mesma pagina (step 1: dados, step 2: renda) OU paginas separadas — preferir 2 steps na mesma pagina para simplificar

### Auth Flow Pattern
```
1. User preenche nome + email + senha
2. Client valida com zod (react-hook-form)
3. Submit chama Server Action register()
4. Server Action:
   a. Valida com zod (server-side)
   b. Checa email duplicado
   c. Hash senha com bcryptjs
   d. Cria user (monthlyIncome = 0 temporariamente)
   e. Retorna { success: true, data: { userId } }
5. Client mostra step 2 (onboarding renda)
6. User digita renda e confirma
7. Server Action updateMonthlyIncome():
   a. Salva monthlyIncome
   b. Cria 7 categorias (DEFAULT_CATEGORIES)
   c. Gera JWT com jose
   d. Set cookie httpOnly
   e. Retorna { success: true }
8. Client faz redirect("/")
```

### Zod Schemas
```typescript
// Shared entre client e server
const registerSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Senha deve ter no minimo 6 caracteres"),
})

const onboardingSchema = z.object({
  monthlyIncome: z.number().positive("Renda deve ser maior que zero"),
})
```

### JWT Pattern com jose
```typescript
// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createToken(payload: { userId: string, name: string, email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as Session
  } catch { return null }
}
```

### Visual Design
- Background: zinc-950
- Card/container: transparent ou zinc-900 sutil
- Inputs: bg zinc-800, border zinc-700, focus border-emerald-500, focus ring emerald-500/20
- Labels: zinc-400, body-sm
- Botao primary: bg emerald-500, hover emerald-600, text white, h-12, rounded-lg, font-semibold
- Erros: text red-400, body-sm, abaixo do input
- Link: text emerald-500, hover underline
- Touch targets: todos >= 48px (h-12 = 48px)
- Toggle show/hide senha: icone eye/eye-off a direita do input

### File Structure
```
src/
├── app/(auth)/
│   ├── layout.tsx           # Layout centralizado, sem nav
│   └── register/
│       └── page.tsx         # Cadastro + onboarding (2 steps)
├── actions/
│   └── auth.ts              # register(), updateMonthlyIncome()
├── lib/
│   └── auth.ts              # createToken(), verifyToken(), getSession()
```

### CRITICO - Nao Fazer
- NAO usar API Routes — Server Actions apenas
- NAO usar localStorage para auth — httpOnly cookie apenas
- NAO retornar senha em nenhuma response
- NAO criar rota /api/auth/* — usar Server Actions
- NAO esquecer validacao server-side (zod) — NUNCA confiar no client
- NAO criar user com monthlyIncome obrigatorio no primeiro step (pode ser 0 ou nullable temporariamente)

### References
- [Source: architecture.md#Authentication & Security] Fluxo de auth, JWT, bcryptjs
- [Source: architecture.md#API & Communication Patterns] Server Actions pattern
- [Source: architecture.md#Implementation Patterns] Naming, ActionResponse
- [Source: epics.md#Story 1.2] Acceptance criteria completos
- [Source: ux-design-specification.md#Form Patterns] Estilo de inputs e erros
- [Source: ux-design-specification.md#Journey 1] Fluxo de onboarding

---

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
