'use server'

import { prisma } from '@/lib/db'
import {
  createToken,
  setSessionCookie,
  deleteSessionCookie,
  setOnboardingCookie,
  getOnboardingUserId,
  deleteOnboardingCookie,
} from '@/lib/auth'
import { registerSchema, loginSchema, onboardingSchema } from '@/lib/validations'
import { DEFAULT_CATEGORIES, SALT_ROUNDS } from '@/lib/constants'
import { hash, compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'

export async function register(
  data: unknown
): Promise<ActionResponse> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: 'Email ja cadastrado' }
  }

  const hashedPassword = await hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      monthlyIncome: 0,
    },
  })

  // Set secure httpOnly cookie with userId for onboarding step
  await setOnboardingCookie(user.id)

  return { success: true }
}

export async function completeOnboarding(
  data: unknown
): Promise<ActionResponse> {
  // Extract userId from secure httpOnly cookie (not from client input)
  const userId = await getOnboardingUserId()
  if (!userId) {
    return { success: false, error: 'Sessao de registro expirada. Tente novamente.' }
  }

  const parsed = onboardingSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { monthlyIncome } = parsed.data

  let user
  try {
    user = await prisma.user.update({
      where: { id: userId },
      data: { monthlyIncome },
    })
  } catch {
    return { success: false, error: 'Usuario nao encontrado. Tente criar a conta novamente.' }
  }

  // Create default categories
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: cat.type,
      userId: user.id,
    })),
  })

  // Generate JWT and set session cookie
  const token = await createToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    monthlyIncome: user.monthlyIncome,
  })

  await setSessionCookie(token)
  await deleteOnboardingCookie()

  return { success: true }
}

export async function logout() {
  await deleteSessionCookie()
  redirect('/login')
}

export async function login(data: unknown): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Email ou senha incorretos' }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { success: false, error: 'Email ou senha incorretos' }
  }

  const passwordMatch = await compare(password, user.password)
  if (!passwordMatch) {
    return { success: false, error: 'Email ou senha incorretos' }
  }

  const token = await createToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    monthlyIncome: user.monthlyIncome,
  })

  await setSessionCookie(token)

  return { success: true }
}
