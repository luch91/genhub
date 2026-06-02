import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "amber" | "indigo" | "none"
  chromatic?: boolean
}

export function GlassCard({
  glow = "none",
  chromatic = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        glow === "amber"  && "chromatic-pulse",
        glow === "indigo" && "badge-pulse",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
