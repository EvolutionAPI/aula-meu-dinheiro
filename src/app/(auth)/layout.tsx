export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  )
}
