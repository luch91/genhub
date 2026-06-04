const TILE_COLORS = [
  "#fbbf24", "#fbbf24", "#fbbf24",
  "#fbbf24", "#1a1a2e", "#fbbf24",
  "#4f46e5", "#4f46e5", "#4f46e5",
]

const SIZE_MAP = {
  sm: { tile: 7,  gapPx: 2, radius: "2px" },
  md: { tile: 8,  gapPx: 2, radius: "2px" },
  lg: { tile: 14, gapPx: 4, radius: "3px" },
}

type LogoSize = keyof typeof SIZE_MAP

export function MosaicLogo({ size = "md" }: { size?: LogoSize }) {
  const { tile, gapPx, radius } = SIZE_MAP[size]
  return (
    <div
      className="grid grid-cols-3"
      style={{ gap: gapPx }}
      aria-hidden="true"
    >
      {TILE_COLORS.map((c, i) => (
        <span
          key={i}
          style={{ width: tile, height: tile, backgroundColor: c, borderRadius: radius, display: "block" }}
        />
      ))}
    </div>
  )
}
