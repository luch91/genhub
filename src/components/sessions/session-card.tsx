import { YoutubeEmbed } from "./youtube-embed"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: {
    id:              string
    title:           string
    description?:    string | null
    status:          string
    scheduledAt?:    Date | string | null
    youtubeVideoId?: string | null
    isRecurring:     boolean
    recurrence?:     string | null
    host:    { name?: string | null; username?: string | null }
    project?: { title: string; slug: string } | null
  }
}

export function SessionCard({ session }: SessionCardProps) {
  const isLive  = session.status === "LIVE"
  const isEnded = session.status === "ENDED"

  return (
    <div className={cn(
      "rounded-2xl border border-brand-indigo/10 bg-white p-5 flex flex-col gap-4 shadow-sm",
      isLive && "border-amber-400/40 bg-amber-50"
    )}>
      <div className="flex flex-col gap-1">
        {isLive && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">Live Now</span>
          </div>
        )}
        <h3 className="font-ui font-semibold text-brand-navy leading-tight">{session.title}</h3>
        {session.description && (
          <p className="text-sm text-brand-navy/55 line-clamp-2">{session.description}</p>
        )}
      </div>

      {session.youtubeVideoId && (isLive || isEnded) && (
        <YoutubeEmbed videoId={session.youtubeVideoId} title={session.title} />
      )}

      {session.status === "SCHEDULED" && session.scheduledAt && (
        <p className="text-sm text-brand-navy/55 font-mono">
          🗓{" "}
          {new Date(session.scheduledAt).toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
          {session.isRecurring && session.recurrence && (
            <span className="ml-2 text-brand-amber-dk">· {session.recurrence}</span>
          )}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-brand-navy/40 pt-1 border-t border-brand-indigo/8">
        <span>by @{session.host.username ?? session.host.name}</span>
        {session.project && (
          <a
            href={`/projects/${session.project.slug}`}
            className="text-brand-indigo hover:text-brand-indigo/70 transition-colors"
          >
            {session.project.title} →
          </a>
        )}
      </div>
    </div>
  )
}
