import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AccessToken } from "livekit-server-sdk"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const space = await db.space.findUnique({
    where: { id },
    include: { participants: true },
  })
  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 })
  }
  if (space.status === "ENDED") {
    return NextResponse.json({ error: "Space has ended" }, { status: 410 })
  }

  const isHost              = space.hostId === session.user.id
  const existingParticipant = space.participants.find((p) => p.userId === session.user.id)
  const role                = isHost
    ? "HOST"
    : existingParticipant?.role === "SPEAKER"
    ? "SPEAKER"
    : "LISTENER"

  if (!existingParticipant) {
    await db.spaceParticipant.create({
      data: { spaceId: id, userId: session.user.id, role },
    })
  }

  if (space.status === "SCHEDULED" && isHost) {
    await db.space.update({
      where: { id },
      data: { status: "LIVE", startedAt: new Date() },
    })
  }

  // TTL set to 6 hours — default Livekit token expires in 6 minutes which would
  // silently disconnect hosts mid-session on longer calls.
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: session.user.id,
      name:     session.user.name ?? session.user.email ?? "Builder",
      ttl:      "6h",
    }
  )

  at.addGrant({
    roomJoin:     true,
    room:         space.roomName,
    canPublish:   isHost || role === "SPEAKER",
    canSubscribe: true,
  })

  return NextResponse.json({
    token:    await at.toJwt(),
    roomName: space.roomName,
    role,
  })
}
