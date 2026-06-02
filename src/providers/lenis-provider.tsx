"use client"

import { useEffect } from "react"

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run if not reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let lenis: import("lenis").default | null = null

    async function init() {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

      lenis.on("scroll", ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis!.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      lenis?.destroy()
    }
  }, [])

  return <>{children}</>
}
