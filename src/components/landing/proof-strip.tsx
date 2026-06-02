"use client"

import { motion } from "framer-motion"

const BUILDERS = [
  { handle: "alice.eth",   name: "Alice Chen",      initials: "AC", color: "#4f46e5" },
  { handle: "bob.xyz",     name: "Bob Nakamura",    initials: "BN", color: "#fbbf24" },
  { handle: "carol.eth",   name: "Carol Santos",    initials: "CS", color: "#6366f1" },
  { handle: "dave.lens",   name: "Dave Okafor",     initials: "DO", color: "#1a1a2e" },
  { handle: "eve.eth",     name: "Eve Lindqvist",   initials: "EL", color: "#818cf8" },
  { handle: "frank.xyz",   name: "Frank Muller",    initials: "FM", color: "#4f46e5" },
  { handle: "grace.eth",   name: "Grace Park",      initials: "GP", color: "#f59e0b" },
  { handle: "hiro.eth",    name: "Hiro Tanaka",     initials: "HT", color: "#a5b4fc" },
  { handle: "iris.lens",   name: "Iris Ferreira",   initials: "IF", color: "#4f46e5" },
  { handle: "jake.xyz",    name: "Jake Williams",   initials: "JW", color: "#fbbf24" },
  { handle: "kira.eth",    name: "Kira Bogdanov",   initials: "KB", color: "#6366f1" },
  { handle: "leo.eth",     name: "Leo Mwangi",      initials: "LM", color: "#1a1a2e" },
]

function BuilderChip({ handle, name, initials, color }: (typeof BUILDERS)[number]) {
  return (
    <div className="flex flex-shrink-0 items-center gap-2.5 rounded-pill border border-brand-indigo/10 bg-white/70 px-4 py-2 backdrop-blur-sm">
      <span
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold text-white"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {initials}
      </span>
      <div>
        <div className="font-ui text-xs font-semibold text-brand-navy leading-none">
          {name}
        </div>
        <div className="font-mono text-[10px] text-brand-indigo/60 mt-0.5">
          @{handle}
        </div>
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
          Trusted by{" "}
          <span className="text-brand-indigo">500+</span> GenLayer builders
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
