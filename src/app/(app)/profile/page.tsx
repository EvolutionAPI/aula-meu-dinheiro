import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { UserAvatar } from "@/components/user-avatar"
import { LogoutButton } from "@/components/logout-button"
import { Moon, UserCog } from "lucide-react"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center pt-12">
      <h1 className="sr-only">Perfil</h1>

      <section className="flex flex-col items-center gap-3" aria-label="Informacoes do usuario">
        <UserAvatar name={session.name} size="lg" />
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{session.name}</p>
          <p className="text-sm text-muted-foreground">{session.email}</p>
        </div>
      </section>

      <section className="mt-10 w-full" aria-label="Configuracoes">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Configuracoes</h2>
        <div className="overflow-hidden rounded-2xl bg-card divide-y divide-border">
          <div className="flex min-h-[48px] items-center gap-3 px-4">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">Tema escuro</span>
          </div>

          <div className="flex min-h-[48px] items-center gap-3 px-4">
            <UserCog className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">Informacoes da conta</span>
          </div>

          <LogoutButton />
        </div>
      </section>
    </div>
  )
}
