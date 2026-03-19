import { describe, it, expect } from 'vitest'
import { SEMAPHORE_THRESHOLDS } from '@/lib/constants'

// Test the semaphore logic independently (extracted from hero-card.tsx)
function getSemaphoreColor(balance: number, monthlyIncome: number): string {
  if (balance < 0) return '#ef4444'
  if (monthlyIncome <= 0) return '#10b981'
  const ratio = balance / monthlyIncome
  if (ratio > SEMAPHORE_THRESHOLDS.green) return '#10b981'
  if (ratio > SEMAPHORE_THRESHOLDS.yellow) return '#f59e0b'
  return '#ef4444'
}

function getSemaphoreLabel(balance: number, monthlyIncome: number): string {
  if (balance < 0) return 'critico'
  if (monthlyIncome <= 0) return 'saudavel'
  const ratio = balance / monthlyIncome
  if (ratio > SEMAPHORE_THRESHOLDS.green) return 'saudavel'
  if (ratio > SEMAPHORE_THRESHOLDS.yellow) return 'atencao'
  return 'critico'
}

describe('getSemaphoreColor', () => {
  it('returns green when ratio > 0.4', () => {
    expect(getSemaphoreColor(500, 1000)).toBe('#10b981')
  })

  it('returns yellow when ratio between 0.1 and 0.4', () => {
    expect(getSemaphoreColor(200, 1000)).toBe('#f59e0b')
  })

  it('returns red when ratio < 0.1', () => {
    expect(getSemaphoreColor(50, 1000)).toBe('#ef4444')
  })

  it('returns red for negative balance', () => {
    expect(getSemaphoreColor(-500, 1000)).toBe('#ef4444')
  })

  it('returns green when monthlyIncome is 0', () => {
    expect(getSemaphoreColor(100, 0)).toBe('#10b981')
  })

  it('returns red for zero balance with positive income', () => {
    expect(getSemaphoreColor(0, 1000)).toBe('#ef4444')
  })
})

describe('getSemaphoreLabel', () => {
  it('returns saudavel for healthy ratio', () => {
    expect(getSemaphoreLabel(500, 1000)).toBe('saudavel')
  })

  it('returns atencao for warning ratio', () => {
    expect(getSemaphoreLabel(200, 1000)).toBe('atencao')
  })

  it('returns critico for critical ratio', () => {
    expect(getSemaphoreLabel(50, 1000)).toBe('critico')
  })

  it('returns critico for negative balance', () => {
    expect(getSemaphoreLabel(-500, 1000)).toBe('critico')
  })
})
