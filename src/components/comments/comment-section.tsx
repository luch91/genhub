"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { formatRelativeDate } from "@/lib/utils"
import { ReportButton } from "@/components/ui/report-button"

type Comment = {
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
  projectId?: string
  updateId?: string
  initialComments: Comment[]
  currentUserId?: string
}

export function CommentSection({ projectId, updateId, initialComments, currentUserId }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent]   = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError("")
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, projectId, updateId }),
    })
    if (!res.ok) {
      setError("Failed to post comment. Are you signed in?")
      setSubmitting(false)
      return
    }
    const comment = await res.json()
    setComments((prev) => [...prev, comment])
    setContent("")
    setSubmitting(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" })
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <h3 className="section-heading">
        Comments{" "}
        {comments.length > 0 && (
          <span className="text-brand-navy/45">({comments.length})</span>
        )}
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.author.image ? (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name ?? ""}
                  width={28}
                  height={28}
                  className="mt-0.5 flex-shrink-0 rounded-full"
                />
              ) : (
                <div className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full bg-brand-indigo/15" />
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-brand-navy/80">
                    {comment.author.name ?? comment.author.username ?? "Builder"}
                  </span>
                  <span className="text-xs text-brand-navy/40">
                    {formatRelativeDate(new Date(comment.createdAt))}
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    <ReportButton
                      type="comment"
                      contentId={comment.id}
                      currentUserId={currentUserId}
                      authorId={comment.author.id}
                    />
                    {currentUserId === comment.author.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-brand-navy/30 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-brand-navy/60">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-brand-navy/40">No comments yet.</p>
      )}

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea flex-1"
            rows={2}
            placeholder="Write a comment..."
          />
          <button type="submit" disabled={submitting || !content.trim()} className="btn-primary self-end">
            {submitting ? "..." : "Post"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-brand-navy/45">
          <a href="/login" className="text-brand-indigo hover:text-brand-indigo/80 transition-colors">Sign in</a> to comment.
        </p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
