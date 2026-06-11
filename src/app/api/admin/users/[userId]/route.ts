import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ userId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId } = await params
  const body = await req.json() as {
    isBanned?: boolean
    submissionCredits?: number
  }

  const data: Record<string, unknown> = {}
  if (typeof body.isBanned          === "boolean") data.isBanned          = body.isBanned
  if (typeof body.submissionCredits === "number")  data.submissionCredits = body.submissionCredits

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 })
  }

  const user = await db.user.update({ where: { id: userId }, data })
  return Response.json({ id: user.id, isBanned: user.isBanned, submissionCredits: user.submissionCredits })
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId } = await params
  await db.user.delete({ where: { id: userId } })
  return new Response(null, { status: 204 })
}
