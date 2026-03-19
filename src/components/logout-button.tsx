import { logout } from "@/actions/auth"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full min-h-[48px] items-center gap-3 px-4 text-red-400 hover:bg-accent transition-colors cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </form>
  )
}
