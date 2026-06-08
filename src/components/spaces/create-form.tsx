"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSpaceSchema, type CreateSpaceInput } from "@/lib/validations"

type FieldErrors = Partial<Record<keyof CreateSpaceInput | "root", string>>

export function CreateSpaceForm() {
  const router = useRouter()
  const [errors,  setErrors]  = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const form = e.currentTarget
    const xSpaceRaw = (form.elements.namedItem("xSpaceUrl") as HTMLInputElement).value.trim()
    const data = {
      title:       (form.elements.namedItem("title")       as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value || undefined,
      scheduledAt: (form.elements.namedItem("scheduledAt") as HTMLInputElement).value
        ? new Date((form.elements.namedItem("scheduledAt") as HTMLInputElement).value).toISOString()
        : undefined,
      xSpaceUrl:   xSpaceRaw || undefined,
      tags:        [],
    }

    const result = createSpaceSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
        fieldErrors[field as keyof CreateSpaceInput] = (msgs as string[])[0]
      }
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    const res = await fetch("/api/spaces", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(result.data),
    })

    if (!res.ok) {
      const json = await res.json()
      setErrors({ root: json.error ?? "Something went wrong" })
      setLoading(false)
      return
    }

    const space = await res.json()
    // Redirect straight into the live room
    router.push(`/spaces/${space.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.root && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root}
        </div>
      )}

      <Field label="Space title" error={errors.title}>
        <input
          name="title"
          className="input"
          placeholder="e.g. GenLayer builders office hours"
        />
      </Field>

      <Field
        label="Description"
        hint="What will you talk about?"
        error={errors.description}
      >
        <textarea
          name="description"
          className="textarea"
          rows={3}
          placeholder="Open Q&A, project feedback, or just hanging out..."
        />
      </Field>

      <Field
        label="Scheduled date & time"
        hint="Optional — leave blank to start immediately."
        error={errors.scheduledAt}
      >
        <input
          name="scheduledAt"
          type="datetime-local"
          className="input"
        />
      </Field>

      <Field
        label="X Space URL"
        hint="Optional — paste your X Space link if you're also hosting there."
        error={errors.xSpaceUrl}
      >
        <input
          name="xSpaceUrl"
          type="url"
          className="input"
          placeholder="https://x.com/i/spaces/..."
        />
      </Field>

      <div className="rounded-xl border border-brand-indigo/10 bg-brand-indigo/3 px-4 py-3 text-sm text-brand-navy/55">
        You&apos;ll be the host. Listeners can raise their hand to speak and you can admit them.
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Starting..." : "Start GenHub Space"}
      </button>
    </form>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label:    string
  hint?:    string
  error?:   string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div>
        <label className="label">{label}</label>
        {hint && <p className="mt-0.5 text-xs text-brand-navy/40">{hint}</p>}
      </div>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
