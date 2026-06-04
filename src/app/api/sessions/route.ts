import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createBuilderSessionSchema } from "@/lib/validations"
import { extractYouTubeId } from "@/lib/utils"

export async function GET() {
  const sessions = await db.builderSession.findMany({
    orderBy: [{ status: "asc" }, { scheduledAt: "asc" }],
    include: {
      host:    { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, title: true, slug: true } },
      tags:    true,
    },
  })
  return NextResponse.json(sessions)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = createBuilderSessionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { youtubeUrl, tags, ...data } = parsed.data
  const youtubeVideoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null

  const newSession = await db.builderSession.create({
    data: {
      ...data,
      youtubeUrl:     youtubeUrl || null,
      youtubeVideoId,
      hostId: session.user.id,
      status: "SCHEDULED",
      tags: tags?.length ? { connect: tags.map((id) => ({ id })) } : undefined,
    },
    include: {
      host: { select: { id: true, name: true, username: true, image: true } },
    },
  })

  return NextResponse.json(newSession, { status: 201 })
}
