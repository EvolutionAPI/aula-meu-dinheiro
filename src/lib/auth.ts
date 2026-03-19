import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { Session } from '@/types'

export const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function createToken(payload: {
  userId: string
  name: string
  email: string
  monthlyIncome: number
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(jwtSecret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecret)
    return payload as unknown as Session
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

// Onboarding cookie — secure, short-lived cookie to link register step 1 to step 2
const ONBOARDING_COOKIE = 'onboarding_uid'

export async function setOnboardingCookie(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(jwtSecret)

  const cookieStore = await cookies()
  cookieStore.set(ONBOARDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  })
}

export async function getOnboardingUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ONBOARDING_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, jwtSecret)
    return (payload as { userId?: string }).userId ?? null
  } catch {
    return null
  }
}

export async function deleteOnboardingCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(ONBOARDING_COOKIE)
}
