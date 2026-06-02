import Link from "next/link"
import Image from "next/image"
import type { ProjectUpdateWithRelations } from "@/types"
import { formatRelativeDate, UPDATE_TYPE_LABELS, UPDATE_TYPE_COLORS } from "@/lib/utils"

type Props = { update: ProjectUpdateWithRelations }

export function FeedItem({ update }: Props) {
  return (
    <div className="card space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {update.author.image ? (
            <Image
              src={update.author.image}
              alt={update.author.name ?? ""}
              width={28}
              height={28}
              className="flex-shrink-0 rounded-full"
            />
          ) : (
            <div className="h-7 w-7 flex-shrink-0 rounded-full bg-brand-indigo/15" />
          )}
          <div className="text-sm">
            <Link
              href={update.author.username ? `/builders/${update.author.username}` : "#"}
              className="font-medium text-brand-navy/75 hover:text-brand-navy transition-colors"
            >
              {update.author.name ?? update.author.username ?? "Builder"}
            </Link>
            <span className="text-brand-navy/40"> on </span>
            <Link
              href={`/projects/${update.project.slug}`}
              className="text-brand-indigo hover:text-brand-indigo/80 transition-colors"
            >
              {update.project.title}
            </Link>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <span className={`badge ${UPDATE_TYPE_COLORS[update.type]}`}>
            {UPDATE_TYPE_LABELS[update.type]}
          </span>
          <span className="text-xs text-brand-navy/35">
            {formatRelativeDate(update.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="whitespace-pre-wrap text-sm text-brand-navy/60">{update.content}</p>

      {/* Footer */}
      {update._count.comments > 0 && (
        <div className="pt-1 text-xs text-brand-navy/35">
          {update._count.comments} comment{update._count.comments !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )
}
