"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Fab } from "@/components/fab"
import { TransactionForm } from "@/components/transaction-form"

const BottomSheet = dynamic(
  () => import("@/components/bottom-sheet").then((m) => m.BottomSheet),
  { ssr: false }
)

interface CategoryData {
  id: string
  name: string
  icon: string
  color: string
  type: string
}

interface TransactionFabWrapperProps {
  categories: CategoryData[]
}

export function TransactionFabWrapper({ categories }: TransactionFabWrapperProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpen = useCallback(() => setIsSheetOpen(true), [])
  const handleClose = useCallback(() => setIsSheetOpen(false), [])

  return (
    <>
      <Fab onClick={handleOpen} disabled={isSheetOpen} />
      {isSheetOpen && (
        <BottomSheet isOpen={isSheetOpen} onClose={handleClose}>
          <TransactionForm onSuccess={handleClose} categories={categories} />
        </BottomSheet>
      )}
    </>
  )
}
