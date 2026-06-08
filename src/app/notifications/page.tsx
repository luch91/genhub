import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatRelativeDate } from "@/lib/utils"

export const metadata: Metadata = { title: "Notifications" }

const TYPE_ICONS: Record<string, string> = {
  FOLLOW:            "👤",
  PROJECT_REVIEW:    "👀",
  PROJECT_PUBLISHED: "✅",
  PROJECT_REJECTED:  "↩️",
  NEW_UPDATE:        "📝",
  NEW_PROJECT:       "🚀",
  COMMENT:           "💬",
  DISCUSSION_REPLY:  "↩",
  SPACE_LIVE:        "🎙",
  UPVOTE_MILESTONE:  "⬆️",
}

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  })

  const grouped = groupByDate(notifications)

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-black text-brand-navy">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-indigo/15 py-16 text-center">
          <p className="text-brand-navy/45">No notifications yet.</p>
          <p className="mt-1 text-sm text-brand-navy/35">
            Follow builders and submit projects to start seeing activity here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">
                {label}
              </h2>
              <div className="overflow-hidden rounded-xl border border-brand-indigo/15 bg-white">
                {items.map((n, i) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      i < items.length - 1 ? "border-b border-brand-indigo/8" : ""
                    } ${!n.read ? "bg-brand-indigo/5" : ""}`}
                  >
                    <span className="mt-0.5 text-lg leading-none">{TYPE_ICONS[n.type] ?? "🔔"}</span>
                    <div className="flex-1">
                      {n.link ? (
                        <Link href={n.link} className="text-sm text-brand-navy/70 hover:text-brand-navy transition-colors">
                          {n.message}
                        </Link>
                      ) : (
                        <p className="text-sm text-brand-navy/70">{n.message}</p>
                      )}
                      <p className="mt-0.5 text-xs text-brand-navy/35">
                        {formatRelativeDate(n.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function groupByDate(
  notifications: { id: string; type: string; message: string; link: string | null; read: boolean; createdAt: Date }[]
) {
  const groups: Record<string, typeof notifications> = {}
  const now = new Date()
  for (const n of notifications) {
    const diffDays = Math.floor((now.getTime() - n.createdAt.getTime()) / 86400000)
    const label = diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : diffDays < 7 ? "This week" : "Older"
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  }
  return groups
}
