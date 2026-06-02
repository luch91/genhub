import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  const discussion = await db.discussion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
        },
      },
      _count: { select: { replies: true } },
    },
  })

  if (!discussion) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(discussion)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const discussion = await db.discussion.findUnique({ where: { id } })
  if (!discussion) return Response.json({ error: "Not found" }, { status: 404 })
  if (discussion.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.discussion.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
