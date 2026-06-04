"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBuilderSessionSchema, type CreateBuilderSessionInput } from "@/lib/validations"

type FieldErrors = Partial<Record<keyof CreateBuilderSessionInput | "root", string>>

export function ScheduleSessionForm() {
  const router = useRouter()
  const [errors, setErrors]         = useState<FieldErrors>({})
  const [loading, setLoading]       = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const form = e.currentTarget
    const data = {
      title:       (form.elements.namedItem("title")       as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value || undefined,
      youtubeUrl:  (form.elements.namedItem("youtubeUrl")  as HTMLInputElement).value || undefined,
      scheduledAt: (form.elements.namedItem("scheduledAt") as HTMLInputElement).value
        ? new Date((form.elements.namedItem("scheduledAt") as HTMLInputElement).value).toISOString()
        : undefined,
      isRecurring,
      recurrence:  isRecurring
        ? (form.elements.namedItem("recurrence") as HTMLInputElement).value || undefined
        : undefined,
      tags: [],
    }

    const result = createBuilderSessionSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
        fieldErrors[field as keyof CreateBuilderSessionInput] = (msgs as string[])[0]
      }
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    const res = await fetch("/api/sessions", {
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

    router.push("/sessions")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.root && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root}
        </div>
      )}

      <Field label="Session title" error={errors.title}>
        <input
          name="title"
          className="input"
          placeholder="e.g. Building an AI Oracle with GenLayer"
        />
      </Field>

      <Field
        label="Description"
        hint="What will you cover in this session?"
        error={errors.description}
      >
        <textarea
          name="description"
          className="textarea"
          rows={3}
          placeholder="A brief overview of what builders will learn..."
        />
      </Field>

      <Field
        label="YouTube URL"
        hint="Paste your YouTube stream or video link — it will embed automatically once live."
        error={errors.youtubeUrl}
      >
        <input
          name="youtubeUrl"
          className="input"
          placeholder="https://youtube.com/watch?v=..."
        />
      </Field>

      <Field
        label="Scheduled date & time"
        hint="Optional — leave blank if not yet confirmed."
        error={errors.scheduledAt}
      >
        <input
          name="scheduledAt"
          type="datetime-local"
          className="input"
        />
      </Field>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-4 w-4 rounded border-brand-indigo/30 text-brand-indigo focus:ring-brand-indigo/30"
          />
          <span className="label mb-0">This is a recurring session</span>
        </label>

        {isRecurring && (
          <Field
            label="Recurrence description"
            hint="e.g. Every Tuesday at 5pm UTC"
            error={errors.recurrence}
          >
            <input
              name="recurrence"
              className="input"
              placeholder="Bi-weekly Thursdays at 6pm UTC"
            />
          </Field>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Scheduling..." : "Schedule session"}
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
  label:     string
  hint?:     string
  error?:    string
  children:  React.ReactNode
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
