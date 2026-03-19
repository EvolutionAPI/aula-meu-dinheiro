'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { register, completeOnboarding } from '@/actions/auth'
import {
  registerSchema,
  onboardingSchema,
  type RegisterInput,
  type OnboardingInput,
} from '@/lib/validations'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onboardingForm = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
  })

  async function onRegisterSubmit(data: RegisterInput) {
    setServerError('')
    setLoading(true)
    try {
      const result = await register(data)
      if (result.success) {
        setStep(2)
      } else {
        setServerError(result.error || 'Erro ao criar conta')
      }
    } finally {
      setLoading(false)
    }
  }

  async function onOnboardingSubmit(data: OnboardingInput) {
    setServerError('')
    setLoading(true)
    try {
      const result = await completeOnboarding(data)
      if (result.success) {
        router.push('/')
      } else {
        setServerError(result.error || 'Erro ao salvar renda')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Qual sua renda mensal?
          </h1>
          <p className="text-sm text-muted-foreground">
            Isso nos ajuda a calcular seus indicadores financeiros
          </p>
        </div>

        <form
          onSubmit={onboardingForm.handleSubmit(onOnboardingSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="monthlyIncome"
              className="text-sm text-muted-foreground"
            >
              Renda mensal (R$)
            </label>
            <input
              id="monthlyIncome"
              type="number"
              step="0.01"
              min="0"
              placeholder="5000.00"
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...onboardingForm.register('monthlyIncome', {
                valueAsNumber: true,
              })}
            />
            {onboardingForm.formState.errors.monthlyIncome && (
              <p className="text-sm text-destructive">
                {onboardingForm.formState.errors.monthlyIncome.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Continuar'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Preencha seus dados para comecar
        </p>
      </div>

      <form
        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-muted-foreground">
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            className="h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...registerForm.register('name')}
          />
          {registerForm.formState.errors.name && (
            <p className="text-sm text-destructive">
              {registerForm.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-12 w-full rounded-lg border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...registerForm.register('email')}
          />
          {registerForm.formState.errors.email && (
            <p className="text-sm text-destructive">
              {registerForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 caracteres"
              className="h-12 w-full rounded-lg border border-border bg-card px-4 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...registerForm.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {registerForm.formState.errors.password && (
            <p className="text-sm text-destructive">
              {registerForm.formState.errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ja tenho conta{' '}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
