import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })

  const existing = await db.downvote.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId: id } },
  })

  if (existing) {
    await db.downvote.delete({ where: { id: existing.id } })
    const count = await db.downvote.count({ where: { projectId: id } })
    return Response.json({ downvoted: false, count })
  }

  // Remove any existing upvote when downvoting
  await db.upvote.deleteMany({
    where: { userId: session.user.id, projectId: id },
  })

  await db.downvote.create({ data: { userId: session.user.id, projectId: id } })
  const count = await db.downvote.count({ where: { projectId: id } })

  return Response.json({ downvoted: true, count })
}
