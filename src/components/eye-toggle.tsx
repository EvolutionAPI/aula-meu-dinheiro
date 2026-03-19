"use client"

import { Eye, EyeOff } from "lucide-react"

interface EyeToggleProps {
  isHidden: boolean
  onToggle: () => void
}

export function EyeToggle({ isHidden, onToggle }: EyeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isHidden ? "Exibir valores" : "Ocultar valores"}
      className="rounded-lg p-2 text-zinc-400 transition-colors hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {isHidden ? (
        <EyeOff className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Eye className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}
