import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifyUser } from "@/lib/notifications"

const UPVOTE_MILESTONES = [5, 10, 25]

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

  // Notification at each exact milestone
  const isMilestone = UPVOTE_MILESTONES.includes(count)
  if (isMilestone && project.authorId !== session.user.id) {
    await notifyUser(
      project.authorId,
      "UPVOTE_MILESTONE",
      `Your project "${project.title}" just hit ${count} upvotes! 🎉`,
      `/projects/${project.slug}`
    )
  }

  // Credit at each milestone — upvoteCreditsAwarded tracks how many have been given (0–3)
  const nextMilestone = UPVOTE_MILESTONES[project.upvoteCreditsAwarded]
  if (nextMilestone !== undefined && count >= nextMilestone) {
    await Promise.all([
      db.project.update({
        where: { id },
        data: { upvoteCreditsAwarded: { increment: 1 } },
      }),
      db.user.update({
        where: { id: project.authorId },
        data: { submissionCredits: { increment: 1 } },
      }),
    ])
  }

  return Response.json({ upvoted: true, count })
}
