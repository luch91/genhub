"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UPDATE_TYPE_LABELS, UPDATE_TYPE_COLORS } from "@/lib/utils"

type UpdateType = "GENERAL" | "MILESTONE" | "BLOCKER" | "BREAKTHROUGH"

const TYPES: UpdateType[] = ["GENERAL", "MILESTONE", "BLOCKER", "BREAKTHROUGH"]

export function PostUpdateForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [type, setType] = useState<UpdateType>("GENERAL")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, type, content: content.trim() }),
      })

      if (!res.ok) {
        let msg = "Failed to post update"
        try { const j = await res.json(); msg = j.error ?? msg } catch { /* non-JSON */ }
        setError(msg)
        return
      }

      setContent("")
      setType("GENERAL")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">
        Post an update
      </p>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={
              type === t
                ? `badge ${UPDATE_TYPE_COLORS[t]}`
                : "badge border border-brand-indigo/15 bg-white text-brand-navy/50 hover:border-brand-indigo/30 hover:text-brand-navy transition-colors"
            }
          >
            {UPDATE_TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea"
        rows={3}
        minLength={10}
        maxLength={2000}
        placeholder="What's happening with the build?"
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-navy/35">{content.length}/2000</span>
        <button
          type="submit"
          disabled={loading || content.trim().length < 10}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Posting…" : "Post update"}
        </button>
      </div>
    </form>
  )
}
