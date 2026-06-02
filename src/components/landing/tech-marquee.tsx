"use client"

import { useState } from "react"

const ITEMS = [
  { name: "Next.js",      hoverColor: "#ffffff" },
  { name: "TypeScript",   hoverColor: "#3178C6" },
  { name: "Prisma",       hoverColor: "#5a67d8" },
  { name: "PostgreSQL",   hoverColor: "#336791" },
  { name: "GenLayer",     hoverColor: "#00FF94" },
  { name: "Tailwind CSS", hoverColor: "#06B6D4" },
  { name: "Framer Motion",hoverColor: "#BB4B96" },
  { name: "NextAuth",     hoverColor: "#6366F1" },
  { name: "Zod",          hoverColor: "#3E67B1" },
  { name: "GSAP",         hoverColor: "#88CE02" },
]

function MarqueeItem({ name, hoverColor }: { name: string; hoverColor: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex flex-shrink-0 items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 cursor-default select-none"
      style={{
        borderColor: hovered ? `${hoverColor}40` : "rgba(0,0,0,0.1)",
        color: hovered ? hoverColor : "#6B7280",
        background: hovered ? `${hoverColor}0a` : "transparent",
        boxShadow: hovered ? `0 0 16px ${hoverColor}25` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="h-2 w-2 rounded-full transition-colors duration-300"
        style={{ background: hovered ? hoverColor : "#9CA3AF" }}
      />
      {name}
    </div>
  )
}

export function TechMarquee() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <section className="bg-gray-50 py-20">
      <div className="mb-10 text-center">
        <div className="text-sm font-medium uppercase tracking-widest text-gray-500">
          Powered by
        </div>
      </div>

      {/* Marquee with fade masks */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-gray-50 to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-gray-50 to-transparent" />

        <div className="animate-marquee flex gap-4 py-2" style={{ width: "max-content" }}>
          {doubled.map((item, i) => (
            <MarqueeItem key={i} name={item.name} hoverColor={item.hoverColor} />
          ))}
        </div>
      </div>
    </section>
  )
}
