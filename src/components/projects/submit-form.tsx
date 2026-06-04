"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { projectSubmitSchema, type ProjectSubmitInput } from "@/lib/validations"
import { PREDEFINED_TAGS } from "@/lib/utils"

type FieldErrors = Partial<Record<keyof ProjectSubmitInput | "root", string>>

export function SubmitForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      tagline: (form.elements.namedItem("tagline") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      genlayerAngle: (form.elements.namedItem("genlayerAngle") as HTMLTextAreaElement).value,
      contractAddress: (form.elements.namedItem("contractAddress") as HTMLInputElement).value,
      repoUrl: (form.elements.namedItem("repoUrl") as HTMLInputElement).value,
      demoUrl: (form.elements.namedItem("demoUrl") as HTMLInputElement).value,
      tags: selectedTags,
    }

    const result = projectSubmitSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
        fieldErrors[field as keyof ProjectSubmitInput] = (msgs as string[])[0]
      }
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    })

    if (!res.ok) {
      const json = await res.json()
      setErrors({ root: json.error ?? "Something went wrong" })
      setLoading(false)
      return
    }

    const project = await res.json()
    router.push(`/projects/${project.slug}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.root && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root}
        </div>
      )}

      <Field label="Project title" error={errors.title}>
        <input name="title" className="input" placeholder="My Intelligent Contract project" />
      </Field>

      <Field label="Tagline" hint="One sentence — what does it do?" error={errors.tagline}>
        <input name="tagline" className="input" placeholder="A decentralized X that uses AI to Y" />
      </Field>

      <Field label="Description" hint="Markdown supported" error={errors.description}>
        <textarea
          name="description"
          className="textarea"
          rows={5}
          placeholder="Describe your project in detail..."
        />
      </Field>

      <Field
        label="Why only GenLayer?"
        hint="What makes this project only possible on GenLayer — the AI + blockchain combination?"
        error={errors.genlayerAngle}
      >
        <textarea
          name="genlayerAngle"
          className="textarea"
          rows={4}
          placeholder="This project couldn't exist on any other platform because..."
        />
      </Field>

      <Field label="Tags" hint="Select 1–5" error={errors.tags as string}>
        <div className="flex flex-wrap gap-2 pt-1">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={
                selectedTags.includes(tag)
                  ? "badge bg-brand-indigo text-white"
                  : "badge border border-brand-indigo/15 bg-white text-brand-navy/55 hover:border-brand-indigo/30 hover:text-brand-navy transition-colors"
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </Field>

      <div className="border-t border-brand-indigo/10 pt-6">
        <h3 className="mb-4 text-sm font-medium text-brand-navy/45">Optional links</h3>
        <div className="space-y-4">
          <Field label="Contract address" error={errors.contractAddress}>
            <input
              name="contractAddress"
              className="input font-mono"
              placeholder="0x..."
            />
          </Field>
          <Field label="Repository URL" error={errors.repoUrl}>
            <input name="repoUrl" className="input" placeholder="https://github.com/..." />
          </Field>
          <Field label="Demo URL" error={errors.demoUrl}>
            <input name="demoUrl" className="input" placeholder="https://..." />
          </Field>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Submitting..." : "Submit project"}
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
  label: string
  hint?: string
  error?: string
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
