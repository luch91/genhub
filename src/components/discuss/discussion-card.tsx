import Link from "next/link"
import Image from "next/image"
import type { DiscussionWithRelations } from "@/types"
import { formatRelativeDate } from "@/lib/utils"

const CATEGORY_LABELS = {
  GENERAL:  "General",
  HELP:     "Help",
  IDEAS:    "Ideas",
  SHOWCASE: "Showcase",
} as const

const CATEGORY_COLORS = {
  GENERAL:  "bg-brand-navy/10 text-brand-navy/55",
  HELP:     "bg-blue-100 text-blue-700",
  IDEAS:    "bg-amber-100 text-amber-700",
  SHOWCASE: "bg-brand-indigo/10 text-brand-indigo",
} as const

type Props = { discussion: DiscussionWithRelations }

export function DiscussionCard({ discussion }: Props) {
  return (
    <Link
      href={`/discuss/${discussion.id}`}
      className="card group flex flex-col gap-3 transition-all hover:border-brand-indigo/25 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className={`badge ${CATEGORY_COLORS[discussion.category]}`}>
              {CATEGORY_LABELS[discussion.category]}
            </span>
            {discussion.pinned && (
              <span className="text-xs text-brand-navy/35">Pinned</span>
            )}
          </div>
          <h3 className="font-ui font-medium text-brand-navy group-hover:text-brand-indigo transition-colors">
            {discussion.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-brand-navy/50">
            {discussion.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-brand-navy/40">
        <div className="flex items-center gap-2">
          {discussion.author.image && (
            <Image
              src={discussion.author.image}
              alt={discussion.author.name ?? ""}
              width={16}
              height={16}
              className="rounded-full"
            />
          )}
          <span>{discussion.author.name ?? discussion.author.username}</span>
          <span>·</span>
          <span>{formatRelativeDate(discussion.createdAt)}</span>
        </div>
        <span>
          {discussion._count.replies} {discussion._count.replies === 1 ? "reply" : "replies"}
        </span>
      </div>
    </Link>
  )
}
