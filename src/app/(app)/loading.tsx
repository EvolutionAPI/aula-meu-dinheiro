export default function Loading() {
  return (
    <div className="space-y-6 py-6" aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-800" />
      </div>

      {/* Hero card skeleton */}
      <div className="rounded-2xl bg-zinc-800 p-4 shadow-lg" style={{ borderLeft: "4px solid #3f3f46" }}>
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-700" />
        <div className="mt-2 h-9 w-44 animate-pulse rounded bg-zinc-700" />
        <div className="mt-3 h-3 w-52 animate-pulse rounded bg-zinc-700" />
      </div>

      {/* Transactions skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 animate-pulse rounded bg-zinc-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
