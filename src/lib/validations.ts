import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Senha e obrigatoria'),
})

export const onboardingSchema = z.object({
  monthlyIncome: z.number().positive('Renda deve ser maior que zero'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
