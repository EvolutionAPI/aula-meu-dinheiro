"use client"

import { useState, useCallback, useTransition } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NumericKeypad } from "@/components/numeric-keypad"
import { CategoryGrid } from "@/components/category-grid"
import { DescriptionField } from "@/components/description-field"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { createTransaction } from "@/actions/transactions"

interface CategoryData {
  id: string
  name: string
  icon: string
  color: string
}

interface TransactionFormProps {
  onSuccess?: () => void
  categories: CategoryData[]
}

export function TransactionForm({ onSuccess, categories }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  const [rawDigits, setRawDigits] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showPulse, setShowPulse] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const numericValue = rawDigits.length > 0 ? parseInt(rawDigits, 10) / 100 : 0
  const displayValue = formatCurrency(numericValue)

  const isFormValid = numericValue > 0 && selectedCategoryId !== null

  const handleDigit = useCallback((digit: string) => {
    setRawDigits((prev) => {
      const next = prev + digit
      if (next.length > 9) return prev
      return next
    })
  }, [])

  const handleDecimal = useCallback(() => {
    // Append "00" for quick cents entry
    setRawDigits((prev) => {
      const next = prev + "00"
      if (next.length > 9) return prev
      return next
    })
  }, [])

  const handleBackspace = useCallback(() => {
    setRawDigits((prev) => prev.slice(0, -1))
  }, [])

  const handleClear = useCallback(() => {
    setRawDigits("")
  }, [])

  const handleSubmit = useCallback(() => {
    if (!isFormValid || isPending) {
      setShowValidation(true)
      return
    }

    startTransition(async () => {
      const result = await createTransaction({
        amount: numericValue,
        type: transactionType,
        categoryId: selectedCategoryId!,
        description: description.trim() || undefined,
      })

      if (result.success) {
        setShowPulse(true)
        setTimeout(() => setShowPulse(false), 100)

        setTimeout(() => {
          onSuccess?.()
        }, 200)

        toast.success("Transacao salva", {
          icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
          duration: 3000,
        })

        setRawDigits("")
        setSelectedCategoryId(null)
        setDescription("")
        setShowValidation(false)
      } else {
        toast.error(result.error || "Erro ao salvar transacao")
      }
    })
  }, [isFormValid, isPending, selectedCategoryId, numericValue, transactionType, description, onSuccess])

  const missingAmount = showValidation && numericValue === 0
  const missingCategory = showValidation && selectedCategoryId === null

  return (
    <div className="flex flex-col px-4">
      {/* Tabs Despesa/Receita */}
      <Tabs
        defaultValue={0}
        onValueChange={(value) => {
          setTransactionType(value === 0 ? "expense" : "income")
        }}
      >
        <TabsList
          variant="line"
          className="w-full justify-center gap-8 border-b border-zinc-800 pb-0"
        >
          <TabsTrigger
            value={0}
            className={cn(
              "bg-transparent px-4 pb-2 text-sm font-medium",
              "data-active:text-emerald-500 data-active:after:bg-emerald-500",
              "text-zinc-400"
            )}
          >
            Despesa
          </TabsTrigger>
          <TabsTrigger
            value={1}
            className={cn(
              "bg-transparent px-4 pb-2 text-sm font-medium",
              "data-active:text-emerald-500 data-active:after:bg-emerald-500",
              "text-zinc-400"
            )}
          >
            Receita
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Display de valor */}
      <div className="py-6 text-center">
        <span
          className={cn(
            "text-3xl font-bold",
            transactionType === "expense" ? "text-zinc-50" : "text-emerald-500",
            missingAmount && "text-red-400"
          )}
        >
          {displayValue}
        </span>
        {missingAmount && (
          <p className="mt-1 text-xs text-red-400">Digite um valor</p>
        )}
      </div>

      {/* Teclado numerico */}
      <NumericKeypad
        onDigit={handleDigit}
        onDecimal={handleDecimal}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />

      {/* Grid de categorias */}
      <div>
        <CategoryGrid
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        {missingCategory && (
          <p className="-mt-2 text-xs text-red-400">Selecione uma categoria</p>
        )}
      </div>

      {/* Campo de descricao */}
      <DescriptionField value={description} onChange={setDescription} />

      {/* Botao Registrar */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        animate={showPulse ? { scale: [0.95, 1.0] } : {}}
        transition={{ duration: 0.1 }}
        className={cn(
          "mt-2 h-12 w-full rounded-lg font-semibold text-white transition-colors",
          isFormValid && !isPending
            ? "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
            : "cursor-not-allowed bg-emerald-500/50 opacity-50"
        )}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Salvando...
          </span>
        ) : (
          "Registrar"
        )}
      </motion.button>
    </div>
  )
}
