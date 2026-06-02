import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canReview } from "@/lib/review"
import { ReviewForm } from "@/components/review/review-form"
import { formatDate, REVIEW_THRESHOLDS } from "@/lib/utils"

type PageProps = { params: Promise<{ id: string }> }

async function getProjectForReview(id: string) {
  return db.project.findUnique({
    where: { id, status: "PENDING_REVIEW" },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, username: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getProjectForReview(id)
  if (!project) return {}
  return { title: `Review: ${project.title}` }
}

export default async function ReviewProjectPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const eligible = await canReview(session.user.id)
  if (!eligible) redirect("/review")

  const project = await getProjectForReview(id)
  if (!project) notFound()

  if (project.authorId === session.user.id) redirect("/review")

  const alreadyReviewed = project.reviews.some((r) => r.reviewerId === session.user.id)
  const approvals = project.reviews.filter((r) => r.decision === "APPROVED").length
  const rejections = project.reviews.filter((r) => r.decision === "REJECTED").length

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/review" className="mb-6 inline-flex text-sm text-slate-500 hover:text-slate-300">
        ← Back to queue
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* Project details */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-1">
              {project.tags.map(({ tag }) => (
                <span key={tag.id} className="badge border border-slate-700 bg-slate-800 text-slate-500 text-xs">
                  {tag.name}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="mt-1 text-slate-400">{project.tagline}</p>
          </div>

          <div className="card">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</h2>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{project.description}</p>
          </div>

          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
              Why only GenLayer?
            </h2>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{project.genlayerAngle}</p>
          </div>

          {(project.contractAddress || project.repoUrl || project.demoUrl) && (
            <div className="card space-y-2 text-sm">
              {project.contractAddress && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Contract</span>
                  <span className="font-mono text-xs text-slate-400">
                    {project.contractAddress.slice(0, 10)}…
                  </span>
                </div>
              )}
              {project.repoUrl && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Repo</span>
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 text-xs">
                    View →
                  </a>
                </div>
              )}
              {project.demoUrl && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Demo</span>
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 text-xs">
                    Try it →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Progress */}
          <div className="card">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Review progress
            </h3>
            <div className="space-y-2">
              <ReviewBar
                label="Approvals"
                count={approvals}
                needed={REVIEW_THRESHOLDS.APPROVALS_NEEDED}
                color="emerald"
              />
              <ReviewBar
                label="Rejections"
                count={rejections}
                needed={REVIEW_THRESHOLDS.REJECTIONS_NEEDED}
                color="red"
              />
            </div>
          </div>

          {/* Submitted by */}
          <div className="card">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Submitted by
            </h3>
            <div className="flex items-center gap-2">
              {project.author.image && (
                <Image
                  src={project.author.image}
                  alt={project.author.name ?? ""}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium text-slate-200">{project.author.name}</p>
                <p className="text-xs text-slate-600">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Existing feedback */}
          {project.reviews.some((r) => r.feedback) && (
            <div className="card space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Reviewer feedback
              </h3>
              {project.reviews
                .filter((r) => r.feedback)
                .map((r) => (
                  <div key={r.id} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={
                          r.decision === "APPROVED"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {r.decision === "APPROVED" ? "✓" : "✗"}
                      </span>
                      <span className="text-slate-500">
                        {r.reviewer.name ?? r.reviewer.username}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{r.feedback}</p>
                  </div>
                ))}
            </div>
          )}

          {/* Review form */}
          <div className="card">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your review
            </h3>
            {alreadyReviewed ? (
              <p className="text-sm text-slate-500">You have already reviewed this project.</p>
            ) : (
              <ReviewForm projectId={project.id} />
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function ReviewBar({
  label,
  count,
  needed,
  color,
}: {
  label: string
  count: number
  needed: number
  color: "emerald" | "red"
}) {
  const pct = Math.min((count / needed) * 100, 100)
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className={color === "emerald" ? "text-emerald-500" : "text-red-500"}>
          {count}/{needed}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className={`h-1.5 rounded-full transition-all ${
            color === "emerald" ? "bg-emerald-500" : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
