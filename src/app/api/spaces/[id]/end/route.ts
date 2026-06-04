import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { RoomServiceClient } from "livekit-server-sdk"
import { endSpaceSchema } from "@/lib/validations"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id }   = await params
  const body     = await req.json()
  const parsed   = endSpaceSchema.safeParse(body)
  const space    = await db.space.findUnique({ where: { id } })

  if (!space) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (space.hostId !== session.user.id) {
    return NextResponse.json({ error: "Only the host can end a space" }, { status: 403 })
  }

  if (process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    const livekit = new RoomServiceClient(
      process.env.NEXT_PUBLIC_LIVEKIT_URL.replace("wss://", "https://"),
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    )
    try {
      await livekit.deleteRoom(space.roomName)
    } catch {
      // Room may already be empty or expired — safe to continue
    }
  }

  const updated = await db.space.update({
    where: { id },
    data: {
      status:    "ENDED",
      endedAt:   new Date(),
      replayUrl: parsed.success ? parsed.data.replayUrl || null : null,
    },
  })

  return NextResponse.json(updated)
}
