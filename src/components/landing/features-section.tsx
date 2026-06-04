"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { GlassCard } from "@/components/brand/glass-card"
import { TileGrid } from "@/components/brand/tile-grid"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { TileColor } from "@/components/brand/mosaic-tile"

// 3×3 tile icons per feature (PRD §4.5)
const ICONS: { pattern: (TileColor | null)[][] }[] = [
  { pattern: [["amber","amber-lt","amber"],["amber-lt","amber","amber-lt"],["amber","amber-lt","amber"]] },
  { pattern: [["amber","amber","amber"],["amber-lt","amber-lt","amber-lt"],["amber","amber","amber"]] },
  { pattern: [["indigo","indigo-3","indigo"],["indigo-3","lavender","indigo-3"],["indigo","indigo-3","indigo"]] },
  { pattern: [["indigo","indigo","mist"],["indigo","mist","indigo"],["mist","indigo","indigo"]] },
  { pattern: [["navy","indigo","navy"],["indigo","navy","indigo"],["navy","indigo","navy"]] },
  { pattern: [["amber","navy","amber"],["navy","amber","navy"],["amber","navy","amber"]] },
]

const FEATURES = [
  {
    title: "Submit Your Project",
    body:  "Publish your Intelligent Contract project with a required on-chain angle — keeping the feed high-signal and GenLayer-specific.",
    size:  "large",
    iconIdx: 0,
  },
  {
    title: "Community Upvotes",
    body:  "The community surfaces the best work. Upvote projects you believe in and help the best builders get ecosystem visibility.",
    size:  "large",
    iconIdx: 1,
  },
  {
    title: "Builder Profiles",
    body:  "Showcase your portfolio and let others follow your journey.",
    size:  "small",
    iconIdx: 2,
  },
  {
    title: "Idea Threads",
    body:  "Open a discussion, propose an idea, or ask the community for feedback before you write a line of code.",
    size:  "small",
    iconIdx: 3,
  },
  {
    title: "Community Curation",
    body:  "Projects go live instantly. Earn 5 upvotes in 2 weeks to stay in the gallery — or resubmit and try again.",
    size:  "small",
    iconIdx: 4,
  },
  {
    title: "Community Discussions",
    body:  "Ask questions, share ideas, and get feedback from other builders — before you write a single line of code.",
    size:  "small",
    iconIdx: 5,
  },
]

function FeatureCard({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -40])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.02])

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 40 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={reduced ? {} : { y, scale } as unknown as React.CSSProperties}
      className={feature.size === "large" ? "col-span-1 md:col-span-2" : "col-span-1"}
    >
      <GlassCard className="group h-full p-6 transition-all duration-200 hover:scale-[1.015]">
        <TileGrid pattern={ICONS[feature.iconIdx].pattern} tileSize={18} gap={2} />
        <h3 className="mt-4 font-ui text-lg font-bold text-brand-navy">{feature.title}</h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-brand-navy/55">
          {feature.body}
        </p>
      </GlassCard>
    </motion.div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="bg-brand-cream px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
            What You Can Do Here
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            Built for Builders.{" "}
            <span className="text-gradient-indigo">By Builders.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-brand-navy/55">
            Everything you need to share your work, find collaborators, and move the
            GenLayer ecosystem forward.
          </p>
        </motion.div>

        {/* Bento grid — 2 large + 4 small */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
