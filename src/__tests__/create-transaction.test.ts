import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock dependencies before importing the action
vi.mock("@/lib/db", () => ({
  prisma: {
    transaction: {
      create: vi.fn(),
    },
  },
}))

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

// Import after mocks
import { createTransaction } from "@/actions/transactions"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

describe("createTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)

    const result = await createTransaction({
      amount: 100,
      type: "expense",
      categoryId: "clh1234567890",
      description: "Test",
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("returns error for invalid data (amount <= 0)", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: "user1",
      name: "Test",
      email: "test@test.com",
      monthlyIncome: 5000,
    })

    const result = await createTransaction({
      amount: -10,
      type: "expense",
      categoryId: "clh1234567890",
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Dados invalidos")
  })

  it("returns error for invalid type", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: "user1",
      name: "Test",
      email: "test@test.com",
      monthlyIncome: 5000,
    })

    const result = await createTransaction({
      amount: 100,
      type: "invalid" as "expense",
      categoryId: "clh1234567890",
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Dados invalidos")
  })

  it("creates transaction and revalidates paths on success", async () => {
    const mockTransaction = {
      id: "tx1",
      amount: 100,
      type: "expense",
      categoryId: "alimentacao",
      userId: "user1",
      description: "Almoço",
      createdAt: new Date(),
    }

    vi.mocked(getSession).mockResolvedValue({
      userId: "user1",
      name: "Test",
      email: "test@test.com",
      monthlyIncome: 5000,
    })

    vi.mocked(prisma.transaction.create).mockResolvedValue(mockTransaction)

    const result = await createTransaction({
      amount: 100,
      type: "expense",
      categoryId: "alimentacao",
      description: "Almoço",
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual(mockTransaction)
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        amount: 100,
        type: "expense",
        categoryId: "alimentacao",
        description: "Almoço",
        userId: "user1",
      },
    })
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/transactions")
  })

  it("creates transaction without description", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: "user1",
      name: "Test",
      email: "test@test.com",
      monthlyIncome: 5000,
    })

    vi.mocked(prisma.transaction.create).mockResolvedValue({
      id: "tx2",
      amount: 50,
      type: "income",
      categoryId: "outros",
      userId: "user1",
      description: null,
      createdAt: new Date(),
    })

    const result = await createTransaction({
      amount: 50,
      type: "income",
      categoryId: "outros",
    })

    expect(result.success).toBe(true)
  })

  it("handles database errors gracefully", async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: "user1",
      name: "Test",
      email: "test@test.com",
      monthlyIncome: 5000,
    })

    vi.mocked(prisma.transaction.create).mockRejectedValue(new Error("DB error"))

    const result = await createTransaction({
      amount: 100,
      type: "expense",
      categoryId: "alimentacao",
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe("Erro ao salvar transacao")
  })
})
