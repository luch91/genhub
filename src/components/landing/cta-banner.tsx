"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { TileColor } from "@/components/brand/mosaic-tile"
import { COLOR_MAP } from "@/components/brand/mosaic-tile"

const PARTICLE_COLORS: TileColor[] = ["amber", "amber-lt", "indigo", "indigo-3", "lavender"]

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  size: 8 + (i % 4) * 4,
  x: `${5 + (i * 4.5) % 90}%`,
  y: `${10 + (i * 7) % 80}%`,
  delay: (i * 0.6) % 8,
  duration: 6 + (i % 6) * 1.5,
}))

export function CTABanner() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Aurora mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(-45deg, #f5f0e8, #ede9fe, #fef3c7, #f5f0e8)",
          backgroundSize: "400% 400%",
          animation: reduced ? "none" : "aurora-shift 10s ease infinite",
        }}
        aria-hidden="true"
      />

      {/* Amber glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-brand-amber/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-brand-indigo/10 blur-3xl" />
      </div>

      {/* Floating tile particles */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-tile opacity-30"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                backgroundColor: COLOR_MAP[p.color],
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-brand-amber/30 bg-brand-amber/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-amber" aria-hidden="true" />
            <span className="font-mono text-xs font-bold text-brand-amber/80">
              Open to all GenLayer builders
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-5xl font-black leading-tight tracking-tight text-brand-navy md:text-7xl">
            Ready to Build{" "}
            <span className="text-gradient-indigo">in Public?</span>
          </h2>

          {/* Sub */}
          <p className="mx-auto mt-6 max-w-xl font-body text-lg text-brand-navy/60">
            Join hundreds of GenLayer builders sharing work, getting feedback,
            and shaping the ecosystem.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-pill bg-brand-indigo px-10 py-4 font-ui text-base font-bold text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none"
              >
                Join the Community →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-pill border border-brand-indigo/20 bg-white/60 px-10 py-4 font-ui text-base font-semibold text-brand-indigo backdrop-blur-sm transition-all hover:border-brand-indigo/40 hover:bg-white/80"
              >
                Browse Projects
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
