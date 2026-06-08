import Link from "next/link"
import { cn } from "@/lib/utils"

interface SpaceCardProps {
  space: {
    id:            string
    title:         string
    description?:  string | null
    status:        string
    scheduledAt?:  Date | string | null
    listenerCount: number
    xSpaceUrl?:    string | null
    host:    { name?: string | null; username?: string | null }
    project?: { title: string; slug: string } | null
    participants: { role: string }[]
  }
}

export function SpaceCard({ space }: SpaceCardProps) {
  const isLive       = space.status === "LIVE"
  const isScheduled  = space.status === "SCHEDULED"
  const speakerCount = space.participants.filter(
    (p) => p.role === "SPEAKER" || p.role === "HOST"
  ).length

  return (
    <div className={cn(
      "rounded-2xl border border-brand-indigo/10 bg-white p-5 flex flex-col gap-3 shadow-sm",
      isLive && "border-brand-indigo/30 bg-brand-indigo/3"
    )}>
      <div>
        {isLive && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-brand-indigo uppercase">GenHub Space · Live</span>
          </div>
        )}
        <h3 className="font-ui font-semibold text-brand-navy leading-tight">{space.title}</h3>
        {space.description && (
          <p className="text-sm text-brand-navy/55 line-clamp-2 mt-1">{space.description}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-brand-navy/45">
        <span>{speakerCount} speaker{speakerCount !== 1 ? "s" : ""}</span>
        {isLive && (
          <span className="text-brand-indigo">{space.listenerCount} listening</span>
        )}
        {space.scheduledAt && isScheduled && (
          <span>🗓{" "}
            {new Date(space.scheduledAt).toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-navy/40">
          by @{space.host.username ?? space.host.name}
        </span>
        <div className="flex items-center gap-2">
          {space.xSpaceUrl && (isLive || isScheduled) && (
            <a
              href={space.xSpaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-black hover:bg-black/80 text-white text-xs font-semibold transition-colors"
            >
              𝕏 X Space
            </a>
          )}
          {isLive ? (
            <Link
              href={`/spaces/${space.id}`}
              className="px-4 py-1.5 rounded-full bg-brand-indigo hover:bg-brand-indigo/85 text-white text-xs font-semibold transition-colors"
            >
              Join →
            </Link>
          ) : isScheduled ? (
            <span className="px-4 py-1.5 rounded-full border border-brand-indigo/15 text-brand-navy/45 text-xs">
              Upcoming
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-full border border-brand-indigo/10 text-brand-navy/35 text-xs">
              Ended
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
