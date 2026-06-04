import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { extractYouTubeId } from "@/lib/utils"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id }   = await params
  const body     = await req.json()
  const existing = await db.builderSession.findUnique({ where: { id } })

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const youtubeVideoId = body.youtubeUrl
    ? extractYouTubeId(body.youtubeUrl)
    : existing.youtubeVideoId

  const updated = await db.builderSession.update({
    where: { id },
    data: { ...body, youtubeVideoId },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id }   = await params
  const existing = await db.builderSession.findUnique({ where: { id } })

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.builderSession.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
