import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

const ROWS = [
  ["#fbbf24", "#fbbf24", "#fbbf24"],
  ["#fbbf24", "#1a1a2e", "#fbbf24"],
  ["#4f46e5", "#4f46e5", "#4f46e5"],
]

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 1 }}>
            {row.map((c, ci) => (
              <div
                key={ci}
                style={{ width: 10, height: 10, backgroundColor: c, borderRadius: 1 }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    { ...size },
  )
}
