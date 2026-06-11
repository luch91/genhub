"use client"

import { useState } from "react"

type Props = {
  type: "comment" | "discussion" | "update" | "reply"
  contentId: string
  currentUserId?: string
  authorId?: string
}

export function ReportButton({ type, contentId, currentUserId, authorId }: Props) {
  const [open, setOpen]       = useState(false)
  const [reason, setReason]   = useState("")
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)

  if (!currentUserId || currentUserId === authorId) return null
  if (done) return <span className="text-xs text-brand-navy/30">Reported</span>

  async function submit() {
    setLoading(true)
    const res = await fetch("/api/reports", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ type, contentId, reason: reason.trim() || undefined }),
    })
    setLoading(false)
    if (res.ok || res.status === 409) {
      setDone(true)
      setOpen(false)
    }
  }

  if (open) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="rounded border border-brand-indigo/15 px-2 py-0.5 text-xs text-brand-navy/70 outline-none focus:border-brand-indigo/30 w-32"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        <button
          onClick={submit}
          disabled={loading}
          className="text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Report"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-brand-navy/30 hover:text-brand-navy/50 transition-colors"
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="text-xs text-brand-navy/25 hover:text-red-400 transition-colors"
      title="Report this content"
    >
      Report
    </button>
  )
}
