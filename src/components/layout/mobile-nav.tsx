"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/builders", label: "Builders" },
  { href: "/feed",     label: "Feed" },
  { href: "/discuss",  label: "Discuss" },
  { href: "/spaces",   label: "GenHub Space" },
]

export function MobileNav({ eligible, isAdmin }: { eligible: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-navy/60 hover:bg-brand-indigo/8 hover:text-brand-navy transition-colors md:hidden"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1.5 1.5L14.5 14.5M14.5 1.5L1.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 4H15M1 8H15M1 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Invisible backdrop — closes menu on outside click */}
          <div
            className="fixed inset-0 top-14 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown panel */}
          <div className="absolute left-0 right-0 top-full z-50 border-b border-brand-indigo/10 bg-brand-cream shadow-md md:hidden">
            <nav className="mx-auto max-w-6xl divide-y divide-brand-indigo/8 px-6">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-3 text-sm font-medium text-brand-navy/70 hover:text-brand-navy transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {eligible && (
                <Link
                  href="/review"
                  className="block py-3 text-sm font-medium text-brand-amber-dk hover:text-brand-amber-dk/80 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Review
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block py-3 text-sm font-medium text-brand-indigo hover:text-brand-indigo/80 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  )
}
