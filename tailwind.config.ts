import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette (PRD §2.2) ──
        brand: {
          amber:       "#fbbf24",
          "amber-lt":  "#fde68a",
          "amber-dk":  "#f59e0b",
          indigo:      "#4f46e5",
          "indigo-5":  "#6366f1",
          "indigo-4":  "#818cf8",
          "indigo-3":  "#a5b4fc",
          "indigo-1":  "#e0e7ff",
          navy:        "#1a1a2e",
          cream:       "#f5f0e8",
          "deep-navy": "#0d0d18",
        },

        // ── Legacy tokens (interior pages) ──
        background: "hsl(var(--background))",
        surface:    "hsl(var(--surface))",
        border:     "hsl(var(--border))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        interactive: {
          DEFAULT: "var(--interactive-primary)",
          hover:   "var(--interactive-primary-hover)",
          active:  "var(--interactive-primary-active)",
        },
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          danger:  "var(--status-danger)",
          info:    "var(--status-info)",
          neutral: "var(--status-neutral)",
        },
      },

      fontFamily: {
        // ── Brand fonts (landing page) ──
        display: ["var(--font-unbounded)", "sans-serif"],
        ui:      ["var(--font-syne)",       "sans-serif"],
        body:    ["var(--font-dm-sans)",    "sans-serif"],
        mono:    ["var(--font-space-mono)", "monospace"],
        // ── Legacy fonts (interior pages) ──
        sans:    ["var(--font-inter)",      "system-ui", "sans-serif"],
        code:    ["var(--font-jetbrains)",  "monospace"],
      },

      borderRadius: {
        tile: "4px",
        card: "16px",
        pill: "50px",
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
      },

      boxShadow: {
        sm:             "var(--shadow-sm)",
        md:             "var(--shadow-md)",
        lg:             "var(--shadow-lg)",
        xl:             "var(--shadow-xl)",
        "glow-primary": "var(--shadow-glow-primary)",
        "glow-success": "var(--shadow-glow-success)",
        "glow-amber":   "0 0 0 2px rgba(251,191,36,0.4)",
        "glow-indigo":  "0 0 0 2px rgba(79,70,229,0.4)",
        glass:          "0 4px 24px rgba(79,70,229,0.08), 0 1px 0 rgba(255,255,255,0.15) inset",
      },

      animation: {
        "aurora-text":     "aurora-shift 4s ease infinite",
        "chromatic-pulse": "chromatic-pulse 4s ease infinite",
        "tile-float":      "tile-float 6s ease-in-out infinite",
        "marquee":         "marquee-left 30s linear infinite",
        "badge-pulse":     "badge-pulse 2s ease-in-out infinite",
        "fade-in":         "fadeIn 0.2s ease-in-out",
        "slide-up":        "slideUp 0.3s ease-out",
      },

      keyframes: {
        "aurora-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        "chromatic-pulse": {
          "0%":   { boxShadow: "0 0 0 1px rgba(79,70,229,0.4)" },
          "33%":  { boxShadow: "0 0 0 2px rgba(251,191,36,0.4)" },
          "66%":  { boxShadow: "0 0 0 2px rgba(165,180,252,0.4)" },
          "100%": { boxShadow: "0 0 0 1px rgba(79,70,229,0.4)" },
        },
        "tile-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        "marquee-left": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "badge-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79,70,229,0.3)" },
          "50%":       { boxShadow: "0 0 0 4px rgba(79,70,229,0)" },
        },
        fadeIn:  { from: { opacity: "0" },              to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },

      maxWidth: {
        "page-sm": "672px",
        "page-md": "768px",
        "page-lg": "896px",
        "page-xl": "1152px",
      },
    },
  },
  plugins: [],
}

export default config
