import Link from "next/link"
import Image from "next/image"
import type { BuilderWithRelations } from "@/types"

type Props = { builder: BuilderWithRelations }

export function BuilderCard({ builder }: Props) {
  const href = builder.username ? `/builders/${builder.username}` : "#"

  return (
    <Link href={href} className="card group flex flex-col gap-4 transition-colors hover:border-slate-700">
      <div className="flex items-start gap-3">
        {builder.image ? (
          <Image
            src={builder.image}
            alt={builder.name ?? ""}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-700" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-100 group-hover:text-white">
            {builder.name ?? builder.username}
          </p>
          {builder.username && (
            <p className="text-xs text-slate-500">@{builder.username}</p>
          )}
        </div>
      </div>

      {builder.bio && (
        <p className="line-clamp-2 text-sm text-slate-500">{builder.bio}</p>
      )}

      <div className="mt-auto flex items-center gap-4 text-xs text-slate-600">
        <span>{builder._count.projects} project{builder._count.projects !== 1 ? "s" : ""}</span>
        <span>{builder._count.updates} update{builder._count.updates !== 1 ? "s" : ""}</span>
      </div>
    </Link>
  )
}
