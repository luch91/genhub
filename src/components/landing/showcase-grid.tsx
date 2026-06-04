"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { GlassCard } from "@/components/brand/glass-card"

export type ShowcaseBuilder = {
  id: string
  name: string | null
  username: string | null
  image: string | null
  _count: { projects: number }
}

const AVATAR_COLORS = [
  "#4f46e5", "#fbbf24", "#6366f1", "#1a1a2e",
  "#818cf8", "#f59e0b", "#a5b4fc", "#4338ca",
]

function getInitials(name: string | null, username: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  if (username) return username.slice(0, 2).toUpperCase()
  return "??"
}

function getAvatarColor(id: string): string {
  const hash = Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function BuilderCard({ builder, index }: { builder: ShowcaseBuilder; index: number }) {
  const href = builder.username ? `/builders/${builder.username}` : null
  const label = builder.name ?? builder.username ?? "Builder"

  const inner = (
    <GlassCard className="group h-full p-5 transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        {builder.image ? (
          <Image
            src={builder.image}
            alt={label}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-brand-indigo-3/30"
          />
        ) : (
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ring-2 ring-brand-indigo-3/30"
            style={{ backgroundColor: getAvatarColor(builder.id) }}
          >
            {getInitials(builder.name, builder.username)}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate font-ui text-sm font-bold text-brand-navy">{label}</div>
          <div className="font-mono text-[10px] text-brand-indigo/60">
            {builder._count.projects} project{builder._count.projects !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </GlassCard>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {href ? (
        <Link href={href} className="block h-full">{inner}</Link>
      ) : (
        inner
      )}
    </motion.div>
  )
}

export function ShowcaseGrid({ builders }: { builders: ShowcaseBuilder[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {builders.map((b, i) => (
        <BuilderCard key={b.id} builder={b} index={i} />
      ))}
    </div>
  )
}
