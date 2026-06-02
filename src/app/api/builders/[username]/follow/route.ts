import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifyUser } from "@/lib/notifications"

type Params = { params: Promise<{ username: string }> }

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { username } = await params
  const target = await db.user.findUnique({
    where: { username },
    select: { id: true, name: true, username: true },
  })
  if (!target) return Response.json({ error: "Builder not found" }, { status: 404 })
  if (target.id === session.user.id) {
    return Response.json({ error: "You cannot follow yourself" }, { status: 400 })
  }

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: { followerId: session.user.id, followingId: target.id },
    },
  })

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } })
    const count = await db.follow.count({ where: { followingId: target.id } })
    return Response.json({ following: false, count })
  }

  await db.follow.create({
    data: { followerId: session.user.id, followingId: target.id },
  })

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true },
  })
  const actorName = me?.name ?? me?.username ?? "Someone"
  await notifyUser(
    target.id,
    "FOLLOW",
    `${actorName} started following you`,
    me?.username ? `/builders/${me.username}` : undefined
  )

  const count = await db.follow.count({ where: { followingId: target.id } })
  return Response.json({ following: true, count })
}
