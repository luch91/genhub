"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useSound } from "@/hooks/use-sound"

export function FinalCTA() {
  const { play } = useSound()

  return (
    <section className="relative overflow-hidden py-36">
      {/* Gradient mesh background */}
      <div className="animate-mesh absolute inset-0" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-float rounded-full bg-[#B026FF]/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 animate-float rounded-full bg-[#00F0FF]/15 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-[#00FF94]/10 blur-2xl" />

      {/* Cyber grid overlay */}
      <div className="cyber-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FF94]/20 bg-[#00FF94]/5 px-4 py-1.5 text-sm text-[#00FF94]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF94]" />
            Open to all GenLayer builders
          </div>

          <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
            Ready to build{" "}
            <span className="text-gradient-cyan">high-signal</span>
            <br />
            Intelligent Contracts?
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
            Join the community. Submit your first project. Earn your place in the
            GenLayer ecosystem — one approval at a time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/projects/submit"
                onMouseEnter={() => play("hover")}
                onClick={() => play("click")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00FF94] px-8 py-4 text-base font-bold text-black transition-all hover:bg-[#00FF94]/90 glow-green"
              >
                Submit your project →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/discuss"
                onMouseEnter={() => play("hover")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                Join the discussion
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
