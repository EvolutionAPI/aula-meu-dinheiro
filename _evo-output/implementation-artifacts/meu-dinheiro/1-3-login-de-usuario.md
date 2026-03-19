# Story 1.3: Login de Usuario

**Status:** done

**Depends on:** Story 1.1 (schema, tipos, tema), Story 1.2 (Server Actions auth, JWT functions, layout (auth))

---

## Story

As a usuario existente,
I want fazer login com meu email e senha,
So that eu acesse meus dados financeiros de forma segura.

---

## Acceptance Criteria

1. **Given** o usuario esta na tela de login (/login) **When** ele preenche email e senha validos e submete **Then** o sistema valida com zod, busca o usuario, compara o hash da senha com bcryptjs **And** um JWT e gerado com jose (edge-compatible) e salvo em httpOnly cookie **And** o usuario e redirecionado para o dashboard (/)

2. **Given** email ou senha incorretos **When** o usuario submete o formulario **Then** uma mensagem generica "Email ou senha incorretos" e exibida (sem revelar qual esta errado) **And** nenhum JWT e gerado

3. **Given** a tela de login **When** renderizada **Then** usa layout (auth) centralizado, dark mode **And** campos email e senha com toggle show/hide no campo de senha **And** botao primary "Entrar" emerald-500 **And** link "Criar conta" para /register

---

## Tasks / Subtasks

- [x] Task 1 (AC: #3) Criar pagina de login
  - [x] 1.1 Criar src/app/(auth)/login/page.tsx
  - [x] 1.2 Formulario com campos email e senha (toggle show/hide)
  - [x] 1.3 react-hook-form + zod para validacao client-side
  - [x] 1.4 Zod schema: email (email valido), password (min 1 — nao revelar regras de senha no login)
  - [x] 1.5 Botao "Entrar" emerald-500, full-width, h-12
  - [x] 1.6 Link "Criar conta" apontando para /register
  - [x] 1.7 Erro generico "Email ou senha incorretos" (NAO indicar qual campo esta errado)
- [x] Task 2 (AC: #1, #2) Criar Server Action de login
  - [x] 2.1 Adicionar funcao login() em src/actions/auth.ts
  - [x] 2.2 Validar com zod server-side
  - [x] 2.3 Buscar user por email
  - [x] 2.4 Comparar senha com bcryptjs.compare()
  - [x] 2.5 Se invalido: retornar { success: false, error: "Email ou senha incorretos" }
  - [x] 2.6 Se valido: gerar JWT com jose (createToken), set httpOnly cookie, retornar { success: true }
  - [x] 2.7 Client faz redirect("/") apos sucesso
- [x] Task 3 (AC: #1) Integrar loading state
  - [x] 3.1 Usar useTransition para loading state no botao
  - [x] 3.2 Botao disabled + spinner durante submit

---

## Dev Notes

### Architecture & Patterns
- REUTILIZAR funcoes de src/lib/auth.ts (createToken) e src/actions/auth.ts criados na Story 1.2
- NAO criar novas funcoes de JWT — usar as que ja existem
- Validacao server-side OBRIGATORIA — client-side e apenas UX
- Mensagem de erro GENERICA — nunca revelar se email existe ou se senha esta errada (seguranca)
- useTransition para loading state (Next.js pattern com Server Actions)
- Layout (auth) ja criado na Story 1.2 — reutilizar

### Login Flow
```
1. User preenche email + senha
2. Client valida com zod (basico — email valido, senha nao vazia)
3. Submit chama Server Action login()
4. Server Action:
   a. Valida com zod server-side
   b. Busca user por email (prisma.user.findUnique)
   c. Se nao encontrou: return { success: false, error: "Email ou senha incorretos" }
   d. Compara senha: bcryptjs.compare(password, user.password)
   e. Se nao bate: return { success: false, error: "Email ou senha incorretos" }
   f. Gera JWT: createToken({ userId: user.id, name: user.name, email: user.email })
   g. Set cookie httpOnly com o token
   h. Return { success: true }
5. Client: redirect("/")
```

### Security Patterns
- NUNCA retornar { error: "Email nao encontrado" } — isso revela se o email existe
- NUNCA retornar { error: "Senha incorreta" } — isso confirma que o email existe
- SEMPRE retornar a MESMA mensagem para qualquer erro de credenciais
- NUNCA logar senhas ou tokens em console.log
- bcryptjs.compare() ja e timing-safe (nao vulnerable a timing attacks)

### Visual Design (reutilizar pattern da Story 1.2)
- Background: zinc-950 (via layout auth)
- Inputs: bg zinc-800, border zinc-700, focus border-emerald-500
- Botao "Entrar": bg emerald-500, h-12, full-width, rounded-lg
- Toggle senha: icone eye/eye-off no campo de senha
- Erro: text red-400, body-sm, centralizado abaixo do form
- Link "Criar conta": text emerald-500, hover underline

### File Structure
```
src/app/(auth)/login/
└── page.tsx         # Tela de login (usa layout auth ja existente)

src/actions/auth.ts  # Adicionar funcao login() (arquivo ja existe da Story 1.2)
```

### CRITICO - Nao Fazer
- NAO criar novo layout auth — ja existe da Story 1.2
- NAO criar novas funcoes JWT — usar createToken() de src/lib/auth.ts
- NAO revelar em mensagens de erro se email existe ou se senha esta errada
- NAO usar API Routes — Server Action login()
- NAO esquecer useTransition para loading state

### References
- [Source: architecture.md#Authentication & Security] Auth flow, bcryptjs, JWT
- [Source: epics.md#Story 1.3] Acceptance criteria
- [Source: ux-design-specification.md#Form Patterns] Inputs, erros
- [Source: Story 1.2] Dependencia — layout auth, auth.ts, lib/auth.ts

---

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Nenhum issue encontrado

### Completion Notes List
- Pagina de login criada com formulario email/senha, toggle show/hide
- Server Action login() adicionada com mensagem generica de erro (seguranca)
- useTransition para loading state no botao
- Reutilizou layout auth, createToken, setSessionCookie da Story 1.2
- loginSchema adicionado em validations.ts

### File List
- src/app/(auth)/login/page.tsx (novo)
- src/actions/auth.ts (modificado — adicionado login())
- src/lib/validations.ts (modificado — adicionado loginSchema, LoginInput)
