"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const STEPS = [
  {
    number: "01",
    label: "Submit",
    title: "Submit your project",
    description:
      "Spend one submission credit to submit your Intelligent Contract project. Include your contract address, repo, and explain why it's only possible on GenLayer.",
    color: "#00F0FF",
    icon: "📤",
  },
  {
    number: "02",
    label: "Pending Review",
    title: "Community evaluates",
    description:
      "Builders who have shipped their own projects review yours. They can approve or reject with feedback. Your project page shows live approval progress.",
    color: "#B026FF",
    icon: "👀",
  },
  {
    number: "03",
    label: "3 Approvals",
    title: "Quality gate passed",
    description:
      "Three approvals from the community publish your project automatically. You earn +10 reputation. Rejection feedback tells you exactly what to improve.",
    color: "#00FF94",
    icon: "✅",
  },
  {
    number: "04",
    label: "Live on GenHub",
    title: "Your project is live",
    description:
      "Now visible in the gallery. Builders discover it, upvote it, follow you. Hit 5 upvotes and you earn your submission credit back.",
    color: "#00F0FF",
    icon: "🚀",
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return

    let ctx: import("gsap").Context | null = null

    async function init() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const track = trackRef.current
        const container = containerRef.current
        if (!track || !container) return

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 96),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth + 96}`,
            invalidateOnRefresh: true,
          },
        })
      })
    }

    init()

    return () => {
      ctx?.revert()
    }
  }, [reduced])

  return (
    <section className="bg-[#050505]" ref={containerRef}>
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex-shrink-0"
        >
          <div className="text-sm font-medium uppercase tracking-widest text-slate-500">
            How it works
          </div>
          <h2 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            From idea to{" "}
            <span className="text-gradient-green">published</span>
          </h2>
        </motion.div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className={`flex gap-6 ${reduced ? "flex-col md:flex-row md:flex-wrap" : ""}`}
          style={{ width: reduced ? "100%" : `${STEPS.length * 440}px` }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative flex-shrink-0 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-8"
              style={{
                width: reduced ? "100%" : "400px",
                borderColor: `${step.color}18`,
              }}
            >
              {/* Step number */}
              <div
                className="mb-6 font-mono text-6xl font-black leading-none"
                style={{ color: step.color, opacity: 0.15 }}
              >
                {step.number}
              </div>

              {/* Icon + label */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-medium"
                  style={{
                    background: `${step.color}15`,
                    color: step.color,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  {step.label}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>

              {/* Connector arrow (not on last) */}
              {!reduced && i < STEPS.length - 1 && (
                <div
                  className="absolute -right-5 top-1/2 -translate-y-1/2 text-slate-700"
                  style={{ zIndex: 10 }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Scroll hint — hidden on reduced */}
        {!reduced && (
          <p className="mt-8 flex-shrink-0 text-xs text-slate-700">
            Scroll to explore →
          </p>
        )}
      </div>
    </section>
  )
}
