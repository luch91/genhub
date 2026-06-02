import Link from "next/link"
import { db } from "@/lib/db"
import { ProjectCard } from "@/components/projects/project-card"
import { FeedItem } from "@/components/feed/feed-item"

async function getStats() {
  const [projectCount, builderCount, upvoteCount] = await Promise.all([
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { username: { not: null } } }),
    db.upvote.count(),
  ])
  return { projectCount, builderCount, upvoteCount }
}

async function getFeaturedProjects() {
  return db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { upvotes: { _count: "desc" } },
    take: 3,
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { upvotes: true, comments: true, updates: true } },
    },
  })
}

async function getRecentUpdates() {
  return db.projectUpdate.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, slug: true, title: true } },
      _count: { select: { comments: true } },
    },
  })
}

export default async function HomePage() {
  const [stats, featuredProjects, recentUpdates] = await Promise.all([
    getStats(),
    getFeaturedProjects(),
    getRecentUpdates(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-violet-950/20 to-background px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            Built on GenLayer
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
            Where GenLayer builders{" "}
            <span className="bg-gradient-to-r from-violet-400 to-violet-200 bg-clip-text text-transparent">
              come together
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-400">
            Submit your Intelligent Contract projects, share your journey, and
            discover what the community is building.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/projects/submit" className="btn-primary px-6 py-3 text-base">
              Submit your project
            </Link>
            <Link href="/projects" className="btn-secondary px-6 py-3 text-base">
              Browse projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-slate-800">
          <StatItem value={stats.projectCount} label="Projects submitted" />
          <StatItem value={stats.builderCount} label="Builders" />
          <StatItem value={stats.upvoteCount} label="Upvotes given" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        {/* Featured Projects */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="section-heading">Featured projects</h2>
            <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
              View all →
            </Link>
          </div>
          {featuredProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No projects yet — be the first to submit."
              action={{ href: "/projects/submit", label: "Submit a project" }}
            />
          )}
        </section>

        {/* Recent Feed */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="section-heading">Building in public</h2>
            <Link href="/feed" className="text-sm text-violet-400 hover:text-violet-300">
              See all updates →
            </Link>
          </div>
          {recentUpdates.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentUpdates.map((update) => (
                <FeedItem key={update.id} update={update} />
              ))}
            </div>
          ) : (
            <EmptyState message="No updates yet. Projects can post milestones, blockers, and breakthroughs here." />
          )}
        </section>
      </div>
    </div>
  )
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-8 py-6 text-center">
      <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  )
}

function EmptyState({
  message,
  action,
}: {
  message: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-12 text-center">
      <p className="text-slate-500">{message}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-4">
          {action.label}
        </Link>
      )}
    </div>
  )
}
