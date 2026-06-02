import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const notification = await db.notification.findUnique({ where: { id } })
  if (!notification) return Response.json({ error: "Not found" }, { status: 404 })
  if (notification.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.notification.update({ where: { id }, data: { read: true } })
  return Response.json({ ok: true })
}
