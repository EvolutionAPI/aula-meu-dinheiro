# Story 1.4: Middleware de Autenticacao e Logout

> **Status:** ready-for-dev
> **Depends on:** Story 1.1 (schema, tipos), Story 1.2 (JWT functions, auth actions), Story 1.3 (login)

---

## Story

**As a** usuario autenticado,
**I want** que minhas rotas sejam protegidas e poder fazer logout,
**So that** meus dados financeiros estejam seguros e eu controle minha sessao.

---

## Acceptance Criteria

1. **Given** um usuario nao autenticado (sem JWT cookie valido) **When** ele tenta acessar qualquer rota do grupo (app) (/, /transactions, /profile) **Then** o middleware Next.js intercepta a request **And** redireciona para /login **And** NFR10 e atendido

2. **Given** um usuario autenticado (JWT cookie valido) **When** ele acessa rotas do grupo (app) **Then** o middleware permite o acesso **And** o userId e extraido do JWT para uso nos Server Components

3. **Given** um usuario autenticado em qualquer tela do app **When** ele clica em "Sair" (logout) **Then** o cookie JWT e limpo via Server Action **And** o usuario e redirecionado para /login

4. **Given** a funcao getSession em src/lib/auth.ts **When** chamada em Server Components ou Server Actions **Then** retorna o objeto Session com userId, name, email, monthlyIncome **And** retorna null se o JWT for invalido ou ausente

---

## Tasks / Subtasks

- [ ] **Task 1** (AC: #1, #2) Criar middleware Next.js
  - [ ] 1.1 Criar `src/middleware.ts`
  - [ ] 1.2 Definir rotas protegidas: matcher para /(app) routes (/, /transactions, /profile)
  - [ ] 1.3 Definir rotas publicas: /login, /register (nao interceptar)
  - [ ] 1.4 Ler cookie "token" da request
  - [ ] 1.5 Verificar JWT usando jose (`jwtVerify`) — DEVE funcionar em edge runtime
  - [ ] 1.6 Se invalido/ausente: redirect para /login
  - [ ] 1.7 Se valido: permitir acesso (`NextResponse.next()`)
  - [ ] 1.8 Redirecionar usuarios logados de /login e /register para /
- [ ] **Task 2** (AC: #4) Atualizar getSession para incluir monthlyIncome
  - [ ] 2.1 Garantir que `getSession()` em `src/lib/auth.ts` retorna Session completa
  - [ ] 2.2 Se JWT nao contem monthlyIncome: buscar no banco (`prisma.user.findUnique`)
  - [ ] 2.3 Retornar null se token invalido ou ausente
- [ ] **Task 3** (AC: #3) Criar Server Action de logout
  - [ ] 3.1 Adicionar funcao `logout()` em `src/actions/auth.ts`
  - [ ] 3.2 Limpar cookie "token" (set com maxAge 0 ou delete)
  - [ ] 3.3 Redirect para /login via `redirect()`

---

## Dev Notes

### Architecture & Patterns

- Middleware Next.js roda em **edge runtime** — DEVE usar `jose` (nao `jsonwebtoken` que precisa de Node.js)
- `jose` ja instalado e usado na Story 1.2
- Middleware intercepta ANTES de renderizar qualquer pagina
- Usar `config.matcher` para definir quais rotas o middleware intercepta
- `getSession()` e a funcao central de auth — usada por TODOS os Server Components e Server Actions
- O JWT pode nao conter `monthlyIncome` (nao estava no token original da Story 1.2). Duas opcoes:
  - a) Incluir `monthlyIncome` no payload do JWT na criacao (melhor — evita query extra)
  - b) Buscar no banco quando necessario (fallback)
  - **Recomendado:** opcao (a) — atualizar `createToken` na Story 1.2 para incluir `monthlyIncome`

### Middleware Pattern

```typescript
// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

const publicRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // Rotas publicas — permitir acesso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Se ja logado, redirecionar para /
    if (token) {
      try {
        await jwtVerify(token, secret)
        return NextResponse.redirect(new URL("/", request.url))
      } catch { /* token invalido, deixar acessar login */ }
    }
    return NextResponse.next()
  }

  // Rotas protegidas — verificar token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### Logout Pattern

```typescript
// Em src/actions/auth.ts
"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
  redirect("/login")
}
```

### Security Notes

- Middleware DEVE verificar token em CADA request (stateless)
- JWT invalido ou expirado = redirect para login (sem mensagem de erro)
- Logout limpa o cookie — nao precisa invalidar token no server (stateless JWT)
- `matcher` exclui `_next/static`, `_next/image` e `favicon.ico` (assets estaticos)

### File Structure

```
src/
├── middleware.ts              # Auth middleware (NOVO)
├── actions/auth.ts            # Adicionar logout() (arquivo ja existe)
└── lib/auth.ts                # Atualizar getSession() se necessario (arquivo ja existe)
```

### CRITICO - Nao Fazer

- NAO usar `jsonwebtoken` — usar `jose` (edge-compatible)
- NAO criar API Routes para auth — Server Actions apenas
- NAO esquecer de excluir assets estaticos do matcher
- NAO armazenar sessao em banco/Redis — JWT stateless
- NAO mostrar mensagem de erro ao redirecionar (silencioso)
- NAO esquecer de redirecionar usuarios logados de /login para /

### References

- [Source: architecture.md#Authentication & Security] Middleware, JWT, rotas publicas/protegidas
- [Source: architecture.md#Frontend Architecture] Route groups (auth) e (app)
- [Source: epics.md#Story 1.4] Acceptance criteria
- [Source: Story 1.2] Dependencia — createToken, getSession, cookie pattern

---

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
