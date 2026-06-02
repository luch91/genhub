"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/brand/glass-card"

const MEMBERS = [
  {
    name: "Alice Chen",
    initials: "AC",
    role: "Intelligent Contract Builder",
    project: "On-Chain Sentiment Oracle",
    upvotes: 48,
    date: "3 days ago",
    avatarColor: "#4f46e5",
  },
  {
    name: "Bob Nakamura",
    initials: "BN",
    role: "DeFi Protocol Developer",
    project: "AI-Gated DAO Voting",
    upvotes: 37,
    date: "5 days ago",
    avatarColor: "#fbbf24",
  },
  {
    name: "Carol Santos",
    initials: "CS",
    role: "GenLayer Researcher",
    project: "zkML Verifier Contract",
    upvotes: 62,
    date: "1 day ago",
    avatarColor: "#6366f1",
  },
  {
    name: "Dave Okafor",
    initials: "DO",
    role: "Ecosystem Contributor",
    project: "WebData Aggregator v2",
    upvotes: 29,
    date: "1 week ago",
    avatarColor: "#1a1a2e",
  },
  {
    name: "Eve Lindqvist",
    initials: "EL",
    role: "Smart Contract Engineer",
    project: "Prediction Market Engine",
    upvotes: 55,
    date: "2 days ago",
    avatarColor: "#818cf8",
  },
  {
    name: "Frank Muller",
    initials: "FM",
    role: "Protocol Researcher",
    project: "Cross-Chain Oracle Bridge",
    upvotes: 41,
    date: "4 days ago",
    avatarColor: "#f59e0b",
  },
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
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ring-2 ring-brand-indigo-3/30"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.initials}
          </span>
          <div>
            <div className="font-ui text-sm font-bold text-brand-navy">{member.name}</div>
            <div className="font-mono text-[10px] text-brand-indigo/60">{member.role}</div>
          </div>
        </div>

        {/* Project */}
        <div className="mt-4 rounded-lg border border-brand-indigo/10 bg-brand-indigo/4 px-3 py-2.5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-indigo/40">
            Latest Project
          </div>
          <div className="mt-0.5 font-ui text-sm font-semibold text-brand-navy">
            {member.project}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-pill bg-brand-indigo/8 px-3 py-1 font-mono text-xs font-bold text-brand-indigo">
            ▲ {member.upvotes}
          </span>
          <span className="font-mono text-[10px] text-brand-navy/30">{member.date}</span>
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
            Real projects. Real builders. All building in public.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {MEMBERS.map((m, i) => (
            <div key={m.name} className="mb-4 break-inside-avoid">
              <MemberCard member={m} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
