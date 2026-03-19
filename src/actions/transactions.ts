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
