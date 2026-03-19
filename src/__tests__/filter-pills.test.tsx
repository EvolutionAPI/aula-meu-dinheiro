import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FilterPills } from "@/components/filter-pills"

describe("FilterPills", () => {
  it("renders all three filter options", () => {
    render(<FilterPills activeFilter="Mes" onFilterChange={vi.fn()} />)
    expect(screen.getByText("Hoje")).toBeInTheDocument()
    expect(screen.getByText("Semana")).toBeInTheDocument()
    expect(screen.getByText("Mes")).toBeInTheDocument()
  })

  it("marks active filter with aria-pressed", () => {
    render(<FilterPills activeFilter="Semana" onFilterChange={vi.fn()} />)
    expect(screen.getByText("Semana")).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Hoje")).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("Mes")).toHaveAttribute("aria-pressed", "false")
  })

  it("calls onFilterChange when pill is clicked", () => {
    const onChange = vi.fn()
    render(<FilterPills activeFilter="Mes" onFilterChange={onChange} />)
    fireEvent.click(screen.getByText("Hoje"))
    expect(onChange).toHaveBeenCalledWith("Hoje")
  })

  it("applies active styles to selected pill", () => {
    render(<FilterPills activeFilter="Mes" onFilterChange={vi.fn()} />)
    const activeButton = screen.getByText("Mes")
    expect(activeButton.className).toContain("bg-emerald-500")
    expect(activeButton.className).toContain("text-white")
  })

  it("applies inactive styles to non-selected pills", () => {
    render(<FilterPills activeFilter="Mes" onFilterChange={vi.fn()} />)
    const inactiveButton = screen.getByText("Hoje")
    expect(inactiveButton.className).toContain("bg-zinc-800")
    expect(inactiveButton.className).toContain("text-zinc-400")
  })
})
