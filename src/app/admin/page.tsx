import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdminUsersTable } from "@/components/admin/admin-users-table"
import { AdminProjectsTable } from "@/components/admin/admin-projects-table"

export const metadata: Metadata = { title: "Admin" }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) redirect("/")

  const [users, projects] = await Promise.all([
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
  ])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-indigo mb-1">
          Admin
        </p>
        <h1 className="font-display text-3xl font-black text-brand-navy">Dashboard</h1>
      </div>

      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">
          Builders ({users.length})
        </h2>
        <AdminUsersTable users={users} />
      </section>

      <section>
        <h2 className="font-ui text-lg font-bold text-brand-navy mb-4">
          Published Projects ({projects.length})
        </h2>
        <AdminProjectsTable projects={projects} />
      </section>
    </div>
  )
}
