import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const comment = await db.comment.findUnique({ where: { id } })
  if (!comment) return Response.json({ error: "Not found" }, { status: 404 })
  if (comment.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.comment.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
