import { BottomNav } from "@/components/bottom-nav"
import { TransactionFabWrapper } from "@/components/transaction-fab-wrapper"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DEFAULT_CATEGORIES } from "@/lib/constants"

async function ensureAndGetCategories(userId: string) {
  const existing = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, icon: true, color: true, type: true },
    orderBy: { name: "asc" },
  })

  // Check if income categories exist, if not create missing ones
  const existingNames = new Set(existing.map((c) => c.name))
  const missing = DEFAULT_CATEGORIES.filter((c) => !existingNames.has(c.name))

  if (missing.length > 0) {
    await prisma.category.createMany({
      data: missing.map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
        userId,
      })),
    })
    // Re-fetch with new categories
    return prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, icon: true, color: true, type: true },
      orderBy: { name: "asc" },
    })
  }

  // Update existing categories that don't have type set properly
  const needsTypeUpdate = existing.filter(
    (c) => c.type === "expense" && DEFAULT_CATEGORIES.some((dc) => dc.name === c.name && dc.type !== "expense")
  )
  if (needsTypeUpdate.length > 0) {
    for (const cat of needsTypeUpdate) {
      const defaultCat = DEFAULT_CATEGORIES.find((dc) => dc.name === cat.name)
      if (defaultCat) {
        await prisma.category.update({
          where: { id: cat.id },
          data: { type: defaultCat.type },
        })
      }
    }
    return prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, icon: true, color: true, type: true },
      orderBy: { name: "asc" },
    })
  }

  return existing
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  const categories = session ? await ensureAndGetCategories(session.userId) : []

  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto max-w-[428px] px-6 pb-24">
        {children}
      </main>
      <BottomNav />
      <TransactionFabWrapper categories={categories} />
    </div>
  )
}
