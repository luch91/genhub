"use client"

import { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useSound } from "@/hooks/use-sound"

// ─── Shared: 3D tilt + cursor glow border ─────────────────────────────────────

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const { play } = useSound()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springRY = useSpring(rotateY, { stiffness: 150, damping: 20 })
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return
      const rect = ref.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      rotateX.set((y - 0.5) * -12)
      rotateY.set((x - 0.5) * 12)
      setMousePos({ x: x * 100, y: y * 100 })
    },
    [reduced, rotateX, rotateY]
  )

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    setMousePos({ x: 50, y: 50 })
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => play("hover")}
      style={{
        rotateX: reduced ? 0 : springRX,
        rotateY: reduced ? 0 : springRY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      {/* Cursor-following glow border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,240,255,0.08), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-px rounded-2xl"
        style={{
          background: `radial-gradient(180px circle at ${mousePos.x}% ${mousePos.y}%, rgba(176,38,255,0.12), transparent 50%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// ─── Card 1: Community Review Gate ────────────────────────────────────────────

function ReviewGateCard() {
  const [hovering, setHovering] = useState(false)

  return (
    <BentoCard className="col-span-2 min-h-[220px]">
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="flex h-full flex-col justify-between"
      >
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-widest text-[#00F0FF]">
            Community Review Gate
          </div>
          <h3 className="text-xl font-bold text-gray-900">3 Approvals to Ship</h3>
          <p className="mt-2 text-sm text-gray-500">
            Projects are community-reviewed before going live. No spam. High signal only.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {[
            { label: "alice.eth", delay: 0 },
            { label: "bob.eth", delay: 0.2 },
            { label: "carol.eth", delay: 0.4 },
          ].map(({ label, delay }, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-16 font-mono text-xs text-gray-500">{label}</span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full rounded-full bg-[#00FF94]"
                  initial={{ width: "0%" }}
                  animate={{ width: hovering ? "100%" : "0%" }}
                  transition={{ duration: 0.8, delay: hovering ? delay : 0, ease: "easeOut" }}
                />
              </div>
              <motion.span
                className="text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: hovering && i < 3 ? 1 : 0 }}
                transition={{ delay: hovering ? delay + 0.7 : 0 }}
              >
                ✅
              </motion.span>
            </div>
          ))}
          <div className="mt-3 text-xs text-[#00FF94]">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: hovering ? 1 : 0 }}
              transition={{ delay: 1.4 }}
            >
              🚀 Project published!
            </motion.span>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}

// ─── Card 2: Build-in-Public Terminal ─────────────────────────────────────────

const FEED_ITEMS = [
  { icon: "🚀", text: "alice.eth: submitted 'On-Chain Oracle v2'", color: "#00FF94" },
  { icon: "✅", text: "oracle-v2: reached 3 approvals — now live", color: "#00F0FF" },
  { icon: "💡", text: "bob.eth: Breakthrough on nondeterminism fix", color: "#B026FF" },
  { icon: "🎯", text: "carol.eth: Milestone — 40% accuracy boost", color: "#00FF94" },
  { icon: "🔴", text: "dave.eth: Blocker in float precision", color: "#ff4466" },
  { icon: "💬", text: "New comment on 'AI-Gated DAO Voting'", color: "#00F0FF" },
  { icon: "👤", text: "eve.eth followed alice.eth", color: "#B026FF" },
  { icon: "🚀", text: "frank.eth: submitted 'zkML Verifier'", color: "#00FF94" },
]

function TerminalCard() {
  const doubled = [...FEED_ITEMS, ...FEED_ITEMS]

  return (
    <BentoCard className="row-span-2 min-h-[320px]">
      <div className="flex h-full flex-col">
        <div className="mb-3 text-xs font-medium uppercase tracking-widest text-[#00FF94]">
          Build in Public
        </div>
        <h3 className="mb-4 text-xl font-bold text-gray-900">Live Feed</h3>

        {/* Terminal window */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="overflow-hidden" style={{ height: "160px" }}>
            <div className="animate-terminal-scroll">
              {doubled.map((item, i) => (
                <div key={i} className="mb-1.5 flex items-start gap-2">
                  <span className="flex-shrink-0 text-sm">{item.icon}</span>
                  <span
                    className="font-mono text-[11px] leading-relaxed"
                    style={{ color: item.color, opacity: 0.85 }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}

// ─── Card 3: Reputation & Credits ─────────────────────────────────────────────

function CreditsCard() {
  const [credits, setCredits] = useState(2)
  const [rep, setRep] = useState(0)

  return (
    <BentoCard>
      <div
        onMouseEnter={() => {
          setCredits((c) => Math.min(c + 1, 9))
          setRep((r) => r + 5)
        }}
        className="flex h-full flex-col"
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-widest text-[#B026FF]">
          Reputation & Credits
        </div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Earn While You Build</h3>

        <div className="flex items-center gap-6">
          {/* Coin */}
          <motion.div
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#B026FF] bg-[#B026FF]/10 text-2xl font-bold text-[#B026FF] glow-purple"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              key={credits}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {credits}
            </motion.span>
          </motion.div>

          <div className="space-y-1 text-sm">
            <div className="text-gray-600">
              Credits: <span className="font-semibold text-[#B026FF]">{credits}</span>
            </div>
            <div className="text-gray-600">
              Reputation:{" "}
              <motion.span
                key={rep}
                className="font-semibold text-[#00FF94]"
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {rep}
              </motion.span>
            </div>
            <div className="text-xs text-gray-400">Hover to earn →</div>
          </div>
        </div>
      </div>
    </BentoCard>
  )
}

// ─── Card 4: Builder Network Graph ────────────────────────────────────────────

const GRAPH_NODES = [
  { x: 60,  y: 50,  r: 6,  color: "#00F0FF" },
  { x: 180, y: 30,  r: 5,  color: "#B026FF" },
  { x: 300, y: 70,  r: 7,  color: "#00FF94" },
  { x: 120, y: 130, r: 4,  color: "#00F0FF" },
  { x: 250, y: 110, r: 5,  color: "#B026FF" },
  { x: 370, y: 40,  r: 4,  color: "#00FF94" },
  { x: 200, y: 170, r: 6,  color: "#00F0FF" },
]

const EDGES = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 6], [2, 4], [5, 6],
]

function NetworkCard() {
  return (
    <BentoCard className="col-span-2 min-h-[180px]">
      <div className="flex h-full flex-col">
        <div className="mb-2 text-xs font-medium uppercase tracking-widest text-[#00F0FF]">
          Builder Network
        </div>
        <h3 className="mb-3 text-xl font-bold text-gray-900">Connect. Collaborate. Build.</h3>

        <div className="flex-1">
          <svg width="100%" viewBox="0 0 430 200" className="overflow-visible">
            {/* Edges */}
            {EDGES.map(([a, b], i) => (
              <motion.path
                key={i}
                d={`M ${GRAPH_NODES[a].x} ${GRAPH_NODES[a].y} L ${GRAPH_NODES[b].x} ${GRAPH_NODES[b].y}`}
                stroke="#00F0FF"
                strokeWidth="1"
                fill="none"
                strokeOpacity={0}
                initial={{ pathLength: 0, strokeOpacity: 0 }}
                animate={{ pathLength: 1, strokeOpacity: 0.25 }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: "easeInOut" }}
              />
            ))}
            {/* Nodes */}
            {GRAPH_NODES.map((node, i) => (
              <motion.circle
                key={i}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ filter: `drop-shadow(0 0 ${node.r * 2}px ${node.color})` }}
              />
            ))}
          </svg>
        </div>
      </div>
    </BentoCard>
  )
}

// ─── Bento Grid ────────────────────────────────────────────────────────────────

export function BentoGrid() {
  return (
    <section className="bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 text-sm font-medium uppercase tracking-widest text-gray-500">
            Platform Features
          </div>
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Built for{" "}
            <span className="text-gradient-cyan">serious builders</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Row 1 */}
          <ReviewGateCard />
          <TerminalCard />

          {/* Row 2 */}
          <CreditsCard />

          {/* Row 3 full width */}
          <NetworkCard />
        </div>
      </div>
    </section>
  )
}
