import { describe, it, expect } from 'vitest'
import { getInitials } from '@/lib/utils'

describe('getInitials', () => {
  it('returns "?" for empty string', () => {
    expect(getInitials('')).toBe('?')
  })

  it('returns "?" for whitespace-only string', () => {
    expect(getInitials('   ')).toBe('?')
  })

  it('returns single initial for one-word name', () => {
    expect(getInitials('Davidson')).toBe('D')
  })

  it('returns two initials for two-word name', () => {
    expect(getInitials('Davidson Silva')).toBe('DS')
  })

  it('returns first and last initials for 3+ word name', () => {
    expect(getInitials('Maria Clara Santos')).toBe('MS')
  })

  it('returns uppercase initials', () => {
    expect(getInitials('joao pedro')).toBe('JP')
  })

  it('handles extra whitespace between words', () => {
    expect(getInitials('  Ana   Maria  ')).toBe('AM')
  })

  it('returns "?" for null/undefined cast as string', () => {
    expect(getInitials(null as unknown as string)).toBe('?')
    expect(getInitials(undefined as unknown as string)).toBe('?')
  })
})
