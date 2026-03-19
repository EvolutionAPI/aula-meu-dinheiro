import { cn, getInitials } from "@/lib/utils"

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-xl",
  lg: "h-24 w-24 text-3xl",
} as const

interface UserAvatarProps {
  name: string
  size?: keyof typeof sizeClasses
  className?: string
}

export function UserAvatar({ name, size = "lg", className }: UserAvatarProps) {
  return (
    <div
      role="img"
      aria-label={`Avatar de ${name}`}
      className={cn(
        "flex items-center justify-center rounded-full bg-emerald-500 font-bold text-white",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
