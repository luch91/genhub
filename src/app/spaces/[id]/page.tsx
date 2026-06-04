import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { SpaceRoom } from "@/components/spaces/space-room"

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const space = await db.space.findUnique({
    where: { id },
    include: {
      host:    { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, title: true, slug: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
        },
      },
    },
  })

  if (!space) notFound()

  if (space.status === "ENDED") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="text-brand-navy/40 text-sm font-mono uppercase tracking-widest mb-2">
          Space Ended
        </p>
        <h1 className="font-display text-2xl font-black text-brand-navy mb-4">{space.title}</h1>
        {space.replayUrl ? (
          <a
            href={space.replayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-indigo hover:text-brand-indigo/70 text-sm transition-colors"
          >
            Watch replay →
          </a>
        ) : (
          <p className="text-brand-navy/40 text-sm">No replay available.</p>
        )}
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] font-mono tracking-widest text-brand-indigo uppercase mb-1">
          Live Space
        </p>
        <h1 className="font-display text-2xl font-black text-brand-navy">{space.title}</h1>
        {space.description && (
          <p className="text-brand-navy/55 text-sm mt-1">{space.description}</p>
        )}
        {space.project && (
          <a
            href={`/projects/${space.project.slug}`}
            className="inline-block mt-2 text-xs text-brand-indigo hover:text-brand-indigo/70 transition-colors"
          >
            Related: {space.project.title} →
          </a>
        )}
      </div>

      {/* SpaceRoom is a Client Component — no function props passed from server */}
      <SpaceRoom
        spaceId={space.id}
        hostId={space.hostId}
        currentUserId={session.user.id}
      />
    </main>
  )
}
