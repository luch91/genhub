import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projectSubmitSchema } from "@/lib/validations"

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params
  const project = await db.project.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: true } },
      _count: { select: { upvotes: true, comments: true, updates: true } },
    },
  })

  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json(project)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const result = projectSubmitSchema.partial().safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const { tags, contractAddress, repoUrl, demoUrl, ...rest } = result.data

  const updated = await db.project.update({
    where: { id },
    data: {
      ...rest,
      contractAddress: contractAddress !== undefined ? contractAddress || null : undefined,
      repoUrl: repoUrl !== undefined ? repoUrl || null : undefined,
      demoUrl: demoUrl !== undefined ? demoUrl || null : undefined,
    },
  })

  return Response.json(updated)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  await db.project.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
