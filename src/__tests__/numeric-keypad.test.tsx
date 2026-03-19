import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { NumericKeypad } from "@/components/numeric-keypad"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      whileTap,
      transition,
      ...props
    }: React.ComponentProps<"button"> & { whileTap?: unknown; transition?: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
}))

describe("NumericKeypad", () => {
  const defaultProps = {
    onDigit: vi.fn(),
    onDecimal: vi.fn(),
    onBackspace: vi.fn(),
    onClear: vi.fn(),
  }

  it("renders all 12 buttons (0-9, comma, backspace)", () => {
    render(<NumericKeypad {...defaultProps} />)
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(12)
  })

  it("renders digit buttons 0-9", () => {
    render(<NumericKeypad {...defaultProps} />)
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole("button", { name: String(i) })).toBeInTheDocument()
    }
  })

  it("renders comma button", () => {
    render(<NumericKeypad {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Virgula" })).toBeInTheDocument()
  })

  it("renders backspace button", () => {
    render(<NumericKeypad {...defaultProps} />)
    expect(screen.getByRole("button", { name: "Apagar" })).toBeInTheDocument()
  })

  it("calls onDigit when digit button is clicked", () => {
    const onDigit = vi.fn()
    render(<NumericKeypad {...defaultProps} onDigit={onDigit} />)
    fireEvent.click(screen.getByRole("button", { name: "5" }))
    expect(onDigit).toHaveBeenCalledWith("5")
  })

  it("calls onDecimal when comma button is clicked", () => {
    const onDecimal = vi.fn()
    render(<NumericKeypad {...defaultProps} onDecimal={onDecimal} />)
    fireEvent.click(screen.getByRole("button", { name: "Virgula" }))
    expect(onDecimal).toHaveBeenCalledTimes(1)
  })

  it("calls onBackspace on short press of backspace", () => {
    const onBackspace = vi.fn()
    render(<NumericKeypad {...defaultProps} onBackspace={onBackspace} />)
    const backspaceBtn = screen.getByRole("button", { name: "Apagar" })
    fireEvent.pointerDown(backspaceBtn)
    fireEvent.pointerUp(backspaceBtn)
    expect(onBackspace).toHaveBeenCalledTimes(1)
  })

  it("buttons have correct dimensions (w-16 h-12)", () => {
    render(<NumericKeypad {...defaultProps} />)
    const button = screen.getByRole("button", { name: "1" })
    expect(button.className).toContain("w-16")
    expect(button.className).toContain("h-12")
  })

  it("buttons have bg-zinc-800 and rounded-xl", () => {
    render(<NumericKeypad {...defaultProps} />)
    const button = screen.getByRole("button", { name: "1" })
    expect(button.className).toContain("bg-zinc-800")
    expect(button.className).toContain("rounded-xl")
  })
})
