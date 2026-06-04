"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { GlassCard } from "@/components/brand/glass-card"

export type ShowcaseCard = {
  key:             string
  displayName:     string
  initials:        string
  avatarColor:     string
  image:           string | null
  profileUsername: string | null
  projectCount?:   number
}

function BuilderCard({ card, index }: { card: ShowcaseCard; index: number }) {
  const subtitle = card.projectCount
    ? `${card.projectCount} project${card.projectCount !== 1 ? "s" : ""}`
    : "GenLayer Builder"

  const inner = (
    <GlassCard className="group h-full p-5 transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.displayName}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-brand-indigo-3/30"
          />
        ) : (
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ring-2 ring-brand-indigo-3/30"
            style={{ backgroundColor: card.avatarColor }}
          >
            {card.initials}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate font-ui text-sm font-bold text-brand-navy">
            {card.displayName}
          </div>
          <div className="font-mono text-[10px] text-brand-indigo/60">{subtitle}</div>
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
      {card.profileUsername ? (
        <Link href={`/builders/${card.profileUsername}`} className="block h-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  )
}

export function ShowcaseGrid({ cards }: { cards: ShowcaseCard[] }) {
  return (
    <>
      <motion.div
        className="mb-14 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
          Who&apos;s Building
        </span>
        <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
          Meet the GenLayer
          <br />
          Builder Community
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-base text-brand-navy/55">
          Real builders. All building in public.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card, i) => (
          <BuilderCard key={card.key} card={card} index={i} />
        ))}
      </div>
    </>
  )
}
