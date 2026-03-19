# MeuDinheiro

Controle financeiro pessoal simples e bonito. Registre receitas e despesas, acompanhe seu saldo e visualize seu historico financeiro.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Prisma 7** + **Supabase PostgreSQL**
- **Framer Motion** (animacoes)
- **jose** (JWT, edge-compatible)
- **Sonner** (toasts)
- **Vitest** + **Testing Library** (testes)

## Pre-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Criar projeto no [Supabase](https://supabase.com) (regiao: South America - Sao Paulo)
2. Ir em **Settings > Database**
3. Copiar a **Connection string (URI)** — Transaction mode, porta 6543

### 3. Configurar variaveis de ambiente

Criar `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres.SEU-PROJECT-REF:SUA-SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="gere-uma-string-segura-com-32-caracteres-minimo"
```

### 4. Criar tabelas no banco

```bash
npx prisma db push
```

Verificar no Supabase Dashboard > Table Editor se as tabelas `User`, `Category` e `Transaction` foram criadas.

### 5. Gerar Prisma Client

```bash
npx prisma generate
```

### 6. Rodar o projeto

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Servidor de producao |
| `npm run lint` | ESLint |
| `npx vitest run` | Rodar testes |
| `npx prisma db push` | Sincronizar schema com banco |
| `npx prisma generate` | Gerar Prisma Client |
| `npx prisma studio` | Interface visual do banco |

## Deploy na Vercel

### 1. Preparar

```bash
npm run build  # verificar que compila sem erros
```

### 2. Importar na Vercel

1. [Vercel Dashboard](https://vercel.com) > **Add New > Project**
2. Conectar GitHub e selecionar o repositorio
3. Adicionar **Environment Variables** antes do deploy:
   - `DATABASE_URL` = connection string do Supabase
   - `JWT_SECRET` = string segura de 32+ caracteres
4. Clicar **Deploy**

### 3. Dominio customizado (opcional)

1. Vercel > Settings > Domains > Add Domain
2. Configurar DNS na Cloudflare (ou outro provider):
   - `www` como CNAME apontando para `cname.vercel-dns.com`
   - `@` como A record para o IP da Vercel
   - Proxy Cloudflare: **DNS only** (cinza, nao laranja)

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Login e registro (sem nav)
│   │   ├── login/
│   │   └── register/
│   ├── (app)/           # App autenticado (com nav)
│   │   ├── page.tsx     # Dashboard
│   │   ├── transactions/
│   │   └── profile/
│   ├── layout.tsx       # Root layout
│   └── globals.css      # CSS variables e tema
├── components/          # Componentes React
├── actions/             # Server Actions
├── lib/                 # Utilitarios (auth, db, format, validations)
├── types/               # TypeScript types
└── __tests__/           # Testes unitarios
```

## Funcionalidades

- Cadastro e login com JWT em httpOnly cookie
- Dashboard com saldo, semaforo financeiro e ultimas transacoes
- Registro de transacoes com teclado numerico e categorias visuais
- Categorias separadas para despesas e receitas
- Historico com filtros por periodo (hoje/semana/mes)
- Exclusao com swipe e undo (3s)
- Perfil com avatar de iniciais e logout
- Animacoes com Framer Motion (counter, fade, slide, spring)
- Layout desktop: phone frame + guia do aluno side-by-side
- Dark mode nativo
- 117 testes unitarios

## Variaveis de Ambiente

| Variavel | Descricao | Obrigatoria |
|----------|-----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase) | Sim |
| `JWT_SECRET` | Segredo para assinar JWT (min 32 chars) | Sim |
