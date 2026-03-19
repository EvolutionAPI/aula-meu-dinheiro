"use client"

import { useState } from "react"
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/date"
import { deleteTransaction, createTransaction } from "@/actions/transactions"

export interface SerializedTransaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: string
  categoryId: string
  userId: string
  category: {
    id: string
    name: string
    icon: string
    color: string
  }
}

interface TransactionItemProps {
  transaction: SerializedTransaction
  index: number
}

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const deleteButtonOpacity = useTransform(x, [-80, -40, 0], [1, 0.5, 0])

  const isIncome = transaction.type === "income"
  const formattedValue = isIncome
    ? formatCurrency(transaction.amount)
    : `- ${formatCurrency(transaction.amount)}`

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)

    const deletedData = {
      amount: transaction.amount,
      type: transaction.type as "income" | "expense",
      categoryId: transaction.categoryId,
      description: transaction.description || undefined,
    }

    const result = await deleteTransaction(transaction.id)

    if (result.success) {
      toast("Transacao excluida", {
        action: {
          label: "Desfazer",
          onClick: async () => {
            const undoResult = await createTransaction(deletedData)
            if (undoResult.success) {
              toast("Transacao restaurada")
            } else {
              toast.error("Erro ao restaurar transacao")
            }
          },
        },
        duration: 3000,
        style: {
          background: "#27272a",
          color: "#fafafa",
          border: "1px solid #3f3f46",
        },
      })
    } else {
      toast.error(result.error || "Erro ao excluir transacao")
      setIsDeleting(false)
      x.set(0)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300, height: 0, marginBottom: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.05,
        duration: shouldReduceMotion ? 0 : 0.3,
      }}
      className="relative overflow-hidden"
    >
      <motion.div
        style={{ opacity: deleteButtonOpacity }}
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500"
      >
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-full w-full items-center justify-center text-white"
          aria-label="Excluir transacao"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -40) {
            x.set(-80)
          } else {
            x.set(0)
          }
        }}
        className="relative z-10 bg-background flex items-center gap-3 py-3"
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg flex-shrink-0"
          style={{ backgroundColor: transaction.category.color + "20" }}
        >
          {transaction.category.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-50 truncate">
            {transaction.category.name}
          </p>
          <p className="text-xs text-zinc-400 truncate">
            {transaction.description || formatDate(transaction.createdAt)}
          </p>
        </div>

        <span
          className={`text-sm font-bold flex-shrink-0 ${
            isIncome ? "text-emerald-500" : "text-zinc-50"
          }`}
        >
          {formattedValue}
        </span>
      </motion.div>
    </motion.div>
  )
}
