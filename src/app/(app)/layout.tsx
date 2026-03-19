import { BottomNav } from "@/components/bottom-nav"
import { TransactionFabWrapper } from "@/components/transaction-fab-wrapper"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"

async function getUserCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, icon: true, color: true },
    orderBy: { name: "asc" },
  })
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const categories = session ? await getUserCategories(session.userId) : []

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[428px] px-6 pb-24">
        {children}
      </main>
      <BottomNav />
      <TransactionFabWrapper categories={categories} />
    </div>
  )
}
