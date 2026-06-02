import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { replySchema } from "@/lib/validations"

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const discussion = await db.discussion.findUnique({ where: { id } })
  if (!discussion) return Response.json({ error: "Discussion not found" }, { status: 404 })

  const body = await request.json()
  const result = replySchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const reply = await db.reply.create({
    data: {
      content: result.data.content,
      authorId: session.user.id,
      discussionId: id,
    },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
    },
  })

  await db.discussion.update({
    where: { id },
    data: { updatedAt: new Date() },
  })

  return Response.json(reply, { status: 201 })
}
