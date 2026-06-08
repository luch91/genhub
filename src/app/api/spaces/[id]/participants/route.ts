import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const space = await db.space.findUnique({
    where: { id },
    select: { hostId: true },
  })
  if (!space) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (space.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const participants = await db.spaceParticipant.findMany({
    where: { spaceId: id },
    include: {
      user: { select: { id: true, name: true, username: true } },
    },
  })

  return NextResponse.json(
    participants.map((p) => ({
      userId:    p.userId,
      name:      p.user.name,
      username:  p.user.username,
      role:      p.role,
      handRaised: p.handRaised,
    }))
  )
}
