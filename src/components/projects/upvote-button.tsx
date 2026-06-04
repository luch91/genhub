"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  projectId: string
  initialCount: number
  initialUpvoted: boolean
  currentUserId?: string
}

export function UpvoteButton({ projectId, initialCount, initialUpvoted, currentUserId }: Props) {
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!currentUserId) {
      router.push("/login")
      return
    }
    if (loading) return
    setLoading(true)

    const wasUpvoted = upvoted
    setUpvoted(!wasUpvoted)
    setCount((prev) => wasUpvoted ? prev - 1 : prev + 1)

    const res = await fetch(`/api/projects/${projectId}/upvote`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setCount(data.count)
      setUpvoted(data.upvoted)
    } else {
      setUpvoted(wasUpvoted)
      setCount((prev) => wasUpvoted ? prev + 1 : prev - 1)
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={upvoted ? "Remove upvote" : "Upvote this project"}
      className={`flex flex-col items-center gap-1 rounded-xl border px-4 py-3 transition-all disabled:opacity-60 ${
        upvoted
          ? "border-brand-indigo/40 bg-brand-indigo/10 text-brand-indigo"
          : "border-brand-indigo/15 bg-white text-brand-navy/50 hover:border-brand-indigo/30 hover:text-brand-indigo"
      }`}
    >
      <span className="text-base leading-none">▲</span>
      <span className="font-display text-xl font-black leading-none">{count}</span>
      <span className="font-mono text-[10px] uppercase tracking-wide">upvotes</span>
    </button>
  )
}
