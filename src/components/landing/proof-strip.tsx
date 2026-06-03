"use client"

import { motion } from "framer-motion"

const BUILDERS = [
  { name: "Pavel",       initials: "PV", color: "#4f46e5" },
  { name: "emark",       initials: "EM", color: "#fbbf24" },
  { name: "Mr Network",  initials: "MN", color: "#6366f1" },
  { name: "JayDeculein", initials: "JD", color: "#1a1a2e" },
  { name: "Dude",        initials: "DU", color: "#818cf8" },
  { name: "Gen.Dave",    initials: "GD", color: "#f59e0b" },
  { name: "Ying",        initials: "YI", color: "#4f46e5" },
  { name: "gaymused",    initials: "GM", color: "#a5b4fc" },
]

function BuilderChip({ name, initials, color }: (typeof BUILDERS)[number]) {
  return (
    <div className="flex flex-shrink-0 items-center gap-2.5 rounded-pill border border-brand-indigo/10 bg-white/70 px-4 py-2 backdrop-blur-sm">
      <span
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="font-ui text-xs font-semibold text-brand-navy leading-none">
        {name}
      </div>
    </div>
  )
}

const doubled = [...BUILDERS, ...BUILDERS]

export function ProofStrip() {
  return (
    <section className="bg-brand-cream py-14">
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-brand-navy/40">
          Built by the{" "}
          <span className="text-brand-indigo">GenLayer</span> builder community
        </span>
      </motion.div>

      <div
        className="relative overflow-hidden"
        role="marquee"
        aria-label="Community members"
      >
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-cream to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-cream to-transparent" aria-hidden="true" />

        <div className="animate-marquee flex gap-3 py-1" style={{ width: "max-content" }}>
          {doubled.map((b, i) => (
            <BuilderChip key={i} {...b} />
          ))}
        </div>
      </div>
    </section>
  )
}
