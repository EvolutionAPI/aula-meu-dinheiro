"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FabProps {
  onClick: () => void
  disabled?: boolean
}

export function Fab({ onClick, disabled }: FabProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label="Adicionar nova transacao"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "shadow-lg shadow-emerald-500/20",
        "focus-visible:ring-2 focus-visible:ring-emerald-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "transition-colors",
        disabled
          ? "bg-zinc-600 pointer-events-none opacity-60"
          : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
      )}
      style={{
        bottom: "calc(64px + env(safe-area-inset-bottom) + 16px)",
        right: 24,
      }}
    >
      <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
    </motion.button>
  )
}
