"use client"

import { useState } from "react"
import Link from "next/link"
import { EyeToggle } from "@/components/eye-toggle"
import { HeroCard } from "@/components/hero-card"
import { RecentTransactions } from "@/components/recent-transactions"

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  category: {
    name: string
    icon: string
    color: string
  }
}

interface DashboardClientProps {
  userName: string
  balance: number
  income: number
  expenses: number
  monthlyIncome: number
  recentTransactions: Transaction[]
}

export function DashboardClient({
  userName,
  balance,
  income,
  expenses,
  monthlyIncome,
  recentTransactions,
}: DashboardClientProps) {
  const [isHidden, setIsHidden] = useState(false)

  return (
    <div className="space-y-6 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-50">Ola, {userName}</h1>
        <EyeToggle isHidden={isHidden} onToggle={() => setIsHidden(!isHidden)} />
      </header>

      <HeroCard
        balance={balance}
        income={income}
        expenses={expenses}
        monthlyIncome={monthlyIncome}
        isHidden={isHidden}
      />

      <RecentTransactions
        transactions={recentTransactions}
        isHidden={isHidden}
      />

      <div className="flex justify-center gap-4 pt-2">
        <Link
          href="/transactions"
          className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Ver todas as transacoes
        </Link>
      </div>
    </div>
  )
}
