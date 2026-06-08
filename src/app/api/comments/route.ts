import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { commentSchema } from "@/lib/validations"
import { notifyUser } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { projectId, updateId } = body as { projectId?: string; updateId?: string }

  if (!projectId && !updateId) {
    return Response.json({ error: "projectId or updateId is required" }, { status: 422 })
  }

  const result = commentSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const comment = await db.comment.create({
    data: {
      content: result.data.content,
      authorId: session.user.id,
      projectId: projectId ?? null,
      updateId: updateId ?? null,
    },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
    },
  })

  const commenter = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true, lastCommentCredit: true },
  })

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const eligibleForCredit =
    !commenter?.lastCommentCredit || commenter.lastCommentCredit < oneWeekAgo

  const tasks: Promise<unknown>[] = []

  // Award comment credit once per week globally
  if (eligibleForCredit) {
    tasks.push(
      db.user.update({
        where: { id: session.user.id },
        data: {
          submissionCredits: { increment: 1 },
          lastCommentCredit: new Date(),
        },
      })
    )
  }

  // Notify project author (if comment is on a project and they're not the commenter)
  if (projectId) {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { authorId: true, title: true, slug: true },
    })
    if (project && project.authorId !== session.user.id) {
      const actorName = commenter?.name ?? commenter?.username ?? "Someone"
      tasks.push(
        notifyUser(
          project.authorId,
          "COMMENT",
          `${actorName} commented on your project "${project.title}"`,
          `/projects/${project.slug}`
        )
      )
    }
  }

  await Promise.all(tasks)

  return Response.json(comment, { status: 201 })
}
