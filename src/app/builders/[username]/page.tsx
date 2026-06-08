import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { ProjectCard } from "@/components/projects/project-card"
import { FollowButton } from "@/components/builders/follow-button"
import { OnlineDot } from "@/components/ui/online-dot"
import { formatDate } from "@/lib/utils"

type PageProps = { params: Promise<{ username: string }> }

async function getBuilder(username: string) {
  return db.user.findUnique({
    where: { username },
    include: {
      projects: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          tags:   { include: { tag: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { upvotes: true, comments: true, updates: true } },
        },
      },
      _count: { select: { projects: true, updates: true } },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const builder = await getBuilder(username)
  if (!builder) return {}
  return {
    title: builder.name ?? builder.username ?? "Builder",
    description: builder.bio ?? undefined,
  }
}

export default async function BuilderProfilePage({ params }: PageProps) {
  const { username } = await params
  const [builder, session] = await Promise.all([getBuilder(username), auth()])
  if (!builder) notFound()

  const [followerCount, isFollowing] = await Promise.all([
    db.follow.count({ where: { followingId: builder.id } }),
    session?.user
      ? db.follow.findUnique({
          where: { followerId_followingId: { followerId: session.user.id!, followingId: builder.id } },
        }).then(Boolean)
      : Promise.resolve(false),
  ])

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Profile header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        {builder.image ? (
          <Image
            src={builder.image}
            alt={builder.name ?? ""}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-brand-indigo/15"
          />
        ) : (
          <div className="h-20 w-20 flex-shrink-0 rounded-full bg-brand-indigo/15" />
        )}

        <div className="flex-1">
          <h1 className="font-display text-2xl font-black text-brand-navy">{builder.name}</h1>
          <p className="flex items-center gap-1.5 font-mono text-sm text-brand-navy/45">
            @{builder.username}
            <OnlineDot lastSeenAt={builder.lastSeenAt} />
          </p>
          {builder.bio && (
            <p className="mt-3 max-w-xl text-brand-navy/55">{builder.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-navy/50">
            {builder.twitterHandle && (
              <a href={`https://twitter.com/${builder.twitterHandle}`} target="_blank" rel="noopener noreferrer"
                className="hover:text-brand-indigo transition-colors">
                @{builder.twitterHandle}
              </a>
            )}
            {builder.githubHandle && (
              <a href={`https://github.com/${builder.githubHandle}`} target="_blank" rel="noopener noreferrer"
                className="hover:text-brand-indigo transition-colors">
                {builder.githubHandle}
              </a>
            )}
            {builder.website && (
              <a href={builder.website} target="_blank" rel="noopener noreferrer"
                className="hover:text-brand-indigo transition-colors">
                {builder.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span>Joined {formatDate(builder.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-6 text-center">
            <div>
              <div className="font-display text-xl font-black text-brand-navy">{builder._count.projects}</div>
              <div className="text-xs text-brand-navy/45">Projects</div>
            </div>
            <div>
              <div className="font-display text-xl font-black text-brand-navy">{builder._count.updates}</div>
              <div className="text-xs text-brand-navy/45">Updates</div>
            </div>
          </div>
          {session?.user?.id === builder.id ? (
            <Link
              href="/settings"
              className="rounded-xl border border-brand-indigo/20 px-4 py-2 font-ui text-sm font-medium text-brand-navy/65 transition-colors hover:border-brand-indigo/40 hover:text-brand-navy"
            >
              Edit profile
            </Link>
          ) : (
            <FollowButton
              username={builder.username!}
              initialFollowing={isFollowing}
              initialCount={followerCount}
              currentUserId={session?.user?.id}
            />
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="section-heading mb-4">Projects</h2>
        {builder.projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {builder.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-indigo/15 py-12 text-center">
            <p className="text-brand-navy/45">No published projects yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
