import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    transaction: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import { deleteTransaction } from "@/actions/transactions"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const mockSession = {
  userId: "user1",
  name: "Test",
  email: "test@test.com",
  monthlyIncome: 5000,
}

const mockTransaction = {
  id: "tx1",
  amount: 100,
  type: "expense",
  categoryId: "cat1",
  userId: "user1",
  description: "Test",
  createdAt: new Date(),
}

describe("deleteTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const result = await deleteTransaction("tx1")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("returns error for empty id", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession)
    const result = await deleteTransaction("")
    expect(result.success).toBe(false)
    expect(result.error).toBe("ID invalido")
  })

  it("returns error when transaction not found", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession)
    vi.mocked(prisma.transaction.findUnique).mockResolvedValue(null)
    const result = await deleteTransaction("tx-nonexistent")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Transacao nao encontrada")
  })

  it("returns error when transaction belongs to another user", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession)
    vi.mocked(prisma.transaction.findUnique).mockResolvedValue({
      ...mockTransaction,
      userId: "other-user",
    })
    const result = await deleteTransaction("tx1")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Transacao nao encontrada")
  })

  it("deletes transaction and revalidates paths on success", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession)
    vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTransaction)
    vi.mocked(prisma.transaction.delete).mockResolvedValue(mockTransaction)

    const result = await deleteTransaction("tx1")

    expect(result.success).toBe(true)
    expect(result.data).toEqual(mockTransaction)
    expect(prisma.transaction.delete).toHaveBeenCalledWith({ where: { id: "tx1" } })
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/transactions")
  })

  it("handles database errors gracefully", async () => {
    vi.mocked(getSession).mockResolvedValue(mockSession)
    vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTransaction)
    vi.mocked(prisma.transaction.delete).mockRejectedValue(new Error("DB error"))

    const result = await deleteTransaction("tx1")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Erro ao excluir transacao")
  })
})
