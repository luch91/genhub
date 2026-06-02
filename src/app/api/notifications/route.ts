import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = 20

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.notification.count({ where: { userId: session.user.id, read: false } }),
  ])

  return Response.json({ notifications, unreadCount })
}

// Mark all as read
export async function POST(_: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  })

  return Response.json({ ok: true })
}
