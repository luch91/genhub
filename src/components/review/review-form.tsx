"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  projectId: string
}

export function ReviewForm({ projectId }: Props) {
  const router = useRouter()
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!decision) return
    if (decision === "REJECTED" && !feedback.trim()) {
      setError("Please provide feedback explaining why you're rejecting this project.")
      return
    }

    setSubmitting(true)
    setError("")

    const res = await fetch(`/api/projects/${projectId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, feedback }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? "Something went wrong.")
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
    router.push("/review")
  }

  if (done) {
    return (
      <p className="text-sm text-emerald-400">
        Review submitted. Thank you for contributing to the community.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setDecision("APPROVED")}
          className={
            decision === "APPROVED"
              ? "flex-1 rounded-lg border border-emerald-500 bg-emerald-900/30 py-2.5 text-sm font-medium text-emerald-300"
              : "flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-sm font-medium text-slate-400 hover:border-emerald-700 hover:text-emerald-400"
          }
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => setDecision("REJECTED")}
          className={
            decision === "REJECTED"
              ? "flex-1 rounded-lg border border-red-500 bg-red-900/30 py-2.5 text-sm font-medium text-red-300"
              : "flex-1 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-sm font-medium text-slate-400 hover:border-red-700 hover:text-red-400"
          }
        >
          Reject
        </button>
      </div>

      {decision === "REJECTED" && (
        <div className="space-y-1.5">
          <label className="label">
            Feedback <span className="text-red-400">*</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="textarea"
            rows={4}
            placeholder="Explain what needs to improve for this project to be accepted..."
          />
        </div>
      )}

      {decision === "APPROVED" && (
        <div className="space-y-1.5">
          <label className="label">Feedback <span className="text-slate-600">(optional)</span></label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="textarea"
            rows={3}
            placeholder="Any encouraging words or suggestions for the builder..."
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {decision && (
        <button
          type="submit"
          disabled={submitting}
          className={
            decision === "APPROVED"
              ? "btn-primary w-full"
              : "w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          }
        >
          {submitting
            ? "Submitting..."
            : decision === "APPROVED"
            ? "Submit approval"
            : "Submit rejection"}
        </button>
      )}
    </form>
  )
}
