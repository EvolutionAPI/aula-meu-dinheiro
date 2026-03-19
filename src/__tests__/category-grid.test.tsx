import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CategoryGrid } from "@/components/category-grid"

const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Alimentacao", icon: "🍔", color: "#f97316" },
  { id: "cat-2", name: "Transporte", icon: "🚗", color: "#3b82f6" },
  { id: "cat-3", name: "Moradia", icon: "🏠", color: "#8b5cf6" },
  { id: "cat-4", name: "Lazer", icon: "🎮", color: "#ec4899" },
  { id: "cat-5", name: "Saude", icon: "💊", color: "#ef4444" },
  { id: "cat-6", name: "Educacao", icon: "📚", color: "#06b6d4" },
  { id: "cat-7", name: "Outros", icon: "📦", color: "#6b7280" },
]

// Mock framer-motion
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
  },
}))

describe("CategoryGrid", () => {
  it("renders all 7 categories", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getAllByRole("radio")).toHaveLength(7)
  })

  it("has role=radiogroup on container", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()
  })

  it("has aria-label on radiogroup", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-label", "Selecione uma categoria")
  })

  it("renders category names", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getByText("Alimentacao")).toBeInTheDocument()
    expect(screen.getByText("Transporte")).toBeInTheDocument()
  })

  it("renders category emojis", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getByText("🍔")).toBeInTheDocument()
    expect(screen.getByText("🚗")).toBeInTheDocument()
  })

  it("calls onSelect when category is clicked", () => {
    const onSelect = vi.fn()
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={onSelect} />
    )
    fireEvent.click(screen.getByRole("radio", { name: "Alimentacao" }))
    expect(onSelect).toHaveBeenCalledWith("cat-1")
  })

  it("marks selected category with aria-checked=true", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId="cat-1" onSelect={() => {}} />
    )
    expect(screen.getByRole("radio", { name: "Alimentacao" })).toHaveAttribute("aria-checked", "true")
  })

  it("marks non-selected with aria-checked=false", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId="cat-1" onSelect={() => {}} />
    )
    expect(screen.getByRole("radio", { name: "Transporte" })).toHaveAttribute("aria-checked", "false")
  })

  it("has grid-cols-4 layout", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    expect(screen.getByRole("radiogroup").className).toContain("grid-cols-4")
  })

  it("category circles are 56x56px (h-14 w-14)", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    const circle = screen.getByText("🍔").closest(".h-14")
    expect(circle).toBeInTheDocument()
    expect(circle?.className).toContain("w-14")
  })

  it("selected category has ring-2 ring-emerald-500", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId="cat-1" onSelect={() => {}} />
    )
    const circle = screen.getByText("🍔").closest(".h-14")
    expect(circle?.className).toContain("ring-2")
    expect(circle?.className).toContain("ring-emerald-500")
  })

  it("supports ArrowRight keyboard navigation", () => {
    const onSelect = vi.fn()
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId="cat-1" onSelect={onSelect} />
    )
    const first = screen.getByRole("radio", { name: "Alimentacao" })
    fireEvent.keyDown(first, { key: "ArrowRight" })
    expect(onSelect).toHaveBeenCalledWith("cat-2")
  })

  it("supports ArrowLeft keyboard navigation with wrap", () => {
    const onSelect = vi.fn()
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId="cat-1" onSelect={onSelect} />
    )
    const first = screen.getByRole("radio", { name: "Alimentacao" })
    fireEvent.keyDown(first, { key: "ArrowLeft" })
    expect(onSelect).toHaveBeenCalledWith("cat-7")
  })

  it("first radio has tabIndex=0 when none selected", () => {
    render(
      <CategoryGrid categories={MOCK_CATEGORIES} selectedId={null} onSelect={() => {}} />
    )
    const first = screen.getByRole("radio", { name: "Alimentacao" })
    expect(first).toHaveAttribute("tabindex", "0")
    const second = screen.getByRole("radio", { name: "Transporte" })
    expect(second).toHaveAttribute("tabindex", "-1")
  })
})
