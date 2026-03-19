import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { TransactionForm } from "@/components/transaction-form"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      whileTap,
      animate,
      transition,
      ...props
    }: React.ComponentProps<"button"> & {
      whileTap?: unknown
      animate?: unknown
      transition?: unknown
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      initial,
      animate,
      exit,
      ...props
    }: React.ComponentProps<"div"> & {
      initial?: unknown
      animate?: unknown
      exit?: unknown
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock base-ui tabs
vi.mock("@base-ui/react/tabs", () => ({
  Tabs: {
    Root: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-slot="tabs" {...props}>{children}</div>
    ),
    List: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-slot="tabs-list" role="tablist" {...props}>{children}</div>
    ),
    Tab: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <button role="tab" {...props}>{children}</button>
    ),
    Panel: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-slot="tabs-content" {...props}>{children}</div>
    ),
  },
}))

// Mock server action
vi.mock("@/actions/transactions", () => ({
  createTransaction: vi.fn(),
}))

const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Alimentacao", icon: "🍔", color: "#f97316", type: "expense" },
  { id: "cat-2", name: "Transporte", icon: "🚗", color: "#3b82f6", type: "expense" },
  { id: "cat-3", name: "Moradia", icon: "🏠", color: "#8b5cf6", type: "expense" },
  { id: "cat-4", name: "Lazer", icon: "🎮", color: "#ec4899", type: "expense" },
  { id: "cat-5", name: "Saude", icon: "💊", color: "#ef4444", type: "expense" },
  { id: "cat-6", name: "Educacao", icon: "📚", color: "#06b6d4", type: "expense" },
  { id: "cat-7", name: "Outros", icon: "📦", color: "#6b7280", type: "both" },
]

// Helper to find the value display span
function getValueDisplay() {
  return document.querySelector(".text-3xl")!
}

describe("TransactionForm", () => {
  it("renders initial value R$ 0,00", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    expect(getValueDisplay().textContent).toBe("R$\u00a00,00")
  })

  it("renders Despesa and Receita tabs", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    expect(screen.getByText("Despesa")).toBeInTheDocument()
    expect(screen.getByText("Receita")).toBeInTheDocument()
  })

  it("renders numeric keypad", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument()
  })

  it("renders category grid with provided categories", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    const radioButtons = screen.getAllByRole("radio")
    expect(radioButtons).toHaveLength(7)
  })

  it("renders description field collapsed", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    expect(screen.getByText("Adicionar nota...")).toBeInTheDocument()
  })

  it("updates value when digits are pressed", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    fireEvent.click(screen.getByRole("button", { name: "1" }))
    fireEvent.click(screen.getByRole("button", { name: "2" }))
    fireEvent.click(screen.getByRole("button", { name: "3" }))
    expect(getValueDisplay().textContent).toBe("R$\u00a01,23")
  })

  it("backspace removes last digit", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    fireEvent.click(screen.getByRole("button", { name: "1" }))
    fireEvent.click(screen.getByRole("button", { name: "2" }))
    const backspaceBtn = screen.getByRole("button", { name: "Apagar" })
    fireEvent.pointerDown(backspaceBtn)
    fireEvent.pointerUp(backspaceBtn)
    expect(getValueDisplay().textContent).toBe("R$\u00a00,01")
  })

  it("does not exceed 9 digits", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole("button", { name: "9" }))
    }
    expect(getValueDisplay().textContent).toBe("R$\u00a09.999.999,99")
  })

  it("selects category", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    const alimentacao = screen.getByRole("radio", { name: "Alimentacao" })
    fireEvent.click(alimentacao)
    expect(alimentacao).toHaveAttribute("aria-checked", "true")
  })

  it("shows validation messages when submitting without data", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    fireEvent.click(screen.getByText("Registrar"))
    expect(screen.getByText("Digite um valor")).toBeInTheDocument()
    expect(screen.getByText("Selecione uma categoria")).toBeInTheDocument()
  })

  it("renders Registrar button", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    expect(screen.getByText("Registrar")).toBeInTheDocument()
  })

  it("comma button adds 00 (double zero)", () => {
    render(<TransactionForm categories={MOCK_CATEGORIES} />)
    fireEvent.click(screen.getByRole("button", { name: "1" }))
    fireEvent.click(screen.getByRole("button", { name: "Virgula" }))
    // 1 + "00" = "100" cents = R$ 1,00
    expect(getValueDisplay().textContent).toBe("R$\u00a01,00")
  })
})
