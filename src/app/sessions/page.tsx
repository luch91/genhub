import { db } from "@/lib/db"
import { SessionCard } from "@/components/sessions/session-card"
import Link from "next/link"

export default async function SessionsPage() {
  const sessions = await db.builderSession.findMany({
    orderBy: [{ status: "asc" }, { scheduledAt: "asc" }],
    include: {
      host:    { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, title: true, slug: true } },
    },
  })

  const live     = sessions.filter((s) => s.status === "LIVE")
  const upcoming = sessions.filter((s) => s.status === "SCHEDULED")
  const past     = sessions.filter((s) => s.status === "ENDED")

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-[11px] font-mono tracking-widest text-brand-indigo uppercase mb-1">
            Builder Sessions
          </p>
          <h1 className="font-display text-3xl font-black text-brand-navy">Sessions</h1>
          <p className="text-brand-navy/55 text-sm mt-1">
            Live and recorded sessions from the GenLayer builder community.
          </p>
          <p className="text-xs text-brand-navy/40 mt-2">
            💡 Make sure your YouTube stream is set to <strong>Public</strong> — unlisted videos won&apos;t embed.
          </p>
        </div>
        <Link
          href="/sessions/schedule"
          className="shrink-0 btn-primary py-2 text-sm"
        >
          + Schedule Session
        </Link>
      </div>

      {live.length > 0 && (
        <section className="mb-10">
          <h2 className="section-heading mb-4 text-red-500">🔴 Live Now</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="section-heading mb-4">Upcoming</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="section-heading mb-4">Past Sessions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {sessions.length === 0 && (
        <div className="text-center py-20 text-brand-navy/40">
          <p className="text-4xl mb-4">🎙</p>
          <p className="font-ui font-medium">No sessions yet</p>
          <p className="text-sm mt-1">Be the first to schedule one.</p>
        </div>
      )}
    </main>
  )
}
