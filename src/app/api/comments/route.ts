import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { commentSchema } from "@/lib/validations"

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

  return Response.json(comment, { status: 201 })
}
