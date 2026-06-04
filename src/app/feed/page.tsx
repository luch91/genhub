import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { FeedItem } from "@/components/feed/feed-item"

export const metadata: Metadata = { title: "Feed" }

type PageProps = {
  searchParams: Promise<{ type?: string }>
}

const UPDATE_TYPES = ["MILESTONE", "BLOCKER", "BREAKTHROUGH", "GENERAL"] as const

async function getUpdates(type?: string) {
  return db.projectUpdate.findMany({
    where: type && UPDATE_TYPES.includes(type as (typeof UPDATE_TYPES)[number])
      ? { type: type as (typeof UPDATE_TYPES)[number] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author:  { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, slug: true, title: true } },
      _count:  { select: { comments: true } },
    },
  })
}

export default async function FeedPage({ searchParams }: PageProps) {
  const session = await auth()
  if (session?.user && !session.user.username) redirect("/onboarding")

  const { type } = await searchParams
  const updates = await getUpdates(type)

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-brand-navy">Building in public</h1>
        <p className="mt-1 text-brand-navy/50">
          Real-time updates from GenLayer builders — milestones, blockers, and breakthroughs.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterLink href="/feed" active={!type} label="All" />
        <FilterLink href="/feed?type=MILESTONE"    active={type === "MILESTONE"}    label="Milestones" />
        <FilterLink href="/feed?type=BREAKTHROUGH" active={type === "BREAKTHROUGH"} label="Breakthroughs" />
        <FilterLink href="/feed?type=BLOCKER"      active={type === "BLOCKER"}      label="Blockers" />
        <FilterLink href="/feed?type=GENERAL"      active={type === "GENERAL"}      label="Updates" />
      </div>

      {updates.length > 0 ? (
        <div className="space-y-3">
          {updates.map((update) => (
            <FeedItem key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-brand-indigo/15 py-16 text-center">
          <p className="text-brand-navy/45">No updates yet for this filter.</p>
        </div>
      )}
    </div>
  )
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "badge bg-brand-indigo text-white"
          : "badge border border-brand-indigo/15 bg-white text-brand-navy/55 hover:border-brand-indigo/30 hover:text-brand-navy transition-colors"
      }
    >
      {label}
    </Link>
  )
}
