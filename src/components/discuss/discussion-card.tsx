import Link from "next/link"
import Image from "next/image"
import type { DiscussionWithRelations } from "@/types"
import { formatRelativeDate } from "@/lib/utils"

const CATEGORY_LABELS = {
  GENERAL: "General",
  HELP: "Help",
  IDEAS: "Ideas",
  SHOWCASE: "Showcase",
} as const

const CATEGORY_COLORS = {
  GENERAL: "bg-slate-800 text-slate-400",
  HELP: "bg-blue-900/50 text-blue-300",
  IDEAS: "bg-amber-900/50 text-amber-300",
  SHOWCASE: "bg-violet-900/50 text-violet-300",
} as const

type Props = { discussion: DiscussionWithRelations }

export function DiscussionCard({ discussion }: Props) {
  return (
    <Link
      href={`/discuss/${discussion.id}`}
      className="card group flex flex-col gap-3 transition-colors hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className={`badge ${CATEGORY_COLORS[discussion.category]}`}>
              {CATEGORY_LABELS[discussion.category]}
            </span>
            {discussion.pinned && (
              <span className="text-xs text-slate-600">Pinned</span>
            )}
          </div>
          <h3 className="font-medium text-slate-100 group-hover:text-white">
            {discussion.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {discussion.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600">
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
