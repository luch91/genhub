"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/brand/glass-card"
import { TileGrid } from "@/components/brand/tile-grid"
import type { TileColor } from "@/components/brand/mosaic-tile"

// "Most Popular" mosaic badge tiles (2×2)
const POPULAR_BADGE: (TileColor | null)[][] = [
  ["amber", "amber-lt"],
  ["amber-lt", "amber"],
]

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started contributing to the GenLayer ecosystem.",
    features: [
      "Builder profile",
      "Browse all projects",
      "Upvote & comment",
      "Join discussions",
      "1 submission credit",
    ],
    cta: "Get Started",
    ctaHref: "/login",
    style: "standard" as const,
    popular: false,
  },
  {
    name: "Contributor",
    price: "$9",
    period: "/ month",
    description: "For builders who ship regularly and want full visibility.",
    features: [
      "Everything in Free",
      "5 submission credits / mo",
      "Verified builder badge",
      "Priority review queue",
      "Reputation boosts",
      "Mission eligibility",
    ],
    cta: "Join Contributor",
    ctaHref: "/login",
    style: "pro" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams, foundations, and ecosystem partners.",
    features: [
      "Everything in Contributor",
      "Unlimited credits",
      "Team accounts",
      "Custom missions & bounties",
      "Foundation partnership",
      "Dedicated support",
    ],
    cta: "Contact Us",
    ctaHref: "mailto:hello@genhub.xyz",
    style: "standard" as const,
    popular: false,
  },
]

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 text-brand-indigo" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PricingCard({ tier, index }: { tier: (typeof TIERS)[number]; index: number }) {
  const isPro = tier.style === "pro"

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={isPro ? "relative z-10 md:-my-4" : ""}
    >
      <GlassCard
        glow={isPro ? "amber" : "none"}
        className={`flex h-full flex-col p-7 ${isPro ? "border-brand-amber/30" : ""}`}
      >
        {/* Popular badge */}
        {tier.popular && (
          <div className="mb-4 flex items-center gap-2">
            <TileGrid pattern={POPULAR_BADGE} tileSize={12} gap={2} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-amber">
              Most Popular
            </span>
          </div>
        )}

        {/* Name + price */}
        <div className="mb-6">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-brand-indigo/50">
            {tier.name}
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-4xl font-black text-brand-navy">{tier.price}</span>
            {tier.period && (
              <span className="font-body text-sm text-brand-navy/40">{tier.period}</span>
            )}
          </div>
          <p className="mt-2 font-body text-sm text-brand-navy/55">{tier.description}</p>
        </div>

        {/* Features */}
        <ul className="mb-8 flex-1 space-y-2.5" role="list">
          {tier.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 font-body text-sm text-brand-navy/70">
              <CheckIcon />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={tier.ctaHref}
          className={
            isPro
              ? "rounded-pill bg-brand-indigo px-6 py-3 text-center font-ui text-sm font-semibold text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none"
              : "glass-card rounded-pill border border-brand-indigo/20 px-6 py-3 text-center font-ui text-sm font-semibold text-brand-indigo transition-all hover:border-brand-indigo/40"
          }
        >
          {tier.cta}
        </Link>
      </GlassCard>
    </motion.div>
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
            Plans
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            Pick Your Builder Level
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
