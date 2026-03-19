import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsLoading() {
  return (
    <div className="py-6 space-y-4" aria-hidden="true">
      <Skeleton className="h-7 w-40 bg-zinc-700" />

      <div className="flex gap-2">
        <Skeleton className="h-8 w-16 rounded-full bg-zinc-700" />
        <Skeleton className="h-8 w-20 rounded-full bg-zinc-700" />
        <Skeleton className="h-8 w-14 rounded-full bg-zinc-700" />
      </div>

      <Skeleton className="h-20 w-full rounded-xl bg-zinc-700" />

      <div className="space-y-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-10 w-10 rounded-full bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 bg-zinc-700" />
              <Skeleton className="h-3 w-20 bg-zinc-800" />
            </div>
            <Skeleton className="h-4 w-16 bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
