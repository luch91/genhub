import type { Metadata } from "next"
import { db } from "@/lib/db"
import { BuilderCard } from "@/components/builders/builder-card"

export const metadata: Metadata = { title: "Builders" }

async function getBuilders() {
  return db.user.findMany({
    where: { username: { not: null } },
    orderBy: { projects: { _count: "desc" } },
    include: {
      _count: { select: { projects: true, updates: true } },
    },
  })
}

export default async function BuildersPage() {
  const builders = await getBuilders()

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Builders</h1>
        <p className="mt-1 text-slate-400">
          {builders.length} builder{builders.length !== 1 ? "s" : ""} in the community
        </p>
      </div>

      {builders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builders.map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-16 text-center">
          <p className="text-slate-500">No builders yet. Sign in to join the community.</p>
        </div>
      )}
    </div>
  )
}
