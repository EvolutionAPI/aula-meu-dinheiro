export const DEFAULT_CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentacao', icon: '🍔', color: '#f97316', type: 'expense' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: 'moradia', name: 'Moradia', icon: '🏠', color: '#8b5cf6', type: 'expense' },
  { id: 'lazer', name: 'Lazer', icon: '🎮', color: '#ec4899', type: 'expense' },
  { id: 'saude', name: 'Saude', icon: '💊', color: '#ef4444', type: 'expense' },
  { id: 'educacao', name: 'Educacao', icon: '📚', color: '#06b6d4', type: 'expense' },
  { id: 'outros', name: 'Outros', icon: '📦', color: '#6b7280', type: 'both' },
  { id: 'salario', name: 'Salario', icon: '💰', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#8b5cf6', type: 'income' },
  { id: 'investimentos', name: 'Investimentos', icon: '📈', color: '#3b82f6', type: 'income' },
  { id: 'presente', name: 'Presente', icon: '🎁', color: '#ec4899', type: 'income' },
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
