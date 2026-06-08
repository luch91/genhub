"use client"

import { useEffect } from "react"

const INTERVAL_MS = 4 * 60 * 1000 // ping every 4 minutes

export function PresencePing() {
  useEffect(() => {
    const ping = () =>
      fetch("/api/user/ping", { method: "POST" }).catch(() => {})

    ping()
    const id = setInterval(ping, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return null
}
