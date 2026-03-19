import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { BottomSheet } from "@/components/bottom-sheet"

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      drag,
      dragConstraints,
      dragElastic,
      dragControls,
      dragListener,
      onDragEnd,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: React.ComponentProps<"div"> & {
      drag?: unknown
      dragConstraints?: unknown
      dragElastic?: unknown
      dragControls?: unknown
      dragListener?: unknown
      onDragEnd?: unknown
      initial?: unknown
      animate?: unknown
      exit?: unknown
      transition?: unknown
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
  useDragControls: () => ({ start: vi.fn() }),
}))

describe("BottomSheet", () => {
  beforeEach(() => {
    document.body.style.overflow = ""
  })

  afterEach(() => {
    document.body.style.overflow = ""
  })

  it("renders children when open", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Test content</p>
      </BottomSheet>
    )
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })

  it("does not render children when closed", () => {
    render(
      <BottomSheet isOpen={false} onClose={() => {}}>
        <p>Test content</p>
      </BottomSheet>
    )
    expect(screen.queryByText("Test content")).not.toBeInTheDocument()
  })

  it("has role=dialog and aria-modal=true when open", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(dialog).toHaveAttribute("aria-label", "Registrar transacao")
  })

  it("calls onClose when backdrop is clicked", () => {
    const handleClose = vi.fn()
    render(
      <BottomSheet isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </BottomSheet>
    )
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when Escape is pressed", () => {
    const handleClose = vi.fn()
    render(
      <BottomSheet isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </BottomSheet>
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("blocks body scroll when open", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("restores body scroll when closed", () => {
    const { rerender } = render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    expect(document.body.style.overflow).toBe("hidden")

    rerender(
      <BottomSheet isOpen={false} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    expect(document.body.style.overflow).toBe("")
  })

  it("has drag handle with correct styles", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    const handleBar = document.querySelector(".h-1.w-10.rounded-full.bg-zinc-600")
    expect(handleBar).toBeInTheDocument()
  })

  it("has backdrop with correct classes", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop?.className).toContain("fixed")
    expect(backdrop?.className).toContain("inset-0")
    expect(backdrop?.className).toContain("z-50")
    expect(backdrop?.className).toContain("bg-zinc-950/80")
  })

  it("has sheet with correct max-width and height", () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>Content</p>
      </BottomSheet>
    )
    const dialog = screen.getByRole("dialog")
    expect(dialog.className).toContain("max-w-[428px]")
    expect(dialog.className).toContain("h-[75%]")
    expect(dialog.className).toContain("rounded-t-2xl")
    expect(dialog.className).toContain("bg-zinc-900")
  })
})
