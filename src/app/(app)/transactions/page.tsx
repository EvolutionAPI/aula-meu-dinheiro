import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransactionsList } from "@/components/transactions-list"

export default async function TransactionsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const serializedTransactions = transactions.map((t) => ({
    id: t.id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    createdAt: t.createdAt.toISOString(),
    categoryId: t.categoryId,
    userId: t.userId,
    category: {
      id: t.category.id,
      name: t.category.name,
      icon: t.category.icon,
      color: t.category.color,
    },
  }))

  return (
    <div className="py-6 space-y-4">
      <h1 className="text-xl font-bold text-zinc-50">Transacoes</h1>
      <TransactionsList transactions={serializedTransactions} />
    </div>
  )
}
