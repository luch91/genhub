import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { canReview } from "@/lib/review"
import { REVIEW_THRESHOLDS } from "@/lib/utils"

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  const [approvals, rejections, reviews] = await Promise.all([
    db.projectReview.count({ where: { projectId: id, decision: "APPROVED" } }),
    db.projectReview.count({ where: { projectId: id, decision: "REJECTED" } }),
    db.projectReview.findMany({
      where: { projectId: id },
      include: { reviewer: { select: { id: true, name: true, username: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ])
  return Response.json({ approvals, rejections, reviews })
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const eligible = await canReview(session.user.id)
  if (!eligible) {
    return Response.json(
      { error: "You need at least one published project to review others." },
      { status: 403 }
    )
  }

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.status !== "PENDING_REVIEW") {
    return Response.json({ error: "Project is not pending review" }, { status: 400 })
  }
  if (project.authorId === session.user.id) {
    return Response.json({ error: "You cannot review your own project" }, { status: 403 })
  }

  const existing = await db.projectReview.findUnique({
    where: { reviewerId_projectId: { reviewerId: session.user.id, projectId: id } },
  })
  if (existing) return Response.json({ error: "You have already reviewed this project" }, { status: 400 })

  const body = await request.json()
  const { decision, feedback } = body as { decision: string; feedback?: string }

  if (decision !== "APPROVED" && decision !== "REJECTED") {
    return Response.json({ error: "Decision must be APPROVED or REJECTED" }, { status: 422 })
  }
  if (decision === "REJECTED" && !feedback?.trim()) {
    return Response.json({ error: "Feedback is required when rejecting" }, { status: 422 })
  }

  await db.projectReview.create({
    data: {
      decision: decision as "APPROVED" | "REJECTED",
      feedback: feedback?.trim() || null,
      projectId: id,
      reviewerId: session.user.id,
    },
  })

  const [approvals, rejections] = await Promise.all([
    db.projectReview.count({ where: { projectId: id, decision: "APPROVED" } }),
    db.projectReview.count({ where: { projectId: id, decision: "REJECTED" } }),
  ])

  if (approvals >= REVIEW_THRESHOLDS.APPROVALS_NEEDED) {
    await Promise.all([
      db.project.update({ where: { id }, data: { status: "PUBLISHED" } }),
      db.user.update({
        where: { id: project.authorId },
        data: { reputationScore: { increment: 10 } },
      }),
    ])
    return Response.json({ status: "PUBLISHED", approvals, rejections }, { status: 201 })
  }

  if (rejections >= REVIEW_THRESHOLDS.REJECTIONS_NEEDED) {
    await db.project.update({ where: { id }, data: { status: "DRAFT" } })
    return Response.json({ status: "DRAFT", approvals, rejections }, { status: 201 })
  }

  return Response.json({ status: "PENDING_REVIEW", approvals, rejections }, { status: 201 })
}
