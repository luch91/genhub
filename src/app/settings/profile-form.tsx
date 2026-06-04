"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

type DefaultValues = {
  name: string | null
  image: string | null
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Capture form ref before any awaits — synthetic event is nullified after async gaps
    const form = e.currentTarget

    if (avatarFile) {
      const fd = new FormData()
      fd.append("file", avatarFile)
      const avatarRes = await fetch("/api/user/avatar", { method: "POST", body: fd })
      if (!avatarRes.ok) {
        const json = await avatarRes.json()
        setError(json.error ?? "Failed to upload photo")
        setLoading(false)
        return
      }
    }

    const body = {
      name:          (form.elements.namedItem("name")          as HTMLInputElement).value.trim(),
      username:      (form.elements.namedItem("username")      as HTMLInputElement).value.trim(),
      bio:           (form.elements.namedItem("bio")           as HTMLTextAreaElement).value.trim(),
      twitterHandle: (form.elements.namedItem("twitterHandle") as HTMLInputElement).value.trim(),
      githubHandle:  (form.elements.namedItem("githubHandle")  as HTMLInputElement).value.trim(),
      website:       (form.elements.namedItem("website")       as HTMLInputElement).value.trim(),
      walletAddress: (form.elements.namedItem("walletAddress") as HTMLInputElement).value.trim(),
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

    router.refresh()
    router.push(`/builders/${json.username}`)
  }

  const avatarSrc = previewUrl ?? defaultValues.image

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-indigo"
          aria-label="Change profile photo"
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-brand-indigo/15" />
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-brand-navy/50 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="font-ui text-xs font-semibold text-white">Edit</span>
          </div>
        </button>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-medium text-brand-indigo transition-colors hover:text-brand-indigo/80"
          >
            Change photo
          </button>
          <p className="mt-0.5 text-xs text-brand-navy/40">JPG, PNG, WebP or GIF · Max 2 MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Field label="Display name">
        <input
          name="name"
          className="input"
          defaultValue={defaultValues.name ?? ""}
          maxLength={100}
          placeholder="Your name"
        />
      </Field>

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
          className="text-sm text-brand-navy/45 transition-colors hover:text-brand-navy"
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
