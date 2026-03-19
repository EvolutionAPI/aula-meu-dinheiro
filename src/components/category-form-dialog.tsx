"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createCategory, updateCategory } from "@/actions/categories"

const EMOJI_OPTIONS = [
  "🍔", "🚗", "🏠", "🎮", "💊", "📚", "💰", "💻", "📈", "🎁",
  "👕", "✈️", "🐾", "☕", "🎬", "💇", "🏋️", "🛒", "📱", "🔧",
]

interface CategoryData {
  id: string
  name: string
  icon: string
  type: string
}

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryData
  onSuccess?: () => void
  type?: "expense" | "income"
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
  type = "expense",
}: CategoryFormDialogProps) {
  const isEditing = !!category
  const [name, setName] = useState(category?.name ?? "")
  const [icon, setIcon] = useState(category?.icon ?? "")
  const [categoryType, setCategoryType] = useState<"expense" | "income">(
    (category?.type as "expense" | "income") ?? type
  )
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!name.trim() || !icon) return

    startTransition(async () => {
      const data = { name: name.trim(), icon, type: categoryType }
      const result = isEditing
        ? await updateCategory(category.id, data)
        : await createCategory(data)

      if (result.success) {
        toast.success(isEditing ? "Categoria atualizada" : "Categoria criada")
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Nome */}
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Ex: Mercado"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCategoryType("expense")}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  categoryType === "expense"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-border text-muted-foreground"
                )}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setCategoryType("income")}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  categoryType === "income"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-border text-muted-foreground"
                )}
              >
                Receita
              </button>
            </div>
          </div>

          {/* Emojis */}
          <div>
            <label className="mb-1.5 block text-sm text-muted-foreground">Icone</label>
            <div className="grid grid-cols-7 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors",
                    icon === emoji
                      ? "bg-emerald-500/20 ring-2 ring-emerald-500"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim() || !icon}
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
