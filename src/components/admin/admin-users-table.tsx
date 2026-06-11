"use client"

import { useState } from "react"
import Image from "next/image"
import { formatRelativeDate } from "@/lib/utils"

type AdminUser = {
  id: string
  name: string | null
  username: string | null
  image: string | null
  submissionCredits: number
  isBanned: boolean
  isAdmin: boolean
  createdAt: Date
  _count: { projects: number }
}

export function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[]
  currentUserId: string
}) {
  const [list, setList]       = useState(users)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleBan(userId: string, current: boolean) {
    setLoading(userId)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isBanned: !current }),
    })
    if (res.ok) {
      setList((prev) => prev.map((u) => u.id === userId ? { ...u, isBanned: !current } : u))
    }
    setLoading(null)
  }

  async function adjustCredits(userId: string, current: number, delta: number) {
    const next = Math.max(0, current + delta)
    setLoading(`credits-${userId}`)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ submissionCredits: next }),
    })
    if (res.ok) {
      setList((prev) => prev.map((u) => u.id === userId ? { ...u, submissionCredits: next } : u))
    }
    setLoading(null)
  }

  async function toggleAdmin(userId: string, current: boolean) {
    setLoading(`admin-${userId}`)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isAdmin: !current }),
    })
    if (res.ok) {
      setList((prev) => prev.map((u) => u.id === userId ? { ...u, isAdmin: !current } : u))
    }
    setLoading(null)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-indigo/15 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-indigo/10 text-left text-xs font-mono uppercase tracking-wider text-brand-navy/40">
            <th className="px-4 py-3">Builder</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Projects</th>
            <th className="px-4 py-3">Credits</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-indigo/8">
          {list.map((u) => (
            <tr key={u.id} className={u.isBanned ? "bg-red-50/50" : ""}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {u.image && (
                    <Image src={u.image} alt="" width={24} height={24} className="rounded-full" />
                  )}
                  <div>
                    <p className="font-medium text-brand-navy">{u.name ?? "—"}</p>
                    <p className="text-xs text-brand-navy/40">@{u.username}</p>
                  </div>
                  {u.isAdmin && (
                    <span className="ml-1 rounded-full bg-brand-indigo/10 px-2 py-0.5 text-[10px] font-mono text-brand-indigo">admin</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-brand-navy/50">{formatRelativeDate(new Date(u.createdAt))}</td>
              <td className="px-4 py-3 text-brand-navy/70">{u._count.projects}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => adjustCredits(u.id, u.submissionCredits, -1)}
                    disabled={loading === `credits-${u.id}` || u.submissionCredits === 0}
                    className="h-5 w-5 rounded border border-brand-indigo/20 text-brand-navy/50 hover:bg-brand-indigo/8 disabled:opacity-40 text-xs leading-none"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-brand-navy">{u.submissionCredits}</span>
                  <button
                    onClick={() => adjustCredits(u.id, u.submissionCredits, 1)}
                    disabled={loading === `credits-${u.id}`}
                    className="h-5 w-5 rounded border border-brand-indigo/20 text-brand-navy/50 hover:bg-brand-indigo/8 disabled:opacity-40 text-xs leading-none"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                {u.isBanned ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-mono text-red-600">banned</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-mono text-emerald-600">active</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* Promote / demote — cannot target yourself */}
                  {u.id !== currentUserId && (
                    <button
                      onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      disabled={loading === `admin-${u.id}`}
                      className="rounded-full bg-brand-indigo/8 px-3 py-1 text-xs font-semibold text-brand-indigo hover:bg-brand-indigo/15 transition-colors disabled:opacity-50"
                    >
                      {u.isAdmin ? "Remove admin" : "Make admin"}
                    </button>
                  )}
                  {/* Ban / unban — admins cannot be banned */}
                  {!u.isAdmin && (
                    <button
                      onClick={() => toggleBan(u.id, u.isBanned)}
                      disabled={loading === u.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                        u.isBanned
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
