import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const participant = await db.spaceParticipant.findUnique({
    where: { spaceId_userId: { spaceId: id, userId: session.user.id } },
  })
  if (!participant) {
    return NextResponse.json({ error: "Not in this space" }, { status: 403 })
  }

  const updated = await db.spaceParticipant.update({
    where: { spaceId_userId: { spaceId: id, userId: session.user.id } },
    data: { handRaised: !participant.handRaised },
  })

  return NextResponse.json(updated)
}
