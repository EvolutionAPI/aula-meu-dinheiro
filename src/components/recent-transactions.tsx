"use client"

import { motion, useReducedMotion } from "framer-motion"
import { formatCurrency } from "@/lib/format"
import { TRANSACTION_TYPE } from "@/lib/constants"

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

interface RecentTransactionsProps {
  transactions: Transaction[]
  isHidden: boolean
}

export function RecentTransactions({
  transactions,
  isHidden,
}: RecentTransactionsProps) {
  const shouldReduceMotion = useReducedMotion()

  if (transactions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-zinc-500">Registre sua primeira transacao</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-300">Ultimas transacoes</h2>
      <ul className="space-y-2">
        {transactions.map((tx, index) => (
          <motion.li
            key={tx.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.05, duration: 0.2 }}
            className="flex items-center gap-3"
            aria-label={`${tx.category.name}: ${isHidden ? "valor oculto" : formatCurrency(tx.amount)}`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-base"
              style={{ backgroundColor: tx.category.color + "20" }}
              aria-hidden="true"
            >
              {tx.category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-zinc-50">{tx.category.name}</p>
              {tx.description && (
                <p className="truncate text-xs text-zinc-500">{tx.description}</p>
              )}
            </div>
            <span
              className={`text-sm font-semibold ${
                tx.type === TRANSACTION_TYPE.INCOME ? "text-emerald-500" : "text-zinc-50"
              }`}
            >
              {isHidden
                ? "R$ ••••••"
                : `${tx.type === TRANSACTION_TYPE.EXPENSE ? "- " : ""}${formatCurrency(tx.amount)}`}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
