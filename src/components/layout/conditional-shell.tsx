"use client"

import { usePathname } from "next/navigation"

interface ConditionalShellProps {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  soundToggle: React.ReactNode
}

export function ConditionalShell({ children, header, footer, soundToggle }: ConditionalShellProps) {
  const pathname = usePathname()
  const isLanding = pathname === "/"

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {soundToggle}
    </div>
  )
}
