"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/brand/glass-card"

const MEMBERS = [
  { name: "Pavel",       initials: "PV", avatarColor: "#4f46e5" },
  { name: "emark",       initials: "EM", avatarColor: "#fbbf24" },
  { name: "Mr Network",  initials: "MN", avatarColor: "#6366f1" },
  { name: "JayDeculein", initials: "JD", avatarColor: "#1a1a2e" },
  { name: "Dude",        initials: "DU", avatarColor: "#818cf8" },
  { name: "Gen.Dave",    initials: "GD", avatarColor: "#f59e0b" },
  { name: "Ying",        initials: "YI", avatarColor: "#4f46e5" },
  { name: "gaymused",    initials: "GM", avatarColor: "#a5b4fc" },
]

function MemberCard({ member, index }: { member: (typeof MEMBERS)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="group h-full p-5 transition-all duration-200 hover:scale-[1.02]">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ring-2 ring-brand-indigo-3/30"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.initials}
          </span>
          <div>
            <div className="font-ui text-sm font-bold text-brand-navy">{member.name}</div>
            <div className="font-mono text-[10px] text-brand-indigo/60">GenLayer Builder</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export function ShowcaseSection() {
  return (
    <section id="community" className="relative overflow-hidden bg-brand-cream px-6 py-24">
      {/* Tile pattern background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
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

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MEMBERS.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
