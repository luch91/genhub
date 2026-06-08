import { db } from "@/lib/db"
import { SpaceCard } from "@/components/spaces/space-card"
import Link from "next/link"

export default async function SpacesPage() {
  const spaces = await db.space.findMany({
    orderBy: [{ status: "asc" }, { scheduledAt: "asc" }],
    include: {
      host:         { select: { id: true, name: true, username: true, image: true } },
      project:      { select: { id: true, title: true, slug: true } },
      participants: { select: { role: true } },
    },
  })

  const live     = spaces.filter((s) => s.status === "LIVE")
  const upcoming = spaces.filter((s) => s.status === "SCHEDULED")
  const past     = spaces.filter((s) => s.status === "ENDED")

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-[11px] font-mono tracking-widest text-brand-indigo uppercase mb-1">
            Live Audio
          </p>
          <h1 className="font-display text-3xl font-black text-brand-navy">GenHub Space</h1>
          <p className="text-brand-navy/55 text-sm mt-1">
            Live audio rooms for the GenLayer builder community.
          </p>
        </div>
        <Link
          href="/spaces/create"
          className="shrink-0 btn-primary py-2 text-sm"
        >
          + Start a GenHub Space
        </Link>
      </div>

      {live.length > 0 && (
        <section className="mb-10">
          <h2 className="section-heading mb-4 text-brand-indigo">🎙 Live Now</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((s) => <SpaceCard key={s.id} space={s} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="section-heading mb-4">Upcoming</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((s) => <SpaceCard key={s.id} space={s} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="section-heading mb-4">Past</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((s) => <SpaceCard key={s.id} space={s} />)}
          </div>
        </section>
      )}

      {spaces.length === 0 && (
        <div className="text-center py-20 text-brand-navy/40">
          <p className="text-4xl mb-4">🎙</p>
          <p className="font-ui font-medium">No spaces yet</p>
          <p className="text-sm mt-1">Start the first one.</p>
        </div>
      )}
    </main>
  )
}
