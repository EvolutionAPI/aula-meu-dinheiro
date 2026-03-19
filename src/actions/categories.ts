"use server"

import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { categorySchema, type CategoryInput } from "@/lib/validations"

const CATEGORY_COLORS = [
  "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#06b6d4", "#10b981", "#6b7280", "#eab308", "#14b8a6",
]

export async function createCategory(data: CategoryInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false as const, error: "Dados invalidos" }
    }

    const existingCount = await prisma.category.count({
      where: { userId: session.userId },
    })
    const color = CATEGORY_COLORS[existingCount % CATEGORY_COLORS.length]

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        icon: parsed.data.icon,
        type: parsed.data.type,
        color,
        userId: session.userId,
      },
    })

    revalidatePath("/")
    revalidatePath("/profile/categories")

    return { success: true as const, data: category }
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return { success: false as const, error: "Ja existe uma categoria com esse nome" }
    }
    console.error("Erro ao criar categoria:", error)
    return { success: false as const, error: "Erro ao criar categoria" }
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false as const, error: "Dados invalidos" }
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.userId) {
      return { success: false as const, error: "Categoria nao encontrada" }
    }

    if (existing.name === "Outros") {
      return { success: false as const, error: "Categoria Outros nao pode ser editada" }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        icon: parsed.data.icon,
        type: existing.type === "both" ? "both" : parsed.data.type,
      },
    })

    revalidatePath("/")
    revalidatePath("/profile/categories")

    return { success: true as const, data: category }
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return { success: false as const, error: "Ja existe uma categoria com esse nome" }
    }
    console.error("Erro ao atualizar categoria:", error)
    return { success: false as const, error: "Erro ao atualizar categoria" }
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.userId) {
      return { success: false as const, error: "Categoria nao encontrada" }
    }

    if (existing.name === "Outros") {
      return { success: false as const, error: "Categoria Outros nao pode ser excluida" }
    }

    await prisma.$transaction(async (tx) => {
      const outros = await tx.category.findFirst({
        where: { userId: session.userId, name: "Outros" },
      })

      if (!outros) {
        throw new Error("Categoria Outros nao encontrada")
      }

      await tx.transaction.updateMany({
        where: { categoryId: id },
        data: { categoryId: outros.id },
      })

      await tx.category.delete({ where: { id } })
    })

    revalidatePath("/")
    revalidatePath("/profile/categories")

    return { success: true as const }
  } catch (error) {
    console.error("Erro ao excluir categoria:", error)
    const message =
      error instanceof Error && error.message.includes("Outros nao encontrada")
        ? "Erro: categoria padrao 'Outros' nao encontrada. Contacte suporte."
        : "Erro ao excluir categoria"
    return { success: false as const, error: message }
  }
}

export async function getCategories() {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.userId },
      orderBy: { name: "asc" },
    })

    return { success: true as const, data: categories }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return { success: false as const, error: "Erro ao buscar categorias" }
  }
}
