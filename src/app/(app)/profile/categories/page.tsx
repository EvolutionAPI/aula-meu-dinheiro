import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CategoryManagement } from "@/components/category-management"

export default async function CategoriesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.userId },
    orderBy: { name: "asc" },
  })

  return (
    <div className="flex flex-col pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Categorias</h1>
      </div>

      <CategoryManagement categories={categories} />
    </div>
  )
}
