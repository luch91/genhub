import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createBuilderSessionSchema } from "@/lib/validations"
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
  const existing = await db.builderSession.findUnique({ where: { id } })

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body   = await req.json()
  const parsed = createBuilderSessionSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Destructure tags (not a direct DB field) and youtubeUrl (needs ID extraction)
  const { tags: _tags, youtubeUrl, ...safeData } = parsed.data

  const youtubeVideoId =
    youtubeUrl !== undefined
      ? extractYouTubeId(youtubeUrl ?? "")
      : existing.youtubeVideoId

  const updated = await db.builderSession.update({
    where: { id },
    data: {
      ...safeData,
      ...(youtubeUrl !== undefined && { youtubeUrl: youtubeUrl || null }),
      youtubeVideoId,
    },
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
