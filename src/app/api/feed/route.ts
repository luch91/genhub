import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projectUpdateSchema } from "@/lib/validations"

const VALID_TYPES = ["GENERAL", "MILESTONE", "BLOCKER", "BREAKTHROUGH"] as const

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const projectId = searchParams.get("projectId")
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = 20

  const where = {
    ...(type && VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])
      ? { type: type as (typeof VALID_TYPES)[number] }
      : {}),
    ...(projectId ? { projectId } : {}),
  }

  const [items, total] = await Promise.all([
    db.projectUpdate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        project: { select: { id: true, slug: true, title: true } },
        _count: { select: { comments: true } },
      },
    }),
    db.projectUpdate.count({ where }),
  ])

  return Response.json({ items, total, page, pageSize, hasMore: page * pageSize < total })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const result = projectUpdateSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const { projectId } = body as { projectId?: string }
  if (!projectId) return Response.json({ error: "projectId is required" }, { status: 422 })

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: "Project not found" }, { status: 404 })
  if (project.authorId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const update = await db.projectUpdate.create({
    data: {
      ...result.data,
      projectId,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      project: { select: { id: true, slug: true, title: true } },
      _count: { select: { comments: true } },
    },
  })

  return Response.json(update, { status: 201 })
}
