"use client"

import { useRef, Fragment } from "react"
import { motion, useInView } from "framer-motion"
import { GlassCard } from "@/components/brand/glass-card"
import { TileGrid } from "@/components/brand/tile-grid"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { TileColor } from "@/components/brand/mosaic-tile"

const STEPS = [
  {
    number: "01",
    label:  "Join the Hub",
    title:  "Join the Hub",
    description:
      "Create your builder profile. Connect your wallet. Tell us what you're building.",
    nodeColors: [
      ["amber","amber-lt","amber"],
      ["amber-lt","amber","amber-lt"],
      ["amber","amber-lt","amber"],
    ] as (TileColor | null)[][],
    color: "#fbbf24",
  },
  {
    number: "02",
    label:  "Share Your Work",
    title:  "Share Your Work",
    description:
      "Submit a project, post an idea, or open a review request. The community is watching.",
    nodeColors: [
      ["indigo","indigo-3","indigo"],
      ["indigo-3","indigo","indigo-3"],
      ["indigo","indigo-3","indigo"],
    ] as (TileColor | null)[][],
    color: "#4f46e5",
  },
  {
    number: "03",
    label:  "Get Recognized",
    title:  "Get Recognized",
    description:
      "Community upvotes surface the best work. Top projects earn ecosystem visibility and foundation attention.",
    nodeColors: [
      ["amber","indigo","amber"],
      ["indigo","lavender","indigo"],
      ["amber","indigo","amber"],
    ] as (TileColor | null)[][],
    color: "#6366f1",
  },
]

function StepConnector({ animate }: { animate: boolean }) {
  return (
    <div className="hidden items-center justify-center md:flex" aria-hidden="true">
      <motion.div
        className="h-px w-12"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(79,70,229,0.35) 0px, rgba(79,70,229,0.35) 4px, transparent 4px, transparent 8px)",
          transformOrigin: "left center",
        }}
        initial={animate ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  )
}

export function HowItWorksSection() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-brand-cream px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
            The Loop
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            How GenHub Works
          </h2>
        </motion.div>

        {/* Steps — horizontal on md+, vertical stack on mobile */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {STEPS.map((step, i) => (
            <Fragment key={step.number}>
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: i * 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className="h-full p-6">
                  {/* Step node + badge */}
                  <div className="mb-4 flex items-center gap-3">
                    <TileGrid pattern={step.nodeColors} tileSize={16} gap={2} />
                    <span
                      className="rounded-pill px-2.5 py-0.5 font-mono text-xs font-bold"
                      style={{
                        background: `${step.color}18`,
                        color: step.color,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Big number */}
                  <div
                    className="mb-3 font-mono text-5xl font-black leading-none"
                    style={{ color: step.color, opacity: 0.15 }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  <h3 className="font-ui text-lg font-bold text-brand-navy">{step.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-brand-navy/55">
                    {step.description}
                  </p>
                </GlassCard>
              </motion.div>

              {i < STEPS.length - 1 && (
                <StepConnector animate={inView && !reduced} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
