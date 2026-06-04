"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { projectSubmitSchema, type ProjectSubmitInput } from "@/lib/validations"
import { PREDEFINED_TAGS } from "@/lib/utils"

type FieldErrors = Partial<Record<keyof ProjectSubmitInput | "root", string>>

type DefaultValues = {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  genlayerAngle: string
  contractAddress: string | null
  repoUrl: string | null
  demoUrl: string | null
  coverImage: string | null
  tags: string[]
}

export function EditForm({ defaults }: { defaults: DefaultValues }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(defaults.coverImage)
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(defaults.tags)

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setCoverRemoved(false)
  }

  function removeCover() {
    setCoverFile(null)
    setCoverPreview(null)
    setCoverRemoved(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
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

    // Determine final coverImage value
    let coverImage: string | null | undefined = undefined // undefined = unchanged
    if (coverFile) {
      const fd = new FormData()
      fd.append("file", coverFile)
      const coverRes = await fetch("/api/projects/cover", { method: "POST", body: fd })
      if (!coverRes.ok) {
        const json = await coverRes.json()
        setErrors({ root: json.error ?? "Failed to upload cover image" })
        setLoading(false)
        return
      }
      const { url } = await coverRes.json()
      coverImage = url
    } else if (coverRemoved) {
      coverImage = null
    }

    const body: Record<string, unknown> = { ...result.data }
    if (coverImage !== undefined) body.coverImage = coverImage

    const res = await fetch(`/api/projects/${defaults.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const json = await res.json()
      setErrors({ root: json.error ?? "Something went wrong" })
      setLoading(false)
      return
    }

    const updated = await res.json()
    router.push(`/projects/${updated.slug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.root && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errors.root}
        </div>
      )}

      <Field label="Project title" error={errors.title}>
        <input name="title" className="input" defaultValue={defaults.title} />
      </Field>

      <Field label="Tagline" hint="One sentence — what does it do?" error={errors.tagline}>
        <input name="tagline" className="input" defaultValue={defaults.tagline} />
      </Field>

      <Field label="Description" hint="Markdown supported" error={errors.description}>
        <textarea name="description" className="textarea" rows={5} defaultValue={defaults.description} />
      </Field>

      <Field
        label="Why only GenLayer?"
        hint="What makes this project only possible on GenLayer?"
        error={errors.genlayerAngle}
      >
        <textarea name="genlayerAngle" className="textarea" rows={4} defaultValue={defaults.genlayerAngle} />
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
        <h3 className="mb-4 text-sm font-medium text-brand-navy/45">Optional</h3>
        <div className="space-y-4">
          {/* Cover image */}
          <div className="space-y-1.5">
            <label className="label">Cover image</label>
            <p className="text-xs text-brand-navy/40">Shown on your project page and in link previews. JPG, PNG, WebP or GIF · Max 5 MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-brand-indigo/20 bg-brand-indigo/3 transition-colors hover:border-brand-indigo/40"
              style={{ height: coverPreview ? "auto" : "120px" }}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full rounded-xl object-cover" />
              ) : (
                <span className="font-ui text-sm text-brand-navy/40 group-hover:text-brand-indigo transition-colors">
                  Click to upload cover image
                </span>
              )}
            </button>
            {coverPreview && (
              <button
                type="button"
                onClick={removeCover}
                className="text-xs text-brand-navy/40 hover:text-red-500 transition-colors"
              >
                Remove image
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          <Field label="Contract address" error={errors.contractAddress}>
            <input
              name="contractAddress"
              className="input font-mono"
              placeholder="0x..."
              defaultValue={defaults.contractAddress ?? ""}
            />
          </Field>
          <Field label="Repository URL" error={errors.repoUrl}>
            <input
              name="repoUrl"
              className="input"
              placeholder="https://github.com/..."
              defaultValue={defaults.repoUrl ?? ""}
            />
          </Field>
          <Field label="Demo URL" error={errors.demoUrl}>
            <input
              name="demoUrl"
              className="input"
              placeholder="https://..."
              defaultValue={defaults.demoUrl ?? ""}
            />
          </Field>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
          {loading ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-brand-indigo/15 px-5 py-2.5 font-ui text-sm font-medium text-brand-navy/55 hover:text-brand-navy transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  label, hint, error, children,
}: {
  label: string; hint?: string; error?: string; children: React.ReactNode
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
