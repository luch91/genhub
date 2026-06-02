"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { COLOR_MAP, type TileColor } from "./mosaic-tile"
import { cn } from "@/lib/utils"

interface TileGridProps {
  pattern: (TileColor | null)[][]
  tileSize?: number
  gap?: number
  opacity?: number
  animateIn?: boolean
  className?: string
}

export function TileGrid({
  pattern,
  tileSize = 20,
  gap = 3,
  opacity = 1,
  animateIn = false,
  className,
}: TileGridProps) {
  const reduced = useReducedMotion()

  const rows = pattern.length
  const cols = pattern[0]?.length ?? 0

  // Bottom-up stagger order: last row first
  let staggerIdx = 0
  const delayMap: Record<string, number> = {}
  for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      if (pattern[row][col] !== null) {
        delayMap[`${row}-${col}`] = staggerIdx++ * 0.008
      }
    }
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
    gap: `${gap}px`,
    opacity,
  }

  return (
    <div aria-hidden="true" className={cn("inline-grid", className)} style={gridStyle}>
      {pattern.map((row, ri) =>
        row.map((color, ci) => {
          if (!color) {
            return (
              <span
                key={`${ri}-${ci}`}
                style={{ width: tileSize, height: tileSize, display: "inline-block" }}
              />
            )
          }

          const bg = COLOR_MAP[color]
          const delay = delayMap[`${ri}-${ci}`] ?? 0

          if (animateIn && !reduced) {
            return (
              <motion.span
                key={`${ri}-${ci}`}
                className="rounded-tile inline-block"
                style={{ width: tileSize, height: tileSize, backgroundColor: bg, flexShrink: 0 }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.3, ease: "easeOut" }}
              />
            )
          }

          return (
            <span
              key={`${ri}-${ci}`}
              className="rounded-tile inline-block"
              style={{ width: tileSize, height: tileSize, backgroundColor: bg, flexShrink: 0 }}
            />
          )
        })
      )}
    </div>
  )
}
