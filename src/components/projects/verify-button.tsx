"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  projectId: string
}

export function VerifyButton({ projectId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleVerify() {
    setLoading(true)
    setError("")
    const res = await fetch(`/api/projects/${projectId}/verify`, { method: "POST" })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Verification failed")
      setLoading(false)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
      >
        {loading ? "Verifying…" : "Verify on-chain ✓"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
