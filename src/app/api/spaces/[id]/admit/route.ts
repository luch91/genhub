import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { RoomServiceClient } from "livekit-server-sdk"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const body = await req.json()
  const { userId } = body as { userId?: unknown }

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const space = await db.space.findUnique({ where: { id } })

  if (!space) {
    return NextResponse.json({ error: "Space not found" }, { status: 404 })
  }
  if (space.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Verify the user is actually a participant in this space before admitting
  const participant = await db.spaceParticipant.findUnique({
    where: { spaceId_userId: { spaceId: id, userId } },
  })
  if (!participant) {
    return NextResponse.json({ error: "Participant not found in this space" }, { status: 404 })
  }

  await db.spaceParticipant.update({
    where: { spaceId_userId: { spaceId: id, userId } },
    data: { role: "SPEAKER", handRaised: false },
  })

  if (process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    const livekit = new RoomServiceClient(
      process.env.NEXT_PUBLIC_LIVEKIT_URL.replace("wss://", "https://"),
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    )
    await livekit.updateParticipant(space.roomName, userId, {
      permission: { canPublish: true, canSubscribe: true },
    })
  }

  return NextResponse.json({ success: true })
}
