"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface DescriptionFieldProps {
  value: string
  onChange: (value: string) => void
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleBlur = () => {
    if (!value.trim()) {
      setIsExpanded(false)
    }
  }

  return (
    <div className="py-2">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="py-2 text-sm text-zinc-600"
          >
            Adicionar nota...
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Adicionar nota..."
              autoFocus
              className="w-full border-b border-zinc-700 bg-transparent py-2 text-sm text-zinc-50 outline-none transition-colors placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
