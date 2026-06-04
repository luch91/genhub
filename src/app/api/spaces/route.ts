import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createSpaceSchema } from "@/lib/validations"
import { generateRoomName } from "@/lib/utils"
import { RoomServiceClient } from "livekit-server-sdk"

function getLivekitClient() {
  return new RoomServiceClient(
    process.env.NEXT_PUBLIC_LIVEKIT_URL!.replace("wss://", "https://"),
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  )
}

export async function GET() {
  const spaces = await db.space.findMany({
    orderBy: [{ status: "asc" }, { scheduledAt: "asc" }],
    include: {
      host:         { select: { id: true, name: true, username: true, image: true } },
      project:      { select: { id: true, title: true, slug: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
        },
      },
      tags: true,
    },
  })
  return NextResponse.json(spaces)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = createSpaceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const roomName = generateRoomName(parsed.data.title)

  // Only create Livekit room if credentials are configured
  if (process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET && process.env.NEXT_PUBLIC_LIVEKIT_URL) {
    const livekit = getLivekitClient()
    await livekit.createRoom({ name: roomName, emptyTimeout: 300 })
  }

  const { tags, ...data } = parsed.data

  const space = await db.space.create({
    data: {
      ...data,
      roomName,
      hostId: session.user.id,
      status: "SCHEDULED",
      tags: tags?.length ? { connect: tags.map((id) => ({ id })) } : undefined,
      participants: {
        create: { userId: session.user.id, role: "HOST" },
      },
    },
    include: {
      host: { select: { id: true, name: true, username: true, image: true } },
    },
  })

  return NextResponse.json(space, { status: 201 })
}
