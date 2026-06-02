"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { formatRelativeDate } from "@/lib/utils"

type Notification = {
  id: string
  type: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

const TYPE_ICONS: Record<string, string> = {
  FOLLOW:           "👤",
  PROJECT_REVIEW:   "👀",
  PROJECT_PUBLISHED:"✅",
  PROJECT_REJECTED: "↩️",
  NEW_UPDATE:       "📝",
  NEW_PROJECT:      "🚀",
  COMMENT:          "💬",
  DISCUSSION_REPLY: "↩",
}

type Props = { initialCount: number }

export function NotificationBell({ initialCount }: Props) {
  const [open, setOpen]                 = useState(false)
  const [count, setCount]               = useState(initialCount)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading]           = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleOpen() {
    const next = !open
    setOpen(next)
    if (next && notifications.length === 0) {
      setLoading(true)
      const res  = await fetch("/api/notifications")
      const json = await res.json()
      setNotifications(json.notifications)
      setLoading(false)
    }
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "POST" })
    setCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  async function markRead(id: string, link: string | null) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" })
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setCount((c) => Math.max(0, c - 1))
    if (link) window.location.href = link
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen} className="relative btn-ghost p-1.5" aria-label="Notifications">
        <BellIcon />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-indigo text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-brand-indigo/15 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-brand-indigo/10 px-4 py-3">
            <span className="font-ui text-sm font-semibold text-brand-navy">Notifications</span>
            {count > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-indigo hover:text-brand-indigo/80 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-brand-navy/40">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-brand-navy/40">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id, n.link)}
                  className={`w-full border-b border-brand-indigo/8 px-4 py-3 text-left last:border-0 transition-colors hover:bg-brand-indigo/5 ${
                    !n.read ? "bg-brand-indigo/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 text-base leading-none">{TYPE_ICONS[n.type] ?? "🔔"}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${n.read ? "text-brand-navy/50" : "text-brand-navy"}`}>
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-xs text-brand-navy/35">
                        {formatRelativeDate(new Date(n.createdAt))}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-indigo" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-brand-indigo/10 px-4 py-2.5">
            <Link
              href="/notifications"
              className="text-xs text-brand-navy/40 hover:text-brand-navy/70 transition-colors"
              onClick={() => setOpen(false)}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <svg className="h-5 w-5 text-brand-navy/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}
