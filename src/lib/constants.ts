export const DEFAULT_CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentacao', icon: '🍔', color: '#f97316' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#3b82f6' },
  { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#8b5cf6' },
  { id: 'lazer', name: 'Lazer', icon: '🎮', color: '#ec4899' },
  { id: 'saude', name: 'Saude', icon: '💊', color: '#ef4444' },
  { id: 'educacao', name: 'Educacao', icon: '📚', color: '#06b6d4' },
  { id: 'outros', name: 'Outros', icon: '📦', color: '#6b7280' },
] as const

export type Category = (typeof DEFAULT_CATEGORIES)[number]

export const SALT_ROUNDS = 10

export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const

export const SEMAPHORE_THRESHOLDS = {
  green: 0.4,
  yellow: 0.1,
} as const
