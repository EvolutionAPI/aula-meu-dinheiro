"use client"

export type FilterType = "Hoje" | "Semana" | "Mes"

const FILTERS: FilterType[] = ["Hoje", "Semana", "Mes"]

interface FilterPillsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Filtros de periodo">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          aria-pressed={activeFilter === filter}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
            activeFilter === filter
              ? "bg-emerald-500 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
