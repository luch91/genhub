import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const project = await db.project.findUnique({
    where: { id },
    select: { authorId: true, status: true },
  })

  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.authorId !== session.user.id) return Response.json({ error: "Forbidden" }, { status: 403 })
  if (project.status !== "EXPIRED") return Response.json({ error: "Project is not expired" }, { status: 409 })

  const updated = await db.project.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  })

  return Response.json(updated)
}
