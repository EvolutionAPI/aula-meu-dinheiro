"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Pencil, Trash2, Plus } from "lucide-react"
import { CategoryFormDialog } from "@/components/category-form-dialog"
import { deleteCategory } from "@/actions/categories"

interface CategoryData {
  id: string
  name: string
  icon: string
  color: string
  type: string
}

interface CategoryManagementProps {
  categories: CategoryData[]
}

export function CategoryManagement({ categories }: CategoryManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [editingCategory, setEditingCategory] = useState<CategoryData | undefined>()
  const [dialogType, setDialogType] = useState<"expense" | "income">("expense")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const expenses = categories.filter((c) => c.type === "expense" || c.type === "both")
  const incomes = categories.filter((c) => c.type === "income" || c.type === "both")

  const handleNew = (type: "expense" | "income") => {
    setEditingCategory(undefined)
    setDialogType(type)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category)
    setDialogType(category.type as "expense" | "income")
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.success) {
        toast.success("Categoria excluida")
        setConfirmDeleteId(null)
      } else {
        toast.error(result.error)
      }
      setDeletingId(null)
    })
  }

  const isProtected = (name: string) => name === "Outros"

  const renderGroup = (title: string, items: CategoryData[], type: "expense" | "income") => (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <button
          type="button"
          onClick={() => handleNew(type)}
          className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400"
        >
          <Plus className="h-4 w-4" />
          Nova categoria
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl bg-card divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {items.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex min-h-[48px] items-center gap-3 px-4"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: category.color + "33" }}
              >
                {category.icon}
              </div>
              <span className="flex-1 text-foreground">{category.name}</span>

              {!isProtected(category.name) && (
                <div className="flex gap-1">
                  {confirmDeleteId === category.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10"
                      >
                        {deletingId === category.id ? "..." : "Confirmar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Editar ${category.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(category.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Excluir ${category.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )

  return (
    <>
      {renderGroup("Despesas", expenses, "expense")}
      {renderGroup("Receitas", incomes, "income")}
      <CategoryFormDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        type={dialogType}
      />
    </>
  )
}
