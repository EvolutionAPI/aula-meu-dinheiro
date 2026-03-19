"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Receipt } from "lucide-react"
import { FilterPills, type FilterType } from "@/components/filter-pills"
import { TransactionItem, type SerializedTransaction } from "@/components/transaction-item"
import { getMonthRange, getWeekRange, getTodayRange } from "@/lib/date"
import { formatCurrency } from "@/lib/format"

interface TransactionsListProps {
  transactions: SerializedTransaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Mes")

  const filteredTransactions = useMemo(() => {
    const range =
      activeFilter === "Hoje"
        ? getTodayRange()
        : activeFilter === "Semana"
          ? getWeekRange()
          : getMonthRange()

    return transactions.filter((t) => {
      const date = new Date(t.createdAt)
      return date >= range.start && date <= range.end
    })
  }, [transactions, activeFilter])

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, total: income - expenses }
  }, [filteredTransactions])

  return (
    <div className="space-y-4">
      <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl p-4">
        <p className="text-lg font-bold text-zinc-50">
          Total: {formatCurrency(Math.abs(summary.total))}
        </p>
        <div className="flex gap-4 mt-1">
          <span className="text-xs text-emerald-500">
            Receitas: {formatCurrency(summary.income)}
          </span>
          <span className="text-xs text-red-400">
            Despesas: {formatCurrency(summary.expenses)}
          </span>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <Receipt className="h-12 w-12 text-zinc-600" />
          <p className="text-sm text-zinc-500 text-center">
            Sem transacoes neste periodo
          </p>
          <p className="text-xs text-zinc-600 text-center">
            Tente selecionar outro periodo
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-zinc-800">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
