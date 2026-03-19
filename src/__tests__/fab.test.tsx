import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Fab } from "@/components/fab"

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
  useReducedMotion: () => false,
}))

describe("Fab", () => {
  it("renders with correct aria-label", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button", { name: "Adicionar nova transacao" })
    expect(button).toBeInTheDocument()
  })

  it("renders Plus icon", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button")
    const svg = button.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn()
    render(<Fab onClick={handleClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    render(<Fab onClick={() => {}} disabled />)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("has emerald background when not disabled", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("bg-emerald-500")
  })

  it("has zinc background when disabled", () => {
    render(<Fab onClick={() => {}} disabled />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("bg-zinc-600")
    expect(button.className).toContain("opacity-60")
  })

  it("has fixed positioning with z-50", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("fixed")
    expect(button.className).toContain("z-50")
  })

  it("has 56x56px size (h-14 w-14)", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("h-14")
    expect(button.className).toContain("w-14")
  })

  it("has focus-visible ring styles", () => {
    render(<Fab onClick={() => {}} />)
    const button = screen.getByRole("button")
    expect(button.className).toContain("focus-visible:ring-2")
    expect(button.className).toContain("focus-visible:ring-emerald-500")
  })
})
