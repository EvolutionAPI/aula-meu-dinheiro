# Story 2.3: Interface de Login e Logout

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como usuário cadastrado,
Quero fazer login com email e senha e poder sair da minha conta,
Para que meus dados sejam acessíveis apenas por mim.

## Acceptance Criteria

**AC1 — Formulário de login renderiza corretamente:**
Dado que acesso `/login` sem estar autenticado,
Quando a página carrega,
Então exibo um formulário com campos Email e Senha, link para cadastro, labels semânticos e contraste WCAG AA.

**AC2 — Login com credenciais corretas redireciona para dashboard:**
Dado que preencho email e senha corretos e submeto,
Quando a autenticação é validada no servidor,
Então sou redirecionado para `/dashboard` com sessão ativa e cookie httpOnly configurado.

**AC3 — Login com credenciais incorretas exibe erro genérico:**
Dado que preencho email ou senha incorretos e submeto,
Quando a validação falha no servidor,
Então erro inline é exibido indicando "Email ou senha inválidos" sem revelar qual campo está errado.

**AC4 — Campos vazios exibem erros inline client-side:**
Dado que submeto o formulário com campos vazios,
Quando a validação client-side executa,
Então erros inline aparecem antes de qualquer requisição ao servidor.

**AC5 — Logout limpa sessão e redireciona:**
Dado que estou autenticado no dashboard,
Quando clico em "Sair",
Então `POST /api/auth/logout` é chamado, o cookie é limpo, a sessão é deletada do banco e sou redirecionado para `/login`.

**AC6 — Pós-logout não permite acesso a rotas protegidas:**
Dado que faço logout e tento acessar `/dashboard` diretamente,
Quando o middleware verifica a sessão,
Então sou redirecionado para `/login` pois o cookie não existe mais.

**AC7 — Sessão persistente funciona por 7 dias:**
Dado que fecho o browser e reabro após menos de 7 dias,
Quando acesso a URL do app,
Então sou redirecionado automaticamente para `/dashboard` com sessão ainda ativa.

## Tasks / Subtasks

- [ ] Task 1: Criar `src/components/auth/LoginForm.tsx` — Client Component (AC: #1, #2, #3, #4)
  - [ ] Marcar como `'use client'`
  - [ ] Usar react-hook-form com `zodResolver(loginSchema)`
  - [ ] Configurar `mode: 'onBlur'` e `reValidateMode: 'onChange'`
  - [ ] 2 campos: Email (Input email), Senha (Input password)
  - [ ] Labels semânticos via `<Label htmlFor>` — NUNCA placeholder como label
  - [ ] Erros inline abaixo de cada campo
  - [ ] Botão submit: "Entrar" / "Entrando..." (disabled durante loading)
  - [ ] Erro de servidor: exibir "Email ou senha inválidos" como erro genérico (SEM revelar qual campo falhou)
  - [ ] `onSubmit`: chamar `POST /api/auth/login` via fetch, tratar sucesso (redirect) e erro (exibir inline)
  - [ ] Link para `/register` ("Não tem conta? Criar conta")
- [ ] Task 2: Criar/atualizar `src/app/(auth)/login/page.tsx` — Server Component (AC: #1)
  - [ ] Renderizar o `LoginForm` dentro de layout centralizado (mesmo estilo visual do RegisterForm)
  - [ ] Exibir logo/nome "MeuDinheiro" acima do formulário
  - [ ] Layout: card centralizado na tela, fundo `bg-slate-50`
- [ ] Task 3: Criar `src/components/shared/AppHeader.tsx` — componente de header (AC: #5)
  - [ ] Logo "MeuDinheiro" à esquerda, clicável → `/dashboard`
  - [ ] Saudação "Olá, {nome}" (receber como prop)
  - [ ] Botão "Sair" à direita — Ghost variant
  - [ ] `sticky top-0 z-50 bg-white border-b border-slate-200`
  - [ ] Responsivo: saudação `hidden sm:flex` em mobile
- [ ] Task 4: Criar/atualizar `src/app/(app)/layout.tsx` — Layout autenticado (AC: #5)
  - [ ] Importar e renderizar `AppHeader` com dados do usuário da sessão
  - [ ] Buscar sessão no servidor via `getSession` + dados do usuário
  - [ ] Renderizar `{children}` abaixo do header
- [ ] Task 5: Implementar lógica de logout no AppHeader (AC: #5, #6)
  - [ ] Botão "Sair" chama `POST /api/auth/logout` via fetch
  - [ ] Após sucesso: `router.push('/login')`
  - [ ] O AppHeader ou o botão de logout deve ser Client Component (ou extrair LogoutButton como Client Component)
- [ ] Task 6: Verificação de integração (AC: #2, #5, #6, #7)
  - [ ] Testar `npm run dev` sem erros
  - [ ] Testar `npm run lint` sem erros

## Dev Notes

### API Routes Já Existentes (Story 2.1)

As API Routes de autenticação já foram implementadas na Story 2.1:

```typescript
// Login
POST /api/auth/login
Body: { email: string, password: string }
// Sucesso: 200 { success: true } + cookie sessionId setado
// Erro credenciais: 401 { success: false, error: { message: "Email ou senha inválidos" } }
// Dados inválidos: 400 { success: false, error: { message: "..." } }

// Logout
POST /api/auth/logout
// Sucesso: 200 { success: true } + cookie sessionId limpo
```

### Schema Zod de Login (reutilizar da Story 2.1)

```typescript
// src/lib/validations/auth.ts (já existe)
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})
```

### Padrão de Submit — LoginForm

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)
const [serverError, setServerError] = useState<string | null>(null)

async function onSubmit(data: z.infer<typeof loginSchema>) {
  setIsSubmitting(true)
  setServerError(null)
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) {
      router.push('/dashboard')
    } else {
      // Erro genérico — NÃO revelar se é email ou senha
      setServerError('Email ou senha inválidos')
    }
  } catch {
    setServerError('Erro de conexão. Tente novamente.')
  } finally {
    setIsSubmitting(false)
  }
}
```

### Layout Visual da Página de Login (UX Spec)

```
+-----------------------------------------------------+
|                                                     |
|                                                     |
|              [Logo MeuDinheiro]                     |
|                                                     |
|         +-------------------------------+           |
|         | Entrar                        |           |
|         |                               |           |
|         | Email                         |           |
|         | [___________________________] |           |
|         |                               |           |
|         | Senha                         |           |
|         | [___________________________] |           |
|         |                               |           |
|         | [======= Entrar ============] |  <- verde bg-green-600
|         |                               |           |
|         | Nao tem conta? Criar conta    |  <- link /register
|         +-------------------------------+           |
|                                                     |
+-----------------------------------------------------+
Background: bg-slate-50 (#F8FAFC)
Card: bg-white, shadow-sm, rounded-xl (--radius: 0.75rem)
```

**IMPORTANTE:** O layout do login DEVE ser visualmente idêntico ao do cadastro (Story 2.2) — mesma largura de card, mesmo estilo, mesmo posicionamento. Considerar extrair um componente `AuthLayout` compartilhado se o padrão for idêntico.

### AppHeader — Layout do Dashboard

```
+-----------------------------------------------------+
| [Logo MeuDinheiro]              Ola, Lucas    [Sair] |
+-----------------------------------------------------+
```

- Logo: texto "MeuDinheiro" ou SVG, link para `/dashboard`
- Saudação: `text-sm text-slate-600` — "Olá, {nome}"
- Botão Sair: `variant="ghost"` — `text-slate-600 hover:bg-slate-100`
- Altura: `h-16` (64px)
- Sticky: `sticky top-0 z-50`
- Background: `bg-white border-b border-slate-200`

### Decisão Arquitetural: AppHeader e Logout

O `AppHeader` é renderizado no `(app)/layout.tsx` (Server Component). Porém, o botão "Sair" precisa chamar uma API e fazer redirect — isso requer interatividade de Client Component.

**Duas abordagens válidas:**

1. **AppHeader como Server Component + LogoutButton como Client Component:**
   ```typescript
   // AppHeader.tsx — Server Component
   export function AppHeader({ userName }: { userName: string }) {
     return (
       <header>
         <span>MeuDinheiro</span>
         <span>Olá, {userName}</span>
         <LogoutButton />
       </header>
     )
   }

   // LogoutButton.tsx — 'use client'
   export function LogoutButton() { ... }
   ```

2. **AppHeader inteiro como Client Component** (mais simples, OK para MVP)

Ambas são válidas. A opção 1 é mais alinhada com a arquitetura mas a opção 2 é mais simples.

### Buscar Nome do Usuário no Layout

O `(app)/layout.tsx` é um Server Component que pode acessar o banco:

```typescript
// src/app/(app)/layout.tsx
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function AppLayout({ children }) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('sessionId')?.value

  if (!sessionId) redirect('/login')

  const session = await getSession(sessionId)
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true }
  })

  return (
    <>
      <AppHeader userName={user?.name || 'Usuário'} />
      <main>{children}</main>
    </>
  )
}
```

**NOTA:** O middleware já protege as rotas, mas a verificação no layout é uma camada extra de segurança e permite buscar dados do usuário.

### UX — Decisões de Design Obrigatórias

- **Botão "Entrar"**: `bg-green-600 text-white hover:bg-green-700` (mesmo estilo do "Criar conta")
- **Erro de credenciais**: SEMPRE "Email ou senha inválidos" — NUNCA revelar se o email existe ou não
- **Validação client-side**: `mode: 'onBlur'` — erro aparece ao sair do campo, não enquanto digita
- **Loading state**: botão muda para "Entrando..." e fica `disabled` durante a requisição
- **Focus visible**: `focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2`
- **Link para cadastro**: abaixo do botão, `text-sm text-green-600 hover:text-green-700`
- **Logout**: ação imediata, sem modal de confirmação

### Acessibilidade — Requisitos Obrigatórios

- Cada `<input>` deve ter `<label>` associado via `htmlFor`/`id`
- `aria-required="true"` nos campos obrigatórios
- Erros com `aria-describedby` (shadcn/ui Form faz automaticamente)
- Tab order no login: Email → Senha → Botão "Entrar" → Link "Não tem conta?"
- Tab order no header: Logo → Saudação → Botão "Sair"
- Enter submete o formulário
- Botão "Sair" com `aria-label="Sair da conta"` se for icon-only

### Convenções de Código

- Arquivos de componente: PascalCase → `LoginForm.tsx`, `AppHeader.tsx`, `LogoutButton.tsx`
- Arquivo de página: `page.tsx`, `layout.tsx` (Next.js convention)
- Funções: camelCase → `onSubmit`, `handleLogout`
- Import alias: `@/*` para imports absolutos a partir de `src/`
- `'use client'` APENAS nos Client Components (LoginForm, LogoutButton), NÃO nas pages/layouts

### Erros Comuns a Evitar

- NÃO usar `useRouter` do `next/router` — usar `next/navigation`
- NÃO usar `redirect()` do Next.js no Client Component — usar `router.push()`
- NÃO revelar se um email existe ou não na mensagem de erro de login
- NÃO esquecer de limpar o estado de erro quando o usuário começa a digitar novamente
- NÃO esquecer o `router.refresh()` após o logout para limpar cache do Next.js
- NÃO fazer o AppHeader inteiro ser Client Component sem necessidade — extrair LogoutButton
- NÃO esquecer que `cookies()` no Next.js 16 é assíncrono (`await cookies()`)
- NÃO usar `getSession` diretamente em Client Components — apenas em Server Components/API Routes

### Estrutura de Arquivos a Criar/Modificar

**Criar:**
- `src/components/auth/LoginForm.tsx` — Client Component com formulário de login
- `src/components/shared/AppHeader.tsx` — Header do app autenticado
- `src/components/shared/LogoutButton.tsx` — Client Component para botão de logout (se optar por opção 1)

**Modificar:**
- `src/app/(auth)/login/page.tsx` — já existe como placeholder, atualizar com layout real
- `src/app/(app)/layout.tsx` — criar/atualizar com AppHeader e dados do usuário

**Já existentes (NÃO recriar):**
- `src/lib/validations/auth.ts` — loginSchema (criado na Story 2.1)
- `src/app/api/auth/login/route.ts` — API Route de login (criado na Story 2.1)
- `src/app/api/auth/logout/route.ts` — API Route de logout (criado na Story 2.1)
- `src/middleware.ts` — proteção de rotas (criado na Story 2.1)
- `src/lib/auth.ts` — getSession, etc. (criado na Story 2.1)
- `src/lib/db.ts` — Prisma Client singleton (criado na Story 2.1)

### Learnings das Stories Anteriores

- Prisma 7 usa `prisma.config.ts` com `dotenv/config` — NÃO adicionar `url` no schema.prisma
- O middleware pode rodar em Node.js runtime
- `.env.local` tem `DATABASE_URL="file:./prisma/dev.db"`
- `src/lib/validations/auth.ts` já existe com loginSchema e registerSchema
- `cookies()` no Next.js 16 é assíncrono — usar `await cookies()`
- Lint script é `next lint` (não `eslint`)
- A API de register já cria sessão + seta cookie — o client só precisa redirect

### Project Structure Notes

- Esta story completa o Epic 2 (Autenticação e Sessão de Usuário)
- O AppHeader criado aqui será reutilizado por todas as stories dos Epics 3 e 4
- O layout `(app)/layout.tsx` criado aqui é a base para o dashboard (Epic 4)
- Após esta story, o fluxo completo funciona: cadastro → login → dashboard (vazio) → logout

### References

- Requisitos da Story 2.3: [Source: _evo-output/planning-artifacts/setup-mvp/epics.md#Story 2.3]
- Layout de login: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Jornada 1]
- AppHeader: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Navigation Patterns]
- Button hierarchy: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Button Hierarchy]
- Acessibilidade: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Accessibility Strategy]
- Autenticação: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#2. Autenticação e Segurança]
- Frontend architecture: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#4. Arquitetura Frontend]
- Story 2.1: [Source: _evo-output/implementation-artifacts/setup-mvp/2-1-infraestrutura-de-autenticacao-e-protecao-de-rotas.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
