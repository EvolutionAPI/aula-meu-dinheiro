import { describe, it, expect } from 'vitest'
import { SEMAPHORE_THRESHOLDS, TRANSACTION_TYPE } from '@/lib/constants'

describe('SEMAPHORE_THRESHOLDS', () => {
  it('green threshold is 0.4', () => {
    expect(SEMAPHORE_THRESHOLDS.green).toBe(0.4)
  })

  it('yellow threshold is 0.1', () => {
    expect(SEMAPHORE_THRESHOLDS.yellow).toBe(0.1)
  })
})

describe('TRANSACTION_TYPE', () => {
  it('has INCOME and EXPENSE', () => {
    expect(TRANSACTION_TYPE.INCOME).toBe('income')
    expect(TRANSACTION_TYPE.EXPENSE).toBe('expense')
  })
})
