"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = {
  projectId:           string
  initialUpvoteCount:  number
  initialDownvoteCount: number
  initialUpvoted:      boolean
  initialDownvoted:    boolean
  currentUserId?:      string
}

export function UpvoteButton({
  projectId,
  initialUpvoteCount,
  initialDownvoteCount,
  initialUpvoted,
  initialDownvoted,
  currentUserId,
}: Props) {
  const router = useRouter()
  const [upvoteCount,   setUpvoteCount]   = useState(initialUpvoteCount)
  const [downvoteCount, setDownvoteCount] = useState(initialDownvoteCount)
  const [upvoted,       setUpvoted]       = useState(initialUpvoted)
  const [downvoted,     setDownvoted]     = useState(initialDownvoted)
  const [loading,       setLoading]       = useState(false)

  async function handleUpvote() {
    if (!currentUserId) { router.push("/login"); return }
    if (loading) return
    setLoading(true)

    const wasUpvoted = upvoted
    setUpvoted(!wasUpvoted)
    setUpvoteCount((c) => wasUpvoted ? c - 1 : c + 1)
    if (downvoted) { setDownvoted(false); setDownvoteCount((c) => c - 1) }

    const res = await fetch(`/api/projects/${projectId}/upvote`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setUpvoted(data.upvoted)
      setUpvoteCount(data.count)
      if (!wasUpvoted && downvoted) setDownvoted(false)
    } else {
      setUpvoted(wasUpvoted)
      setUpvoteCount((c) => wasUpvoted ? c + 1 : c - 1)
      if (downvoted) { setDownvoted(true); setDownvoteCount((c) => c + 1) }
    }
    setLoading(false)
    router.refresh()
  }

  async function handleDownvote() {
    if (!currentUserId) { router.push("/login"); return }
    if (loading) return
    setLoading(true)

    const wasDownvoted = downvoted
    setDownvoted(!wasDownvoted)
    setDownvoteCount((c) => wasDownvoted ? c - 1 : c + 1)
    if (upvoted) { setUpvoted(false); setUpvoteCount((c) => c - 1) }

    const res = await fetch(`/api/projects/${projectId}/downvote`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setDownvoted(data.downvoted)
      setDownvoteCount(data.count)
      if (!wasDownvoted && upvoted) setUpvoted(false)
    } else {
      setDownvoted(wasDownvoted)
      setDownvoteCount((c) => wasDownvoted ? c + 1 : c - 1)
      if (upvoted) { setUpvoted(true); setUpvoteCount((c) => c + 1) }
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Upvote */}
      <button
        onClick={handleUpvote}
        disabled={loading}
        aria-label={upvoted ? "Remove upvote" : "Upvote this project"}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-xl border px-4 py-2.5 transition-all disabled:opacity-60",
          upvoted
            ? "border-brand-indigo/40 bg-brand-indigo/10 text-brand-indigo"
            : "border-brand-indigo/15 bg-white text-brand-navy/50 hover:border-brand-indigo/30 hover:text-brand-indigo"
        )}
      >
        <span className="text-base leading-none">▲</span>
        <span className="font-display text-xl font-black leading-none">{upvoteCount}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide">upvotes</span>
      </button>

      {/* Downvote */}
      <button
        onClick={handleDownvote}
        disabled={loading}
        aria-label={downvoted ? "Remove downvote" : "Downvote this project"}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-xl border px-4 py-2.5 transition-all disabled:opacity-60",
          downvoted
            ? "border-red-400/40 bg-red-50 text-red-500"
            : "border-brand-indigo/15 bg-white text-brand-navy/50 hover:border-red-300 hover:text-red-400"
        )}
      >
        <span className="text-base leading-none">▼</span>
        <span className="font-display text-xl font-black leading-none">{downvoteCount}</span>
        <span className="font-mono text-[10px] uppercase tracking-wide">downvotes</span>
      </button>
    </div>
  )
}
