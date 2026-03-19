"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryItem {
  id: string
  name: string
  icon: string
  color: string
}

interface CategoryGridProps {
  categories: readonly CategoryItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAddNew?: () => void
}

export function CategoryGrid({ categories, selectedId, onSelect, onAddNew }: CategoryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null
      const cols = 4

      switch (e.key) {
        case "ArrowRight":
          nextIndex = index + 1 < categories.length ? index + 1 : 0
          break
        case "ArrowLeft":
          nextIndex = index - 1 >= 0 ? index - 1 : categories.length - 1
          break
        case "ArrowDown":
          nextIndex = index + cols < categories.length ? index + cols : index % cols
          break
        case "ArrowUp":
          nextIndex = index - cols >= 0 ? index - cols : categories.length - cols + (index % cols)
          if (nextIndex < 0 || nextIndex >= categories.length) nextIndex = index
          break
      }

      if (nextIndex !== null) {
        e.preventDefault()
        const buttons = gridRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')
        buttons?.[nextIndex]?.focus()
        onSelect(categories[nextIndex].id)
      }
    },
    [categories, onSelect]
  )

  return (
    <div
      ref={gridRef}
      role="radiogroup"
      aria-label="Selecione uma categoria"
      className="grid grid-cols-4 gap-3 py-4"
    >
      {categories.map((category, index) => {
        const isSelected = selectedId === category.id
        return (
          <motion.button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={category.name}
            tabIndex={isSelected || (selectedId === null && index === 0) ? 0 : -1}
            onClick={() => onSelect(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            animate={{ scale: isSelected ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-2xl",
                isSelected && "ring-2 ring-emerald-500"
              )}
              style={{ backgroundColor: category.color + "33" }}
            >
              {category.icon}
            </div>
            <span className="w-full truncate text-center text-xs text-zinc-400">
              {category.name}
            </span>
          </motion.button>
        )
      })}
      {onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className="flex flex-col items-center gap-1"
          aria-label="Nova categoria"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-zinc-600 text-xl text-zinc-500">
            +
          </div>
          <span className="w-full truncate text-center text-xs text-zinc-400">Nova</span>
        </button>
      )}
    </div>
  )
}
