"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/brand/glass-card"
import { TileGrid } from "@/components/brand/tile-grid"
import type { TileColor } from "@/components/brand/mosaic-tile"

const FREE_BADGE: (TileColor | null)[][] = [
  ["amber", "amber-lt"],
  ["amber-lt", "amber"],
]

const FEATURES = [
  "Builder profile",
  "Submit projects",
  "Browse & upvote projects",
  "Post build updates",
  "Join discussions",
  "Peer review other builders' work",
  "Follow builders",
  "Community feed",
]

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-brand-indigo" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PricingSection() {
  return (
    <section id="pricing" className="bg-brand-cream px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
            Pricing
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            Free for Everyone
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-brand-navy/55">
            GenHub is a community platform. No paywalls, no tiers — every builder gets full access.
          </p>
        </motion.div>

        {/* Single card */}
        <motion.div
          className="mx-auto max-w-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard glow="amber" className="flex flex-col p-8 border-brand-amber/30">
            {/* Badge */}
            <div className="mb-6 flex items-center gap-2">
              <TileGrid pattern={FREE_BADGE} tileSize={12} gap={2} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-amber">
                Full Access
              </span>
            </div>

            {/* Price */}
            <div className="mb-2">
              <div className="font-mono text-xs font-bold uppercase tracking-widest text-brand-indigo/50">
                Free
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-5xl font-black text-brand-navy">$0</span>
                <span className="font-body text-sm text-brand-navy/40">forever</span>
              </div>
            </div>

            {/* Features */}
            <ul className="my-8 space-y-3" role="list">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-body text-sm text-brand-navy/70">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/login"
              className="rounded-pill bg-brand-indigo px-6 py-3 text-center font-ui text-sm font-semibold text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none"
            >
              Join the Community
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
