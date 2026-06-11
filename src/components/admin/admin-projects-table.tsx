"use client"

import { useState } from "react"
import Link from "next/link"
import { formatRelativeDate } from "@/lib/utils"

type AdminProject = {
  id: string
  title: string
  slug: string
  featured: boolean
  createdAt: Date
  author: { name: string | null; username: string | null }
  _count: { upvotes: number }
}

export function AdminProjectsTable({ projects }: { projects: AdminProject[] }) {
  const [list,    setList]    = useState(projects)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleFeatured(projectId: string, current: boolean) {
    setLoading(projectId)
    const res = await fetch(`/api/admin/projects/${projectId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ featured: !current }),
    })
    if (res.ok) {
      setList((prev) => prev.map((p) => p.id === projectId ? { ...p, featured: !current } : p))
    }
    setLoading(null)
  }

  async function deleteProject(projectId: string) {
    if (!confirm("Delete this project permanently?")) return
    setLoading(`del-${projectId}`)
    const res = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" })
    if (res.ok) {
      setList((prev) => prev.filter((p) => p.id !== projectId))
    }
    setLoading(null)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-indigo/15 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-indigo/10 text-left text-xs font-mono uppercase tracking-wider text-brand-navy/40">
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Upvotes</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-indigo/8">
          {list.map((p) => (
            <tr key={p.id} className={p.featured ? "bg-brand-amber/5" : ""}>
              <td className="px-4 py-3">
                <Link
                  href={`/projects/${p.slug}`}
                  className="font-medium text-brand-navy hover:text-brand-indigo transition-colors"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-brand-navy/50">
                @{p.author.username ?? p.author.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-brand-navy/50">{formatRelativeDate(new Date(p.createdAt))}</td>
              <td className="px-4 py-3 text-brand-navy/70">{p._count.upvotes}</td>
              <td className="px-4 py-3">
                {p.featured ? (
                  <span className="rounded-full bg-brand-amber/15 px-2 py-0.5 text-[10px] font-mono text-brand-amber-dk">featured</span>
                ) : (
                  <span className="text-brand-navy/30 text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(p.id, p.featured)}
                    disabled={loading === p.id}
                    className="rounded-full bg-brand-indigo/8 px-3 py-1 text-xs font-semibold text-brand-indigo hover:bg-brand-indigo/15 transition-colors disabled:opacity-50"
                  >
                    {p.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    disabled={loading === `del-${p.id}`}
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
