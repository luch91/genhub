"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { discussionSchema, type DiscussionInput } from "@/lib/validations"

type FieldErrors = Partial<Record<keyof DiscussionInput | "root", string>>

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "HELP", label: "Help" },
  { value: "IDEAS", label: "Ideas" },
  { value: "SHOWCASE", label: "Showcase" },
] as const

export function NewDiscussionForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<"GENERAL" | "HELP" | "IDEAS" | "SHOWCASE">("GENERAL")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
      category,
    }

    const result = discussionSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const [field, msgs] of Object.entries(result.error.flatten().fieldErrors)) {
        fieldErrors[field as keyof DiscussionInput] = (msgs as string[])[0]
      }
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    const res = await fetch("/api/discussions", {
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

    const discussion = await res.json()
    router.push(`/discuss/${discussion.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.root && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {errors.root}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="label">Category</label>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={
                category === c.value
                  ? "badge bg-violet-600 text-white"
                  : "badge border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label">Title</label>
        <input name="title" className="input" placeholder="What's on your mind?" />
        {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="label">Content</label>
        <textarea
          name="content"
          className="textarea"
          rows={6}
          placeholder="Share more context..."
        />
        {errors.content && <p className="text-xs text-red-400">{errors.content}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
        {loading ? "Posting..." : "Post discussion"}
      </button>
    </form>
  )
}
