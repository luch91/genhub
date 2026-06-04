import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { DiscussionCard } from "@/components/discuss/discussion-card"

export const metadata: Metadata = { title: "Discuss" }

type PageProps = {
  searchParams: Promise<{ category?: string }>
}

const CATEGORIES = [
  { value: undefined,   label: "All" },
  { value: "GENERAL",   label: "General" },
  { value: "HELP",      label: "Help" },
  { value: "IDEAS",     label: "Ideas" },
  { value: "SHOWCASE",  label: "Showcase" },
] as const

const VALID_CATEGORIES = ["GENERAL", "HELP", "IDEAS", "SHOWCASE"] as const
type Category = (typeof VALID_CATEGORIES)[number]

async function getDiscussions(category?: string) {
  return db.discussion.findMany({
    where: category && VALID_CATEGORIES.includes(category as Category)
      ? { category: category as Category }
      : {},
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { replies: true } },
    },
  })
}

export default async function DiscussPage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const session = await auth()
  if (session?.user && !session.user.username) redirect("/onboarding")
  const discussions = await getDiscussions(category)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-brand-navy">Discuss</h1>
          <p className="mt-1 text-brand-navy/50">
            Ask questions, share ideas, and connect with other builders.
          </p>
        </div>
        {session?.user && (
          <Link href="/discuss/new" className="btn-primary flex-shrink-0">
            New discussion
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.label}
            href={c.value ? `/discuss?category=${c.value}` : "/discuss"}
            className={
              category === c.value || (!category && !c.value)
                ? "badge bg-brand-indigo text-white"
                : "badge border border-brand-indigo/15 bg-white text-brand-navy/55 hover:border-brand-indigo/30 hover:text-brand-navy transition-colors"
            }
          >
            {c.label}
          </Link>
        ))}
      </div>

      {discussions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {discussions.map((d) => (
            <DiscussionCard key={d.id} discussion={d} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-indigo/15 py-16 text-center">
          <p className="text-brand-navy/45">No discussions yet.</p>
          {session?.user && (
            <Link href="/discuss/new" className="btn-primary mt-4">
              Start the first discussion
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
