export type ActionResponse<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export type Session = {
  userId: string
  name: string
  email: string
  monthlyIncome: number
}
