"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type DefaultValues = {
  username: string | null
  bio: string | null
  twitterHandle: string | null
  githubHandle: string | null
  website: string | null
  walletAddress: string | null
}

type Props = { defaultValues: DefaultValues }

export function ProfileForm({ defaultValues }: Props) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const body = {
      username:     (form.elements.namedItem("username")     as HTMLInputElement).value.trim(),
      bio:          (form.elements.namedItem("bio")          as HTMLTextAreaElement).value.trim() || null,
      twitterHandle:(form.elements.namedItem("twitterHandle")as HTMLInputElement).value.trim() || null,
      githubHandle: (form.elements.namedItem("githubHandle") as HTMLInputElement).value.trim() || null,
      website:      (form.elements.namedItem("website")      as HTMLInputElement).value.trim() || null,
      walletAddress:(form.elements.namedItem("walletAddress")as HTMLInputElement).value.trim() || null,
    }

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(typeof json.error === "string" ? json.error : "Please check the form and try again.")
      setLoading(false)
      return
    }

    router.push(`/builders/${json.username}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Field label="Username">
        <input
          name="username"
          className="input font-mono"
          defaultValue={defaultValues.username ?? ""}
          minLength={3}
          maxLength={30}
          required
        />
        <p className="text-xs text-brand-navy/40">Letters, numbers, hyphens, and underscores only.</p>
      </Field>

      <Field label="Bio">
        <textarea
          name="bio"
          className="textarea"
          defaultValue={defaultValues.bio ?? ""}
          rows={3}
          maxLength={300}
          placeholder="What are you building on GenLayer?"
        />
      </Field>

      <div className="border-t border-brand-indigo/10 pt-5">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">
          Social links
        </p>
        <div className="space-y-4">
          <Field label="X / Twitter handle">
            <input
              name="twitterHandle"
              className="input"
              defaultValue={defaultValues.twitterHandle ?? ""}
              placeholder="yourhandle"
              maxLength={50}
            />
          </Field>
          <Field label="GitHub handle">
            <input
              name="githubHandle"
              className="input"
              defaultValue={defaultValues.githubHandle ?? ""}
              placeholder="yourhandle"
              maxLength={50}
            />
          </Field>
          <Field label="Website">
            <input
              name="website"
              className="input"
              defaultValue={defaultValues.website ?? ""}
              placeholder="https://yoursite.com"
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-brand-indigo/10 pt-5">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">Web3</p>
        <Field label="Wallet address">
          <input
            name="walletAddress"
            className="input font-mono"
            defaultValue={defaultValues.walletAddress ?? ""}
            placeholder="0x..."
            maxLength={42}
          />
          <p className="text-xs text-brand-navy/40">Must be a valid Ethereum address (0x…).</p>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-brand-indigo/10 pt-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-brand-navy/45 hover:text-brand-navy transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
