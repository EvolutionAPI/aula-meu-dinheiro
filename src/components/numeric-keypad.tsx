"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Delete } from "lucide-react"

interface NumericKeypadProps {
  onDigit: (digit: string) => void
  onDecimal: () => void
  onBackspace: () => void
  onClear: () => void
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [",", "0", "backspace"],
]

export function NumericKeypad({ onDigit, onDecimal, onBackspace, onClear }: NumericKeypadProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)

  const handlePointerDown = useCallback(() => {
    didLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      onClear()
      didLongPress.current = true
      longPressTimer.current = null
    }, 500)
  }, [onClear])

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (!didLongPress.current) {
      onBackspace()
    }
  }, [onBackspace])

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleKeyPress = (key: string) => {
    if (key === ",") onDecimal()
    else onDigit(key)
  }

  return (
    <div className="grid grid-cols-3 gap-2 justify-items-center py-4">
      {KEYS.flat().map((key) =>
        key === "backspace" ? (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="flex h-12 w-16 items-center justify-center rounded-xl bg-zinc-800 text-zinc-50 select-none touch-manipulation active:bg-zinc-700"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            aria-label="Apagar"
          >
            <Delete className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="flex h-12 w-16 items-center justify-center rounded-xl bg-zinc-800 text-lg font-medium text-zinc-50 select-none touch-manipulation active:bg-zinc-700"
            onClick={() => handleKeyPress(key)}
            aria-label={key === "," ? "Virgula" : key}
          >
            {key}
          </motion.button>
        )
      )}
    </div>
  )
}
