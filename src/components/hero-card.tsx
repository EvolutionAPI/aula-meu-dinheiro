"use client"

import { AnimatedCounter } from "@/components/animated-counter"
import { formatCurrency } from "@/lib/format"
import { SEMAPHORE_THRESHOLDS } from "@/lib/constants"

interface HeroCardProps {
  balance: number
  income: number
  expenses: number
  monthlyIncome: number
  isHidden: boolean
}

function getSemaphoreColor(balance: number, monthlyIncome: number): string {
  if (balance < 0) return "#ef4444"
  if (monthlyIncome <= 0) return "#10b981"
  const ratio = balance / monthlyIncome
  if (ratio > SEMAPHORE_THRESHOLDS.green) return "#10b981"
  if (ratio > SEMAPHORE_THRESHOLDS.yellow) return "#f59e0b"
  return "#ef4444"
}

function getSemaphoreLabel(balance: number, monthlyIncome: number): string {
  if (balance < 0) return "critico"
  if (monthlyIncome <= 0) return "saudavel"
  const ratio = balance / monthlyIncome
  if (ratio > SEMAPHORE_THRESHOLDS.green) return "saudavel"
  if (ratio > SEMAPHORE_THRESHOLDS.yellow) return "atencao"
  return "critico"
}

export function HeroCard({
  balance,
  income,
  expenses,
  monthlyIncome,
  isHidden,
}: HeroCardProps) {
  const semaphoreColor = getSemaphoreColor(balance, monthlyIncome)
  const semaphoreLabel = getSemaphoreLabel(balance, monthlyIncome)

  return (
    <div
      className="rounded-2xl bg-zinc-800 p-4 shadow-lg"
      style={{ borderLeft: `4px solid ${semaphoreColor}` }}
      aria-label={`Saldo atual: ${isHidden ? "oculto" : formatCurrency(balance)}. Status: ${semaphoreLabel}`}
      aria-live="polite"
    >
      <p className="text-sm text-zinc-400">Saldo atual</p>
      <div className="mt-1 transition-opacity duration-200">
        <AnimatedCounter
          value={balance}
          isHidden={isHidden}
          className="text-3xl font-bold tracking-tight text-zinc-50"
        />
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        {isHidden
          ? "Receitas R$ •••••• | Despesas R$ ••••••"
          : `Receitas ${formatCurrency(income)} | Despesas ${formatCurrency(expenses)}`}
      </p>
    </div>
  )
}
