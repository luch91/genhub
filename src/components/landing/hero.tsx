"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { ParallaxBackground } from "./parallax-background"
import { useSound } from "@/hooks/use-sound"

const HEADLINE = "The Quality-Gated Home for GenLayer Builders"

const charVariants = {
  hidden: { opacity: 0, y: "110%" },
  visible: (i: number) => ({
    opacity: 1,
    y: "0%",
    transition: { duration: 0.5, delay: i * 0.025, ease: [0.22, 1, 0.36, 1] },
  }),
}

type Ripple = { id: number; x: number; y: number }

export function Hero() {
  const { play } = useSound()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 200, damping: 20 })
  const springY = useSpring(my, { stiffness: 200, damping: 20 })
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleMagnetMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.35)
      my.set((e.clientY - (rect.top + rect.height / 2)) * 0.35)
    },
    [mx, my]
  )

  const handleMagnetLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      play("click")
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const id = Date.now()
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 900)
    },
    [play]
  )

  let charIndex = 0

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "#050505" }}
    >
      <ParallaxBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Pill tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/5 px-4 py-1.5 text-sm text-[#00F0FF]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00F0FF]" />
          Quality-Gated · Builder-Centric · On-Chain
        </motion.div>

        {/* Headline — character-by-character stagger */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          {HEADLINE.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.22em] inline-block overflow-hidden">
              {word.split("").map((char) => {
                const i = charIndex++
                return (
                  <motion.span
                    key={`${wi}-${i}`}
                    className="inline-block"
                    custom={i}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      color:
                        wi >= 5
                          ? undefined
                          : undefined,
                    }}
                  >
                    {char}
                  </motion.span>
                )
              })}
            </span>
          ))}
          {/* "GenLayer Builders" gets the gradient */}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl"
        >
          Submit Intelligent Contracts. Build in public.
          <br className="hidden md:block" />
          Get community-reviewed. Three approvals to go live.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Magnetic primary CTA */}
          <div onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}>
            <motion.button
              ref={buttonRef}
              style={{ x: springX, y: springY }}
              onClick={handleClick}
              onMouseEnter={() => play("hover")}
              className="relative overflow-hidden rounded-xl bg-[#B026FF] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#B026FF]/90 glow-purple"
            >
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  className="pointer-events-none absolute rounded-full bg-white/25"
                  style={{ left: r.x, top: r.y, x: "-50%", y: "-50%" }}
                  initial={{ width: 0, height: 0, opacity: 1 }}
                  animate={{ width: 260, height: 260, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
              Start Building →
            </motion.button>
          </div>

          {/* Ghost CTA */}
          <Link
            href="/projects"
            className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            onMouseEnter={() => play("hover")}
          >
            Explore Projects
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-700">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-slate-600 to-transparent"
        />
      </motion.div>
    </section>
  )
}
