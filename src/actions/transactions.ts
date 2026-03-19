"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const createTransactionSchema = z.object({
  amount: z.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["income", "expense"]),
  categoryId: z.string().min(1, "Categoria invalida"),
  description: z.string().optional(),
})

type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export async function createTransaction(data: CreateTransactionInput) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const parsed = createTransactionSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false as const, error: "Dados invalidos" }
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...parsed.data,
        userId: session.userId,
      },
    })

    revalidatePath("/")
    revalidatePath("/transactions")

    return { success: true as const, data: transaction }
  } catch (error) {
    console.error("Erro ao criar transacao:", error)
    return { success: false as const, error: "Erro ao salvar transacao" }
  }
}

const deleteTransactionSchema = z.object({
  id: z.string().min(1, "ID invalido"),
})

export async function deleteTransaction(id: string) {
  try {
    const session = await getSession()
    if (!session) {
      return { success: false as const, error: "Nao autorizado" }
    }

    const parsed = deleteTransactionSchema.safeParse({ id })
    if (!parsed.success) {
      return { success: false as const, error: "ID invalido" }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: parsed.data.id },
    })

    if (!transaction || transaction.userId !== session.userId) {
      return { success: false as const, error: "Transacao nao encontrada" }
    }

    await prisma.transaction.delete({ where: { id: parsed.data.id } })

    revalidatePath("/")
    revalidatePath("/transactions")

    return { success: true as const, data: transaction }
  } catch (error) {
    console.error("Erro ao excluir transacao:", error)
    return { success: false as const, error: "Erro ao excluir transacao" }
  }
}
