import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { ReplyForm } from "@/components/discuss/reply-form"
import { formatDate, formatRelativeDate } from "@/lib/utils"

type PageProps = { params: Promise<{ id: string }> }

const CATEGORY_LABELS = {
  GENERAL: "General",
  HELP: "Help",
  IDEAS: "Ideas",
  SHOWCASE: "Showcase",
} as const

const CATEGORY_COLORS = {
  GENERAL:  "border border-brand-indigo/15 bg-brand-indigo/5 text-brand-navy/55",
  HELP:     "border border-blue-200 bg-blue-50 text-blue-700",
  IDEAS:    "border border-brand-amber/30 bg-brand-amber/10 text-brand-amber-dk",
  SHOWCASE: "border border-brand-indigo/25 bg-brand-indigo/10 text-brand-indigo",
} as const

async function getDiscussion(id: string) {
  return db.discussion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
        },
      },
      _count: { select: { replies: true } },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const discussion = await getDiscussion(id)
  if (!discussion) return {}
  return { title: discussion.title }
}

export default async function DiscussionPage({ params }: PageProps) {
  const { id } = await params
  const [discussion, session] = await Promise.all([getDiscussion(id), auth()])
  if (!discussion) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/discuss" className="mb-6 inline-flex text-sm text-brand-navy/45 hover:text-brand-navy transition-colors">
        ← Back to discussions
      </Link>

      {/* Original post */}
      <div className="card mb-6 space-y-4">
        <div className="flex items-start gap-2">
          <span className={`badge ${CATEGORY_COLORS[discussion.category]}`}>
            {CATEGORY_LABELS[discussion.category]}
          </span>
        </div>
        <h1 className="font-display text-2xl font-black text-brand-navy">{discussion.title}</h1>
        <p className="whitespace-pre-wrap text-brand-navy/70">{discussion.content}</p>

        <div className="flex items-center gap-3 border-t border-brand-indigo/10 pt-4">
          {discussion.author.image && (
            <Image
              src={discussion.author.image}
              alt={discussion.author.name ?? ""}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <div className="text-sm">
            <Link
              href={discussion.author.username ? `/builders/${discussion.author.username}` : "#"}
              className="font-medium text-brand-navy hover:text-brand-navy/70 transition-colors"
            >
              {discussion.author.name ?? discussion.author.username}
            </Link>
            <span className="ml-2 text-brand-navy/35">{formatDate(discussion.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      {discussion.replies.length > 0 && (
        <div className="mb-6 space-y-3">
          <h2 className="section-heading">
            {discussion._count.replies} {discussion._count.replies === 1 ? "reply" : "replies"}
          </h2>
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              {reply.author.image ? (
                <Image
                  src={reply.author.image}
                  alt={reply.author.name ?? ""}
                  width={28}
                  height={28}
                  className="mt-0.5 flex-shrink-0 rounded-full"
                />
              ) : (
                <div className="mt-0.5 h-7 w-7 flex-shrink-0 rounded-full bg-brand-indigo/15" />
              )}
              <div className="flex-1 rounded-xl border border-brand-indigo/10 bg-white p-4">
                <div className="mb-2 flex items-baseline gap-2">
                  <Link
                    href={reply.author.username ? `/builders/${reply.author.username}` : "#"}
                    className="text-sm font-medium text-brand-navy hover:text-brand-navy/70 transition-colors"
                  >
                    {reply.author.name ?? reply.author.username}
                  </Link>
                  <span className="text-xs text-brand-navy/35">
                    {formatRelativeDate(reply.createdAt)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-brand-navy/65">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="card">
        <h2 className="section-heading mb-4">
          {session?.user ? "Write a reply" : "Join the discussion"}
        </h2>
        <ReplyForm
          discussionId={discussion.id}
          currentUserId={session?.user?.id}
        />
      </div>
    </div>
  )
}
