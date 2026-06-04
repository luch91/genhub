"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ReplyWithAuthor = {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

type Props = {
  discussionId: string
  currentUserId?: string
  onReply?: (reply: ReplyWithAuthor) => void
}

export function ReplyForm({ discussionId, currentUserId, onReply }: Props) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError("")

    const res = await fetch(`/api/discussions/${discussionId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      setError("Failed to post reply.")
      setSubmitting(false)
      return
    }

    const reply = await res.json()
    setContent("")
    setSubmitting(false)
    onReply?.(reply)
    router.refresh()
  }

  if (!currentUserId) {
    return (
      <p className="text-sm text-brand-navy/45">
        <a href="/login" className="text-brand-indigo hover:text-brand-indigo/80 transition-colors">Sign in</a> to reply.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea flex-1"
        rows={3}
        placeholder="Write a reply..."
      />
      <div className="flex flex-col justify-end gap-1">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="btn-primary"
        >
          {submitting ? "..." : "Reply"}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </form>
  )
}
