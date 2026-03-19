import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CategoryGrid } from "@/components/category-grid"

const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Alimentacao", icon: "🍔", color: "#f97316", type: "expense" },
  { id: "cat-2", name: "Transporte", icon: "🚗", color: "#3b82f6", type: "expense" },
  { id: "cat-3", name: "Outros", icon: "📦", color: "#6b7280", type: "both" },
  { id: "cat-4", name: "Salario", icon: "💰", color: "#10b981", type: "income" },
]

vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      animate,
      transition,
      ...props
    }: React.ComponentProps<"button"> & { animate?: unknown; transition?: unknown }) => (
      <button {...props}>{children}</button>
    ),
    div: ({
      children,
      layout,
      initial,
      animate,
      exit,
      ...props
    }: React.ComponentProps<"div"> & {
      layout?: unknown
      initial?: unknown
      animate?: unknown
      exit?: unknown
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("@/actions/categories", () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))

describe("CategoryGrid with onAddNew", () => {
  it("renders add button when onAddNew is provided", () => {
    render(
      <CategoryGrid
        categories={MOCK_CATEGORIES}
        selectedId={null}
        onSelect={() => {}}
        onAddNew={() => {}}
      />
    )
    expect(screen.getByLabelText("Nova categoria")).toBeInTheDocument()
  })

  it("does not render add button when onAddNew is not provided", () => {
    render(
      <CategoryGrid
        categories={MOCK_CATEGORIES}
        selectedId={null}
        onSelect={() => {}}
      />
    )
    expect(screen.queryByLabelText("Nova categoria")).not.toBeInTheDocument()
  })

  it("calls onAddNew when add button is clicked", () => {
    const onAddNew = vi.fn()
    render(
      <CategoryGrid
        categories={MOCK_CATEGORIES}
        selectedId={null}
        onSelect={() => {}}
        onAddNew={onAddNew}
      />
    )
    fireEvent.click(screen.getByLabelText("Nova categoria"))
    expect(onAddNew).toHaveBeenCalledOnce()
  })

  it("renders + text in the add button", () => {
    render(
      <CategoryGrid
        categories={MOCK_CATEGORIES}
        selectedId={null}
        onSelect={() => {}}
        onAddNew={() => {}}
      />
    )
    expect(screen.getByText("+")).toBeInTheDocument()
    expect(screen.getByText("Nova")).toBeInTheDocument()
  })
})
