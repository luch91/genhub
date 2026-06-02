"use client"

import { useScroll, useTransform, motion } from "framer-motion"

const NODES = [
  { x: "8%",  y: "18%", size: 3,  color: "#00F0FF", opacity: 0.5 },
  { x: "22%", y: "65%", size: 5,  color: "#B026FF", opacity: 0.35 },
  { x: "40%", y: "30%", size: 2,  color: "#00FF94", opacity: 0.4 },
  { x: "55%", y: "75%", size: 4,  color: "#00F0FF", opacity: 0.3 },
  { x: "72%", y: "20%", size: 6,  color: "#B026FF", opacity: 0.25 },
  { x: "85%", y: "55%", size: 3,  color: "#00FF94", opacity: 0.45 },
  { x: "15%", y: "85%", size: 2,  color: "#00F0FF", opacity: 0.3 },
  { x: "65%", y: "90%", size: 4,  color: "#B026FF", opacity: 0.2 },
  { x: "90%", y: "80%", size: 3,  color: "#00FF94", opacity: 0.35 },
  { x: "48%", y: "50%", size: 2,  color: "#00F0FF", opacity: 0.2 },
]

const CODE_SNIPPETS = [
  "class SentimentOracle(IContract):",
  "  @ml.infer('gpt-4o')",
  "  def get_score() -> float:",
  "verify_consensus(validators)",
  "emit ProjectPublished(addr)",
  "approve_count >= 3",
]

export function ParallaxBackground() {
  const { scrollY } = useScroll()

  const y1 = useTransform(scrollY, [0, 800], [0, -120])
  const y2 = useTransform(scrollY, [0, 800], [0, -60])
  const y3 = useTransform(scrollY, [0, 800], [0, -200])
  const opacity = useTransform(scrollY, [0, 600], [1, 0])

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cyber grid */}
      <div className="cyber-grid absolute inset-0" />

      {/* Large glow orbs */}
      <motion.div
        style={{ y: y3 }}
        className="absolute -left-32 top-1/4 h-96 w-96 animate-float rounded-full bg-[#B026FF]/8 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-16 top-1/3 h-80 w-80 animate-float rounded-full bg-[#00F0FF]/6 blur-3xl"
        // slight offset on the float
        data-delay="2s"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-1/4 left-1/3 h-64 w-64 animate-float rounded-full bg-[#00FF94]/5 blur-3xl"
      />

      {/* Geometric nodes */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {NODES.map((node, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: node.x,
              top: node.y,
              width: node.size * 2,
              height: node.size * 2,
              backgroundColor: node.color,
              opacity: node.opacity,
              boxShadow: `0 0 ${node.size * 4}px ${node.color}`,
            }}
          />
        ))}
      </motion.div>

      {/* Floating code snippets */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {CODE_SNIPPETS.map((line, i) => (
          <div
            key={i}
            className="absolute font-mono text-[11px] select-none"
            style={{
              left: `${10 + (i * 14) % 75}%`,
              top: `${15 + (i * 17) % 70}%`,
              color: i % 2 === 0 ? "rgba(0,240,255,0.12)" : "rgba(0,255,148,0.1)",
              transform: `rotate(${(i % 3) - 1}deg)`,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
      </motion.div>

      {/* Radial fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
    </motion.div>
  )
}
