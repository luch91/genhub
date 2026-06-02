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
        /* ── Legacy Tailwind tokens ── */
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        /* ── Design system tokens ── */
        "bg-base":     "var(--bg-base)",
        "bg-surface":  "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-inset":    "var(--bg-inset)",

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

        /* ── Landing neon palette ── */
        neon: {
          cyan:   "#00F0FF",
          purple: "#B026FF",
          green:  "#00FF94",
        },
        space: "#050505",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },

      boxShadow: {
        sm:           "var(--shadow-sm)",
        md:           "var(--shadow-md)",
        lg:           "var(--shadow-lg)",
        xl:           "var(--shadow-xl)",
        "glow-primary": "var(--shadow-glow-primary)",
        "glow-success": "var(--shadow-glow-success)",
        "glow-warning": "var(--shadow-glow-warning)",
        "glow-danger":  "var(--shadow-glow-danger)",
      },

      transitionDuration: {
        fast:  "var(--duration-fast)",
        base:  "var(--duration-base)",
        slow:  "var(--duration-slow)",
      },

      transitionTimingFunction: {
        DEFAULT: "var(--ease-default)",
        out:     "var(--ease-out)",
        spring:  "var(--ease-spring)",
      },

      animation: {
        "fade-in":   "fadeIn 0.2s ease-in-out",
        "slide-up":  "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
        "toast-enter": "toast-enter 300ms cubic-bezier(0, 0, 0.2, 1) forwards",
        "dropdown-enter": "dropdown-enter 200ms cubic-bezier(0, 0, 0.2, 1) forwards",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      backgroundImage: {
        "radial-cyan":   "radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)",
        "radial-purple": "radial-gradient(circle, rgba(176,38,255,0.15) 0%, transparent 70%)",
        "radial-green":  "radial-gradient(circle, rgba(0,255,148,0.15) 0%, transparent 70%)",
      },

      maxWidth: {
        "page-sm":  "672px",   /* feed, submit form, notifications */
        "page-md":  "768px",   /* discussion threads */
        "page-lg":  "896px",   /* project detail, builder profile */
        "page-xl":  "1152px",  /* gallery, max content width */
      },
    },
  },
  plugins: [],
}

export default config
