import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { discussionId } = await params
  const { pinned } = await req.json()

  if (typeof pinned !== "boolean") {
    return Response.json({ error: "pinned must be a boolean" }, { status: 400 })
  }

  await db.discussion.update({ where: { id: discussionId }, data: { pinned } })
  return new Response(null, { status: 204 })
}
