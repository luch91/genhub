import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")
  const id   = searchParams.get("id")

  if (!type || !id) {
    return Response.json({ error: "type and id are required" }, { status: 400 })
  }

  if (type === "comment") {
    await db.comment.delete({ where: { id } })
  } else if (type === "discussion") {
    await db.discussion.delete({ where: { id } })
  } else if (type === "update") {
    await db.projectUpdate.delete({ where: { id } })
  } else {
    return Response.json({ error: "Invalid type" }, { status: 400 })
  }

  return new Response(null, { status: 204 })
}
