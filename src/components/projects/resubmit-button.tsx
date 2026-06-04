"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ResubmitButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleResubmit() {
    setLoading(true)
    const res = await fetch(`/api/projects/${projectId}/resubmit`, { method: "POST" })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleResubmit}
      disabled={loading}
      className="mt-3 rounded-pill bg-brand-indigo px-5 py-2 font-ui text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90 disabled:opacity-50"
    >
      {loading ? "Resubmitting…" : "Resubmit project"}
    </button>
  )
}
