"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Features",     href: "#features"    },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Community",    href: "#community"   },
  { label: "Pricing",      href: "#pricing"     },
]

type NavUser = { name?: string | null; image?: string | null; email?: string | null } | null

export function LandingNavbar({ user }: { user?: NavUser }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <motion.header
      className="fixed top-0 z-50 w-full"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={cn(
          "mx-4 mt-4 rounded-pill border transition-all duration-300",
          scrolled
            ? "border-white/20 bg-[#f5f0e8]/90 shadow-lg backdrop-blur-md"
            : "border-white/10 bg-[#f5f0e8]/40 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid grid-cols-3 gap-0.5" aria-hidden="true">
              {[
                "#fbbf24","#fbbf24","#fbbf24",
                "#fbbf24","#1a1a2e","#fbbf24",
                "#4f46e5","#4f46e5","#4f46e5",
              ].map((c, i) => (
                <span
                  key={i}
                  className="rounded-[2px]"
                  style={{ width: 8, height: 8, backgroundColor: c }}
                />
              ))}
            </div>
            <span className="font-ui text-base font-bold text-brand-navy">GenHub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-pill px-4 py-1.5 font-ui text-sm font-medium text-brand-navy/70 transition-colors hover:bg-brand-indigo/8 hover:text-brand-indigo"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/projects"
                  className="hidden text-sm font-ui font-medium text-brand-navy/60 hover:text-brand-navy transition-colors md:flex items-center gap-2"
                >
                  {user.image ? (
                    <Image src={user.image} alt={user.name ?? ""} width={24} height={24} className="rounded-full" />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-brand-indigo/20 inline-block" />
                  )}
                  <span>{user.name ?? "Account"}</span>
                </Link>
                <Link
                  href="/projects"
                  className="rounded-pill bg-brand-indigo px-5 py-2 font-ui text-sm font-medium text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none"
                >
                  Go to App
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-ui font-medium text-brand-navy/60 hover:text-brand-navy transition-colors md:block"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="rounded-pill bg-brand-indigo px-5 py-2 font-ui text-sm font-medium text-white shadow-glow-indigo transition-all hover:bg-brand-indigo/90 hover:shadow-none"
                >
                  Join the Community
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className="flex flex-col gap-1.5 p-1 md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className={cn("h-0.5 w-5 bg-brand-navy transition-all", menuOpen && "translate-y-2 rotate-45")} />
              <span className={cn("h-0.5 w-5 bg-brand-navy transition-all", menuOpen && "opacity-0")} />
              <span className={cn("h-0.5 w-5 bg-brand-navy transition-all", menuOpen && "-translate-y-2 -rotate-45")} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="rounded-lg px-3 py-2 text-left font-ui text-sm font-medium text-brand-navy/70 hover:bg-brand-indigo/8 hover:text-brand-indigo"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-2 border-t border-white/10 pt-2">
                {user ? (
                  <Link
                    href="/projects"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 font-ui text-sm font-semibold text-brand-indigo"
                  >
                    Go to App
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 font-ui text-sm font-medium text-brand-navy/70"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="mt-1 block rounded-lg bg-brand-indigo px-3 py-2 text-center font-ui text-sm font-medium text-white"
                    >
                      Join the Community
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  )
}
