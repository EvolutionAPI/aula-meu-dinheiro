import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { TransactionsList } from "@/components/transactions-list"

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, layout, whileDrag, drag, dragConstraints, dragElastic, onDragEnd, style, ...domProps } = props as Record<string, unknown>
      return <div {...(domProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useReducedMotion: () => false,
  useMotionValue: (initial: number) => ({ get: () => initial, set: () => {} }),
  useTransform: () => 1,
}))

// Fixed date to avoid midnight flakiness (L2)
const FIXED_DATE = new Date(2026, 2, 19, 14, 0, 0)

const mockTransactions = [
  {
    id: "tx1",
    amount: 150.5,
    type: "expense",
    description: "Almoco",
    createdAt: FIXED_DATE.toISOString(),
    categoryId: "cat1",
    userId: "user1",
    category: { id: "cat1", name: "Alimentacao", icon: "🍔", color: "#f97316" },
  },
  {
    id: "tx2",
    amount: 3000,
    type: "income",
    description: null,
    createdAt: FIXED_DATE.toISOString(),
    categoryId: "cat2",
    userId: "user1",
    category: { id: "cat2", name: "Salario", icon: "💰", color: "#10b981" },
  },
]

describe("TransactionsList", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_DATE)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders filter pills with Mes active by default", () => {
    render(<TransactionsList transactions={mockTransactions} />)
    expect(screen.getByText("Mes")).toHaveAttribute("aria-pressed", "true")
  })

  it("renders transaction items", () => {
    render(<TransactionsList transactions={mockTransactions} />)
    expect(screen.getByText("Alimentacao")).toBeInTheDocument()
    expect(screen.getByText("Salario")).toBeInTheDocument()
  })

  it("renders summary with correct income and expense values", () => {
    render(<TransactionsList transactions={mockTransactions} />)
    // Income: R$ 3.000,00 / Expenses: R$ 150,50 / Total: |3000 - 150.5| = R$ 2.849,50
    expect(screen.getByText(/Receitas:.*3\.000,00/)).toBeInTheDocument()
    expect(screen.getByText(/Despesas:.*150,50/)).toBeInTheDocument()
    expect(screen.getByText(/Total:.*2\.849,50/)).toBeInTheDocument()
  })

  it("shows empty state when no transactions match filter", () => {
    // Create transaction from a different month
    const oldTransactions = [
      {
        ...mockTransactions[0],
        createdAt: new Date(2025, 0, 1).toISOString(),
      },
    ]
    render(<TransactionsList transactions={oldTransactions} />)
    expect(screen.getByText("Sem transacoes neste periodo")).toBeInTheDocument()
    expect(screen.getByText("Tente selecionar outro periodo")).toBeInTheDocument()
  })

  it("switches filter when pill is clicked", () => {
    render(<TransactionsList transactions={mockTransactions} />)
    fireEvent.click(screen.getByText("Hoje"))
    expect(screen.getByText("Hoje")).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Mes")).toHaveAttribute("aria-pressed", "false")
  })
})
