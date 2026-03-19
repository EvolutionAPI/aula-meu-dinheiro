export const DEFAULT_CATEGORIES = [
  { name: 'Alimentacao', icon: '🍔', color: '#f97316' },
  { name: 'Transporte', icon: '🚗', color: '#3b82f6' },
  { name: 'Moradia', icon: '🏠', color: '#8b5cf6' },
  { name: 'Lazer', icon: '🎮', color: '#ec4899' },
  { name: 'Saude', icon: '💊', color: '#ef4444' },
  { name: 'Educacao', icon: '📚', color: '#06b6d4' },
  { name: 'Outros', icon: '📦', color: '#6b7280' },
] as const

export const SALT_ROUNDS = 10

export const SEMAPHORE_THRESHOLDS = {
  green: 0.4,
  yellow: 0.1,
} as const
