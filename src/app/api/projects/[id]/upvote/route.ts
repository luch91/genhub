import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { REVIEW_THRESHOLDS } from "@/lib/utils"

type Params = { params: Promise<{ id: string }> }

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })

  const existing = await db.upvote.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId: id } },
  })

  if (existing) {
    await db.upvote.delete({ where: { id: existing.id } })
    const count = await db.upvote.count({ where: { projectId: id } })
    return Response.json({ upvoted: false, count })
  }

  await db.upvote.create({ data: { userId: session.user.id, projectId: id } })
  const count = await db.upvote.count({ where: { projectId: id } })

  // Restore one submission credit to the author when their project hits the threshold (once only)
  if (
    count >= REVIEW_THRESHOLDS.UPVOTES_FOR_CREDIT &&
    !project.creditRestored &&
    project.status === "PUBLISHED"
  ) {
    await Promise.all([
      db.project.update({ where: { id }, data: { creditRestored: true } }),
      db.user.update({
        where: { id: project.authorId },
        data: {
          submissionCredits: { increment: 1 },
          reputationScore: { increment: 5 },
        },
      }),
    ])
  }

  return Response.json({ upvoted: true, count })
}
