"use client"

import { useState } from "react"
import Link from "next/link"
import { formatRelativeDate } from "@/lib/utils"

type AdminDiscussion = {
  id: string
  title: string
  category: string
  pinned: boolean
  createdAt: Date
  author: { name: string | null; username: string | null }
  _count: { replies: number }
}

export function AdminDiscussionsTable({ discussions }: { discussions: AdminDiscussion[] }) {
  const [list, setList]       = useState(discussions)
  const [loading, setLoading] = useState<string | null>(null)

  async function togglePin(id: string, current: boolean) {
    setLoading(id)
    const res = await fetch(`/api/admin/discussions/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ pinned: !current }),
    })
    if (res.ok) {
      setList((prev) => prev.map((d) => d.id === id ? { ...d, pinned: !current } : d))
    }
    setLoading(null)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-indigo/15 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-indigo/10 text-left text-xs font-mono uppercase tracking-wider text-brand-navy/40">
            <th className="px-4 py-3">Discussion</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Replies</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Pinned</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-indigo/8">
          {list.map((d) => (
            <tr key={d.id} className={d.pinned ? "bg-brand-amber/5" : ""}>
              <td className="px-4 py-3">
                <Link
                  href={`/discuss/${d.id}`}
                  className="font-medium text-brand-navy hover:text-brand-indigo transition-colors"
                >
                  {d.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-brand-navy/50">
                @{d.author.username ?? d.author.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-brand-navy/50 capitalize">
                {d.category.toLowerCase()}
              </td>
              <td className="px-4 py-3 text-brand-navy/70">{d._count.replies}</td>
              <td className="px-4 py-3 text-brand-navy/50">{formatRelativeDate(new Date(d.createdAt))}</td>
              <td className="px-4 py-3">
                {d.pinned ? (
                  <span className="rounded-full bg-brand-amber/15 px-2 py-0.5 text-[10px] font-mono text-brand-amber-dk">pinned</span>
                ) : (
                  <span className="text-brand-navy/30 text-xs">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => togglePin(d.id, d.pinned)}
                  disabled={loading === d.id}
                  className="rounded-full bg-brand-indigo/8 px-3 py-1 text-xs font-semibold text-brand-indigo hover:bg-brand-indigo/15 transition-colors disabled:opacity-50"
                >
                  {d.pinned ? "Unpin" : "Pin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
