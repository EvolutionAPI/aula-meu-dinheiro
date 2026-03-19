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

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome e obrigatorio').max(30, 'Nome deve ter no maximo 30 caracteres'),
  icon: z.string().min(1, 'Icone e obrigatorio').max(8, 'Icone invalido'),
  type: z.enum(['expense', 'income'], { required_error: 'Tipo e obrigatorio' }),
})

export type CategoryInput = z.infer<typeof categorySchema>
