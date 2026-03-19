import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TRANSACTION_TYPE } from "@/lib/constants"
import { DashboardClient } from "@/components/dashboard-client"

async function getBalance(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const dateFilter = {
    userId,
    createdAt: { gte: startOfMonth, lt: startOfNextMonth },
  }

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...dateFilter, type: TRANSACTION_TYPE.INCOME },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...dateFilter, type: TRANSACTION_TYPE.EXPENSE },
      _sum: { amount: true },
    }),
  ])

  const income = incomeResult._sum.amount ?? 0
  const expenses = expenseResult._sum.amount ?? 0

  return { balance: income - expenses, income, expenses }
}

async function getRecentTransactions(userId: string, limit = 5) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { balance, income, expenses } = await getBalance(session.userId)
  const recentTransactions = await getRecentTransactions(session.userId)

  return (
    <DashboardClient
      userName={session.name}
      balance={balance}
      income={income}
      expenses={expenses}
      monthlyIncome={session.monthlyIncome}
      recentTransactions={recentTransactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        category: {
          name: t.category.name,
          icon: t.category.icon,
          color: t.category.color,
        },
      }))}
    />
  )
}
