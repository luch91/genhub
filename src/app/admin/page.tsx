import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminUsersTable } from "@/components/admin/admin-users-table"
import { AdminProjectsTable } from "@/components/admin/admin-projects-table"
import { AdminDiscussionsTable } from "@/components/admin/admin-discussions-table"
import { AdminReportsTable } from "@/components/admin/admin-reports-table"

export const metadata: Metadata = { title: "Admin" }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) redirect("/")

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    users, projects, discussions, reports,
    totalUpvotes, totalComments,
    newBuildersThisWeek, newProjectsThisWeek,
    topProjects, topBuilders,
  ] = await Promise.all([
    db.user.findMany({
      where: { username: { not: null } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, username: true, image: true,
        submissionCredits: true, isBanned: true, isAdmin: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
    }),
    db.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, slug: true, featured: true, createdAt: true,
        author: { select: { name: true, username: true } },
        _count: { select: { upvotes: true } },
      },
    }),
    db.discussion.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, title: true, category: true, pinned: true, createdAt: true,
        author: { select: { name: true, username: true } },
        _count: { select: { replies: true } },
      },
    }),
    db.report.findMany({
      where: { resolved: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, type: true, contentId: true, reason: true, resolved: true, createdAt: true,
        reporter: { select: { name: true, username: true } },
      },
    }),
    db.upvote.count(),
    db.comment.count(),
    db.user.count({ where: { username: { not: null }, createdAt: { gte: oneWeekAgo } } }),
    db.project.count({ where: { status: "PUBLISHED", createdAt: { gte: oneWeekAgo } } }),
    db.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { upvotes: { _count: "desc" } },
      take: 5,
      select: { slug: true, title: true, _count: { select: { upvotes: true } } },
    }),
    db.user.findMany({
      where: { username: { not: null } },
      orderBy: { reputationScore: "desc" },
      take: 5,
      select: { username: true, name: true, reputationScore: true, _count: { select: { projects: true } } },
    }),
  ])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-indigo mb-1">Admin</p>
        <h1 className="font-display text-3xl font-black text-brand-navy">Dashboard</h1>
      </div>

      {/* Stats */}
      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Builders",    value: users.length,     sub: `+${newBuildersThisWeek} this week` },
            { label: "Projects",    value: projects.length,  sub: `+${newProjectsThisWeek} this week` },
            { label: "Upvotes",     value: totalUpvotes,     sub: "all time" },
            { label: "Comments",    value: totalComments,    sub: "all time" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-brand-indigo/15 bg-white px-5 py-4">
              <p className="font-mono text-2xl font-bold text-brand-navy">{s.value}</p>
              <p className="text-sm font-medium text-brand-navy/60">{s.label}</p>
              <p className="mt-0.5 text-xs text-brand-navy/35">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Top projects */}
          <div className="rounded-xl border border-brand-indigo/15 bg-white p-5">
            <p className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-brand-navy/40">Top projects by upvotes</p>
            <ol className="space-y-2">
              {topProjects.map((p, i) => (
                <li key={p.slug} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-brand-navy/30 font-mono">{i + 1}.</span>
                  <Link href={`/projects/${p.slug}`} className="flex-1 text-brand-navy hover:text-brand-indigo transition-colors truncate">
                    {p.title}
                  </Link>
                  <span className="font-mono text-xs text-brand-indigo/70">{p._count.upvotes} ↑</span>
                </li>
              ))}
            </ol>
          </div>
          {/* Top builders */}
          <div className="rounded-xl border border-brand-indigo/15 bg-white p-5">
            <p className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-brand-navy/40">Top builders by reputation</p>
            <ol className="space-y-2">
              {topBuilders.map((b, i) => (
                <li key={b.username} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-brand-navy/30 font-mono">{i + 1}.</span>
                  <Link href={`/builders/${b.username}`} className="flex-1 text-brand-navy hover:text-brand-indigo transition-colors">
                    @{b.username}
                  </Link>
                  <span className="font-mono text-xs text-brand-navy/40">{b._count.projects} projects</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">
          Reports <span className="text-brand-navy/40 font-normal text-base">({reports.length} unresolved)</span>
        </h2>
        <AdminReportsTable reports={reports} />
      </section>

      {/* Builders */}
      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">Builders ({users.length})</h2>
        <AdminUsersTable users={users} currentUserId={session.user.id} />
      </section>

      {/* Projects */}
      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">Published Projects ({projects.length})</h2>
        <AdminProjectsTable projects={projects} />
      </section>

      {/* Discussions */}
      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">Discussions ({discussions.length})</h2>
        <AdminDiscussionsTable discussions={discussions} />
      </section>
    </div>
  )
}
