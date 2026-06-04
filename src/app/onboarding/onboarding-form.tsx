"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function OnboardingForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push("/projects")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="space-y-1.5">
        <label className="label">Username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your-handle"
          minLength={3}
          maxLength={30}
          required
          autoFocus
        />
        <p className="text-xs text-brand-navy/40">
          Letters, numbers, hyphens, and underscores only.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="label">
          Bio <span className="text-brand-navy/40">(optional)</span>
        </label>
        <textarea
          className="textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="What are you building on GenLayer?"
          rows={2}
          maxLength={300}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Saving..." : "Complete profile"}
      </button>
    </form>
  )
}
