import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canReview } from "@/lib/review"
import { formatRelativeDate } from "@/lib/utils"

export const metadata: Metadata = { title: "Review Queue" }

async function getPendingProjects(userId: string) {
  const reviewed = await db.projectReview.findMany({
    where: { reviewerId: userId },
    select: { projectId: true },
  })
  const reviewedIds = reviewed.map((r) => r.projectId)

  return db.project.findMany({
    where: {
      status: "PENDING_REVIEW",
      authorId: { not: userId },
      id: { notIn: reviewedIds.length > 0 ? reviewedIds : ["__none__"] },
    },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { reviews: true } },
      reviews: { select: { decision: true } },
    },
  })
}

export default async function ReviewQueuePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const eligible = await canReview(session.user.id)
  if (!eligible) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-display text-2xl font-black text-brand-navy">Review Queue</h1>
        <p className="text-brand-navy/55">
          You need at least one published project to review others.{" "}
          <Link href="/projects/submit" className="text-brand-indigo hover:text-brand-indigo/80">
            Submit your first project →
          </Link>
        </p>
      </div>
    )
  }

  const projects = await getPendingProjects(session.user.id)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-brand-navy">Review Queue</h1>
        <p className="mt-1 text-brand-navy/55">
          Projects waiting for community review before going live. 3 approvals to publish, 3 rejections to send back.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => {
            const approvals = project.reviews.filter((r) => r.decision === "APPROVED").length
            const rejections = project.reviews.filter((r) => r.decision === "REJECTED").length
            return (
              <div key={project.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map(({ tag }) => (
                        <span key={tag.id} className="badge border border-brand-indigo/15 bg-brand-indigo/5 text-brand-indigo/60 text-xs">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-ui font-semibold text-brand-navy">{project.title}</h2>
                    <p className="mt-1 text-sm text-brand-navy/50">{project.tagline}</p>
                  </div>
                  <Link href={`/review/${project.id}`} className="btn-primary flex-shrink-0 text-sm">
                    Review
                  </Link>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-navy/40">
                  <div className="flex items-center gap-2">
                    {project.author.image && (
                      <Image
                        src={project.author.image}
                        alt={project.author.name ?? ""}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    )}
                    <span>{project.author.name ?? project.author.username}</span>
                    <span>·</span>
                    <span>{formatRelativeDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600">{approvals}/3 approvals</span>
                    <span className="text-red-500">{rejections}/3 rejections</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-indigo/15 py-16 text-center">
          <p className="text-brand-navy/45">No projects waiting for review. Check back later.</p>
        </div>
      )}
    </div>
  )
}
