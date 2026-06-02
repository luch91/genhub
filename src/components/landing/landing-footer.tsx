import Link from "next/link"

const NAV_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features",    href: "#features"    },
      { label: "How It Works",href: "#how-it-works" },
      { label: "Pricing",     href: "#pricing"     },
      { label: "Changelog",   href: "/changelog"   },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Submit a Project",  href: "/projects/submit" },
      { label: "Browse Projects",   href: "/projects"        },
      { label: "Builder Profiles",  href: "/builders"        },
      { label: "Upvote Board",      href: "/projects?sort=upvotes" },
    ],
  },
  {
    heading: "Ecosystem",
    links: [
      { label: "GenLayer Docs",  href: "https://docs.genlayer.com", external: true },
      { label: "Shipyard",       href: "https://shipyard.genlayer.com", external: true },
      { label: "GenScope",       href: "https://genscope.genlayer.com", external: true },
      { label: "Foundation",     href: "https://genlayer.com", external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms",          href: "/terms"   },
      { label: "Cookie Policy",  href: "/cookies" },
    ],
  },
]

const SOCIAL = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/genlayerlabs",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/genlayerlabs",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.gg/genlayer",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    label: "Farcaster",
    href: "https://warpcast.com/genlayer",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.24.24H5.76A5.76 5.76 0 000 6v12a5.76 5.76 0 005.76 5.76h12.48A5.76 5.76 0 0024 18V6A5.76 5.76 0 0018.24.24zm.816 17.166h-2.85v-5.57c0-1.35-.48-2.027-1.44-2.027-.96 0-1.74.817-1.74 2.028v5.57h-2.85V9.646H8.34V7.594h7.826l.224 1.099c.688-.796 1.737-1.296 2.952-1.296 2.112 0 3.714 1.618 3.714 4.614v5.395z" />
      </svg>
    ),
  },
]

export function LandingFooter() {
  return (
    <footer className="bg-brand-deep-navy" aria-label="Site footer">
      {/* Decorative tile strip */}
      <div className="flex h-1.5 w-full overflow-hidden" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="h-full flex-1"
            style={{
              backgroundColor:
                i % 5 === 0 ? "#fbbf24" :
                i % 5 === 1 ? "#4f46e5" :
                i % 5 === 2 ? "#6366f1" :
                i % 5 === 3 ? "#a5b4fc" :
                "#1a1a2e",
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Top: logo + tagline */}
        <div className="mb-12 flex flex-col items-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid grid-cols-3 gap-0.5" aria-hidden="true">
              {[
                "#fbbf24","#fbbf24","#fbbf24",
                "#fbbf24","#1a1a2e","#fbbf24",
                "#4f46e5","#4f46e5","#4f46e5",
              ].map((c, i) => (
                <span key={i} className="rounded-[2px]" style={{ width: 8, height: 8, backgroundColor: c }} />
              ))}
            </div>
            <span className="font-ui text-base font-bold text-white">GenHub</span>
          </div>
          <p className="font-body text-sm font-light text-brand-indigo-3">
            A home for GenLayer builders.
          </p>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white/30">
                {col.heading}
              </div>
              <ul className="space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="font-body text-sm text-white/50 transition-colors hover:text-white/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/8 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-white/25">
            © {new Date().getFullYear()} GenHub. Built for the GenLayer ecosystem.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-white/30 transition-colors hover:text-white/70"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
