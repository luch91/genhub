"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { TileGrid } from "@/components/brand/tile-grid"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { TileColor } from "@/components/brand/mosaic-tile"

// Mosaic portrait figure — amber head, navy face, indigo body (PRD §5.2)
const FIGURE: (TileColor | null)[][] = [
  [null, null, "amber",  "amber",  "amber",  null,  null],
  [null, "amber", "amber", "navy",  "amber", "amber", null],
  [null, "amber", "navy",  "navy",  "navy",  "amber", null],
  [null, null, "amber",  "navy",  "amber",  null,  null],
  ["indigo","indigo","indigo","indigo","indigo","indigo","indigo"],
  [null,"indigo","indigo","indigo","indigo","indigo", null],
  [null,"indigo","indigo","lavender","indigo","indigo", null],
  [null, null,"indigo","indigo","indigo",  null,  null],
  [null,"indigo",  null,  null,  null, "indigo", null],
  [null,"indigo",  null,  null,  null, "indigo", null],
]

function AuroraBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute h-[700px] w-[700px] rounded-full bg-brand-indigo/15 blur-[120px]"
        animate={{ x: ["-10%", "15%", "-10%"], y: ["0%", "25%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ left: "5%", top: "-10%" }}
      />
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-brand-amber/12 blur-[100px]"
        animate={{ x: ["0%", "-25%", "0%"], y: ["0%", "20%", "0%"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 3 }}
        style={{ right: "5%", top: "10%" }}
      />
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full bg-brand-indigo-3/20 blur-[80px]"
        animate={{ x: ["0%", "20%", "0%"], y: ["0%", "-20%", "0%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 5 }}
        style={{ left: "40%", bottom: "0%" }}
      />
    </div>
  )
}

export function HeroSection() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const stagger = {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    item: {
      hidden:  { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-brand-cream pt-28 pb-20"
    >
      <AuroraBg />

      {/* Tile texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(79,70,229,0.07) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
          {/* ── Text column ── */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            {/* Pre-label */}
            <motion.div variants={stagger.item}>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-amber">
                GenLayer Builders Hub
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={stagger.item}
              className="mt-4 font-display text-5xl font-black leading-[1.05] tracking-tight text-brand-navy md:text-6xl xl:text-[80px]"
            >
              A Home for{" "}
              <span className={reduced ? "text-gradient-indigo" : "aurora-text"}>
                GenLayer Builders
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={stagger.item}
              className="mt-6 max-w-xl font-body text-lg leading-relaxed text-brand-navy/60 md:text-xl lg:mx-0 mx-auto"
            >
              Meet the builders shaping the future of Intelligent Contracts.
              Share projects. Get upvoted. Build in public.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={stagger.item}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <Link
                href="/login"
                className="rounded-pill bg-brand-indigo px-8 py-3.5 font-ui text-base font-semibold text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none hover:-translate-y-0.5"
              >
                Join the Community
              </Link>
              <button
                onClick={() => {
                  document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="glass-card rounded-pill border border-brand-indigo/20 bg-white/60 px-8 py-3.5 font-ui text-base font-semibold text-brand-indigo transition-all hover:border-brand-indigo/40 hover:bg-white/80"
              >
                Explore Projects
              </button>
            </motion.div>

            {/* Trust signal */}
            <motion.p
              variants={stagger.item}
              className="mt-8 font-mono text-xs tracking-wide text-brand-navy/40"
            >
              Quality-Gated · Builder-Centric · On-Chain
            </motion.p>
          </motion.div>

          {/* ── Mosaic figure column ── */}
          <motion.div
            className="flex flex-shrink-0 items-center justify-center"
            initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
            animate={reduced ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* Ambient glow behind figure */}
              <div
                className="absolute inset-0 -z-10 scale-150 rounded-full bg-brand-indigo/10 blur-3xl"
                aria-hidden="true"
              />
              <TileGrid
                pattern={FIGURE}
                tileSize={36}
                gap={4}
                animateIn={!reduced}
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll chevron */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="font-mono text-[10px] tracking-widest text-brand-navy/30 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px bg-gradient-to-b from-brand-indigo/30 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
