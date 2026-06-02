import { cn } from "@/lib/utils"

export type TileColor = "amber" | "amber-lt" | "navy" | "indigo" | "indigo-4" | "indigo-3" | "lavender" | "mist"

const COLOR_MAP: Record<TileColor, string> = {
  amber:    "#fbbf24",
  "amber-lt": "#fde68a",
  navy:     "#1a1a2e",
  indigo:   "#4f46e5",
  "indigo-4": "#818cf8",
  "indigo-3": "#a5b4fc",
  lavender: "#a5b4fc",
  mist:     "#e0e7ff",
}

interface MosaicTileProps {
  color: TileColor
  size?: number
  opacity?: number
  animated?: boolean
  className?: string
}

export function MosaicTile({
  color,
  size = 20,
  opacity = 1,
  animated = false,
  className,
}: MosaicTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block rounded-tile", animated && "animate-tile-float", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: COLOR_MAP[color],
        opacity,
        flexShrink: 0,
      }}
    />
  )
}

export { COLOR_MAP }
