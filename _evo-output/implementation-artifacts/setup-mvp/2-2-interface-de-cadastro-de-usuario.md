# Story 2.2: Interface de Cadastro de Usuário

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como visitante,
Quero criar uma conta com nome, email e senha,
Para que eu possa acessar o MeuDinheiro e começar a registrar minhas transações.

## Acceptance Criteria

**AC1 — Formulário de cadastro renderiza corretamente:**
Dado que acesso `/register` sem estar autenticado,
Quando a página carrega,
Então exibo um formulário com campos: Nome, Email, Senha — com labels semânticos, foco visível e contraste WCAG AA.

**AC2 — Cadastro com dados válidos cria conta e inicia sessão:**
Dado que preencho nome, email e senha válidos e clico em "Criar conta",
Quando o formulário é submetido,
Então a requisição vai para `POST /api/auth/register`, a conta é criada, a sessão é iniciada e sou redirecionado para `/dashboard`.

**AC3 — Email duplicado exibe erro inline:**
Dado que tento criar conta com email já cadastrado,
Quando submeto o formulário,
Então erro inline é exibido informando que o email já está em uso, sem limpar os outros campos.

**AC4 — Campos obrigatórios vazios exibem erros inline:**
Dado que submeto o formulário com campos obrigatórios vazios,
Quando a validação é executada,
Então erros inline aparecem em cada campo faltante sem recarregar a página.

**AC5 — Senha curta exibe erro inline:**
Dado que submeto o formulário com senha muito curta (menos de 8 caracteres),
Quando a validação é executada,
Então erro inline informa o requisito mínimo de caracteres.

**AC6 — Loading state impede duplo envio:**
Dado que a requisição está sendo processada,
Quando aguardo a resposta,
Então o botão de submit está desabilitado com texto indicando carregamento, impedindo duplo envio.

## Tasks / Subtasks

- [ ] Task 1: Instalar componentes shadcn/ui necessários (AC: #1)
  - [ ] Executar `npx shadcn@latest add button card input label` (apenas os que ainda não existem)
- [ ] Task 2: Criar schema Zod de registro `src/lib/validations/auth.ts` se não existir (AC: #4, #5)
  - [ ] Verificar se `src/lib/validations/auth.ts` já foi criado pela Story 2.1
  - [ ] Se não existir: criar com `registerSchema` (name min 2, email válido, password min 8)
  - [ ] Se existir: confirmar que o schema está correto e reutilizar
- [ ] Task 3: Criar `src/components/auth/RegisterForm.tsx` — Client Component (AC: #1, #2, #3, #4, #5, #6)
  - [ ] Marcar como `'use client'`
  - [ ] Usar react-hook-form com `zodResolver(registerSchema)`
  - [ ] Configurar `mode: 'onBlur'` e `reValidateMode: 'onChange'`
  - [ ] 3 campos: Nome (Input text), Email (Input email), Senha (Input password)
  - [ ] Labels semânticos via `<Label htmlFor>` — NUNCA placeholder como label
  - [ ] `<FormMessage />` para erros inline abaixo de cada campo
  - [ ] Botão submit: "Criar conta" / "Criando conta..." (disabled durante loading)
  - [ ] `onSubmit`: chamar `POST /api/auth/register` via fetch, tratar sucesso (redirect) e erro (exibir inline)
  - [ ] Link para `/login` ("Já tem conta? Entrar")
- [ ] Task 4: Criar/atualizar `src/app/(auth)/register/page.tsx` — Server Component (AC: #1)
  - [ ] Renderizar o `RegisterForm` dentro de um layout centralizado
  - [ ] Exibir logo/nome "MeuDinheiro" acima do formulário
  - [ ] Layout: card centralizado na tela, fundo `bg-slate-50`
- [ ] Task 5: Verificação de integração (AC: #2, #6)
  - [ ] Testar `npm run dev` sem erros
  - [ ] Testar `npm run lint` sem erros

## Dev Notes

### Arquitetura de Componentes — Server vs Client

A `page.tsx` é um Server Component (renderização no servidor). O `RegisterForm.tsx` é um Client Component (`'use client'`) porque precisa de:
- react-hook-form (hooks de estado)
- Estado de loading do botão
- fetch para a API Route

### API Route Já Existente (Story 2.1)

A API Route `POST /api/auth/register` já foi implementada na Story 2.1. O `RegisterForm` deve consumir essa API:

```typescript
// Formato de request esperado:
POST /api/auth/register
Body: { name: string, email: string, password: string }

// Respostas:
// Sucesso: 201 { success: true }
// Email duplicado: 409 { success: false, error: { message: "..." } }
// Dados inválidos: 400 { success: false, error: { message: "..." } }
```

**Após sucesso:** A API Route já cria a sessão e seta o cookie `sessionId`. O client precisa apenas fazer `router.push('/dashboard')` usando `useRouter` do `next/navigation`.

### Schema Zod de Validação (reutilizar da Story 2.1)

```typescript
// src/lib/validations/auth.ts (provavelmente já existe)
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})
```

### Padrão de Formulário — react-hook-form + Zod

```typescript
// Padrão obrigatório para todos os formulários da aplicação
const form = useForm<z.infer<typeof registerSchema>>({
  resolver: zodResolver(registerSchema),
  mode: 'onBlur',           // Valida quando sai do campo
  reValidateMode: 'onChange', // Revalida em tempo real após primeiro erro
  defaultValues: {
    name: '',
    email: '',
    password: '',
  },
})
```

### Padrão de Submit com Loading State

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)
const [serverError, setServerError] = useState<string | null>(null)

async function onSubmit(data: z.infer<typeof registerSchema>) {
  setIsSubmitting(true)
  setServerError(null)
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (result.success) {
      router.push('/dashboard')
    } else {
      setServerError(result.error?.message || 'Erro ao criar conta')
    }
  } catch {
    setServerError('Erro de conexão. Tente novamente.')
  } finally {
    setIsSubmitting(false)
  }
}
```

### Layout Visual da Página de Cadastro (UX Spec)

```
+-----------------------------------------------------+
|                                                     |
|                                                     |
|              [Logo MeuDinheiro]                     |
|                                                     |
|         +-------------------------------+           |
|         | Criar conta                   |           |
|         |                               |           |
|         | Nome                          |           |
|         | [___________________________] |           |
|         |                               |           |
|         | Email                         |           |
|         | [___________________________] |           |
|         |                               |           |
|         | Senha                         |           |
|         | [___________________________] |           |
|         |                               |           |
|         | [===== Criar conta =========] |  <- verde bg-green-600
|         |                               |           |
|         | Ja tem conta? Entrar          |  <- link /login
|         +-------------------------------+           |
|                                                     |
+-----------------------------------------------------+
Background: bg-slate-50 (#F8FAFC)
Card: bg-white, shadow-sm, rounded-xl (--radius: 0.75rem)
```

### UX — Decisões de Design Obrigatórias

- **Botão "Criar conta"**: `bg-green-600 text-white hover:bg-green-700` (variante primary)
- **Validação**: `mode: 'onBlur'` — não marcar erro enquanto o usuário ainda digita pela primeira vez
- **Erro de servidor (email duplicado)**: exibir acima do botão de submit ou como erro genérico do formulário, SEM limpar campos
- **Labels sempre visíveis**: usar `<Label>` do shadcn/ui, NUNCA placeholder como substituto
- **Focus visible**: `focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2`
- **Contraste WCAG AA**: texto `#0F172A` sobre fundo `#FFFFFF` (ratio 19.6:1)
- **Tipografia**: Inter, labels em `text-sm font-medium`, heading em `text-xl font-bold`

### Acessibilidade — Requisitos Obrigatórios

- Cada `<input>` deve ter `<label>` associado via `htmlFor`/`id`
- `aria-required="true"` nos campos obrigatórios
- Erros com `aria-describedby` ligando campo à mensagem de erro (shadcn/ui Form faz isso automaticamente)
- Tab order: Nome → Email → Senha → Botão "Criar conta" → Link "Já tem conta?"
- Enter submete o formulário

### Convenções de Código

- Arquivo de componente: PascalCase → `RegisterForm.tsx`
- Arquivo de página: `page.tsx` (Next.js convention)
- Funções: camelCase → `onSubmit`
- Import alias: `@/*` para imports absolutos a partir de `src/`
- `'use client'` APENAS no `RegisterForm.tsx`, NÃO na `page.tsx`

### Erros Comuns a Evitar

- NÃO usar `useRouter` do `next/router` — usar `next/navigation`
- NÃO usar `redirect()` do Next.js no Client Component — usar `router.push()`
- NÃO instalar shadcn/ui Form component se não necessário — usar Input + Label diretamente com react-hook-form é mais simples
- NÃO esquecer de tratar o erro 409 (email duplicado) da API separadamente
- NÃO limpar o formulário quando a API retorna erro — preservar dados digitados

### Estrutura de Arquivos a Criar/Modificar

**Criar:**
- `src/components/auth/RegisterForm.tsx` — Client Component com formulário

**Modificar:**
- `src/app/(auth)/register/page.tsx` — já existe como placeholder, atualizar com layout real

**Já existentes (NÃO recriar):**
- `src/lib/validations/auth.ts` — schema Zod (criado na Story 2.1)
- `src/app/api/auth/register/route.ts` — API Route (criado na Story 2.1)
- `src/middleware.ts` — proteção de rotas (criado na Story 2.1)

### Learnings da Story 2.1 (Story Anterior)

- Prisma 7 usa `prisma.config.ts` com `dotenv/config` para URL do banco
- O middleware pode rodar em Node.js runtime com `export const runtime = 'nodejs'`
- `.env.local` tem `DATABASE_URL="file:./prisma/dev.db"`
- A pasta `src/lib/validations/` foi criada na Story 2.1
- `src/lib/auth.ts` e `src/lib/db.ts` já existem
- API Routes de autenticação já estão em `src/app/api/auth/`

### Project Structure Notes

- Esta story cria APENAS a interface de cadastro — a API e infraestrutura de autenticação já estão prontas (Story 2.1)
- A Story 2.3 (Login e Logout) virá em seguida e compartilhará o mesmo layout visual
- O RegisterForm deve ser visualmente consistente com o futuro LoginForm (mesma largura de card, mesmo estilo)

### References

- Requisitos da Story 2.2: [Source: _evo-output/planning-artifacts/setup-mvp/epics.md#Story 2.2]
- Layout de cadastro: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Jornada 1]
- Padrão de formulário: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Form Patterns]
- Button hierarchy: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Button Hierarchy]
- Acessibilidade: [Source: _evo-output/planning-artifacts/setup-mvp/ux-design-specification.md#Accessibility Strategy]
- Autenticação: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#2. Autenticação e Segurança]
- Padrão de API Response: [Source: _evo-output/planning-artifacts/setup-mvp/architecture.md#Formato de Resposta das API Routes]
- Story 2.1: [Source: _evo-output/implementation-artifacts/setup-mvp/2-1-infraestrutura-de-autenticacao-e-protecao-de-rotas.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
