import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/lib/format'

describe('formatCurrency', () => {
  it('formats positive values as BRL', () => {
    expect(formatCurrency(1234.56)).toBe('R$\u00a01.234,56')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$\u00a00,00')
  })

  it('formats negative values', () => {
    expect(formatCurrency(-500)).toBe('-R$\u00a0500,00')
  })

  it('formats large values', () => {
    expect(formatCurrency(99999.99)).toBe('R$\u00a099.999,99')
  })
})
