import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "GenHub — A Home for GenLayer Builders"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const ROWS = [
  ["#fbbf24", "#fbbf24", "#fbbf24"],
  ["#fbbf24", "#1a1a2e", "#fbbf24"],
  ["#4f46e5", "#4f46e5", "#4f46e5"],
]

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5f0e8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Mosaic logo mark */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 48 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 8 }}>
              {row.map((c, ci) => (
                <div
                  key={ci}
                  style={{ width: 56, height: 56, backgroundColor: c, borderRadius: 6 }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#1a1a2e",
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          GenHub
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#1a1a2e",
            opacity: 0.45,
            marginTop: 20,
            letterSpacing: "-0.5px",
          }}
        >
          A Home for GenLayer Builders
        </div>
      </div>
    ),
    { ...size },
  )
}
