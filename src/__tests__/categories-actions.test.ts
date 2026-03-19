import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/db", () => ({
  prisma: {
    category: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    transaction: {
      updateMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "@/actions/categories"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const MOCK_SESSION = {
  userId: "user1",
  name: "Test",
  email: "test@test.com",
  monthlyIncome: 5000,
}

describe("createCategory", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const result = await createCategory({ name: "Test", icon: "🍔", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("returns error for invalid data", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    const result = await createCategory({ name: "", icon: "🍔", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Dados invalidos")
  })

  it("returns friendly error for duplicate name", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.count).mockResolvedValue(5)
    vi.mocked(prisma.category.create).mockRejectedValue(
      new Error("Unique constraint failed on the fields: (`userId`,`name`)")
    )
    const result = await createCategory({ name: "Alimentacao", icon: "🍔", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Ja existe uma categoria com esse nome")
  })

  it("creates category and revalidates on success", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.count).mockResolvedValue(3)
    const mockCategory = {
      id: "cat1",
      name: "Mercado",
      icon: "🛒",
      color: "#6b7280",
      type: "expense",
      userId: "user1",
    }
    vi.mocked(prisma.category.create).mockResolvedValue(mockCategory)

    const result = await createCategory({ name: "Mercado", icon: "🛒", type: "expense" })
    expect(result.success).toBe(true)
    expect(result.data).toEqual(mockCategory)
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/profile/categories")
  })
})

describe("updateCategory", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const result = await updateCategory("cat1", { name: "Test", icon: "🍔", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("returns error when category not found", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.findUnique).mockResolvedValue(null)
    const result = await updateCategory("cat1", { name: "Test", icon: "🍔", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Categoria nao encontrada")
  })

  it("blocks editing Outros", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.findUnique).mockResolvedValue({
      id: "cat1",
      name: "Outros",
      icon: "📦",
      color: "#6b7280",
      type: "both",
      userId: "user1",
    })
    const result = await updateCategory("cat1", { name: "Renamed", icon: "📦", type: "expense" })
    expect(result.success).toBe(false)
    expect(result.error).toBe("Categoria Outros nao pode ser editada")
  })

  it("updates category on success", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.findUnique).mockResolvedValue({
      id: "cat1",
      name: "Alimentacao",
      icon: "🍔",
      color: "#f97316",
      type: "expense",
      userId: "user1",
    })
    const updated = {
      id: "cat1",
      name: "Comida",
      icon: "🍕",
      color: "#f97316",
      type: "expense",
      userId: "user1",
    }
    vi.mocked(prisma.category.update).mockResolvedValue(updated)

    const result = await updateCategory("cat1", { name: "Comida", icon: "🍕", type: "expense" })
    expect(result.success).toBe(true)
    expect(result.data).toEqual(updated)
  })
})

describe("deleteCategory", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const result = await deleteCategory("cat1")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("blocks deleting Outros", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.findUnique).mockResolvedValue({
      id: "cat1",
      name: "Outros",
      icon: "📦",
      color: "#6b7280",
      type: "both",
      userId: "user1",
    })
    const result = await deleteCategory("cat1")
    expect(result.success).toBe(false)
    expect(result.error).toBe("Categoria Outros nao pode ser excluida")
  })

  it("deletes category with transaction migration", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    vi.mocked(prisma.category.findUnique).mockResolvedValue({
      id: "cat1",
      name: "Alimentacao",
      icon: "🍔",
      color: "#f97316",
      type: "expense",
      userId: "user1",
    })
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      return fn({
        category: {
          findFirst: vi.fn().mockResolvedValue({ id: "outros-id", name: "Outros" }),
          delete: vi.fn(),
        },
        transaction: {
          updateMany: vi.fn(),
        },
      } as never)
    })

    const result = await deleteCategory("cat1")
    expect(result.success).toBe(true)
    expect(revalidatePath).toHaveBeenCalledWith("/")
  })
})

describe("getCategories", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns error when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null)
    const result = await getCategories()
    expect(result.success).toBe(false)
    expect(result.error).toBe("Nao autorizado")
  })

  it("returns sorted categories on success", async () => {
    vi.mocked(getSession).mockResolvedValue(MOCK_SESSION)
    const mockCategories = [
      { id: "cat1", name: "Alimentacao", icon: "🍔", color: "#f97316", type: "expense", userId: "user1" },
      { id: "cat2", name: "Outros", icon: "📦", color: "#6b7280", type: "both", userId: "user1" },
    ]
    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories)

    const result = await getCategories()
    expect(result.success).toBe(true)
    expect(result.data).toEqual(mockCategories)
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { userId: "user1" },
      orderBy: { name: "asc" },
    })
  })
})
