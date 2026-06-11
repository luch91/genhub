import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ projectId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { projectId } = await params
  const body = await req.json() as { featured?: boolean }

  if (typeof body.featured !== "boolean") {
    return Response.json({ error: "featured (boolean) is required" }, { status: 400 })
  }

  const project = await db.project.update({
    where: { id: projectId },
    data: { featured: body.featured },
  })
  return Response.json({ id: project.id, featured: project.featured })
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const { projectId } = await params
  await db.project.delete({ where: { id: projectId } })
  return new Response(null, { status: 204 })
}
