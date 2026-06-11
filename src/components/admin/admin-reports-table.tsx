"use client"

import { useState } from "react"
import { formatRelativeDate } from "@/lib/utils"

type AdminReport = {
  id: string
  type: string
  contentId: string
  reason: string | null
  resolved: boolean
  createdAt: Date
  reporter: { name: string | null; username: string | null }
}

export function AdminReportsTable({ reports }: { reports: AdminReport[] }) {
  const [list, setList]       = useState(reports)
  const [loading, setLoading] = useState<string | null>(null)

  async function resolve(id: string) {
    setLoading(id)
    const res = await fetch(`/api/admin/reports/${id}`, { method: "PATCH" })
    if (res.ok) {
      setList((prev) => prev.filter((r) => r.id !== id))
    }
    setLoading(null)
  }

  if (list.length === 0) {
    return (
      <p className="rounded-xl border border-brand-indigo/15 bg-white px-6 py-8 text-sm text-brand-navy/40 text-center">
        No unresolved reports.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-indigo/15 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-indigo/10 text-left text-xs font-mono uppercase tracking-wider text-brand-navy/40">
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Content ID</th>
            <th className="px-4 py-3">Reported by</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-indigo/8">
          {list.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3">
                <span className="rounded-full bg-brand-indigo/8 px-2 py-0.5 text-[11px] font-mono text-brand-indigo">
                  {r.type}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-brand-navy/40">{r.contentId.slice(0, 12)}…</td>
              <td className="px-4 py-3 text-brand-navy/50">
                @{r.reporter.username ?? r.reporter.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-brand-navy/60 max-w-xs">
                {r.reason ?? <span className="text-brand-navy/30 italic">no reason given</span>}
              </td>
              <td className="px-4 py-3 text-brand-navy/50">{formatRelativeDate(new Date(r.createdAt))}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => resolve(r.id)}
                  disabled={loading === r.id}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  {loading === r.id ? "..." : "Resolve"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
