"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"

type Props = {
  stats: {
    projectCount: number
    builderCount: number
    upvoteCount: number
  }
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2.5, ease: [0.16, 1, 0.3, 1] })
    }
  }, [isInView, value, count])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

const STATS = [
  {
    key: "projectCount" as const,
    label: "Projects Submitted",
    suffix: "+",
    color: "#00F0FF",
  },
  {
    key: "builderCount" as const,
    label: "Active Builders",
    suffix: "+",
    color: "#B026FF",
  },
  {
    key: "upvoteCount" as const,
    label: "Upvotes Cast",
    suffix: "+",
    color: "#00FF94",
  },
]

export function LiveStats({ stats }: Props) {
  return (
    <section className="bg-[#050505] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            Community Pulse
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Growing every day
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] px-8 py-10 text-center"
              style={{ borderColor: `${stat.color}18` }}
            >
              <div
                className="mb-2 text-5xl font-black tabular-nums md:text-6xl"
                style={{ color: stat.color }}
              >
                <Counter value={stats[stat.key]} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>

              {/* Bottom glow bar */}
              <div className="mx-auto mt-6 h-px w-16 rounded-full" style={{ background: stat.color, opacity: 0.4 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
