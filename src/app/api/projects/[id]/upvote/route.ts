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
  return Response.json({ upvoted: true, count })
}
