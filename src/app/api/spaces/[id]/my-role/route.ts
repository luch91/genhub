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

  if (space.hostId === session.user.id) {
    return NextResponse.json({ role: "HOST" })
  }

  const participant = await db.spaceParticipant.findUnique({
    where: { spaceId_userId: { spaceId: id, userId: session.user.id } },
    select: { role: true },
  })

  return NextResponse.json({ role: participant?.role ?? "LISTENER" })
}
