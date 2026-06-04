import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projectSubmitSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"

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
  const project = await db.project.findUnique({ where: { id }, select: { authorId: true } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.authorId !== session.user.id) return Response.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json()
  const result = projectSubmitSchema.safeParse(body)
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 422 })

  const { tags, contractAddress, repoUrl, demoUrl, ...rest } = result.data
  const coverImageUpdate = "coverImage" in body
    ? { coverImage: (body.coverImage as string | null) ?? null }
    : {}

  const updated = await db.project.update({
    where: { id },
    data: {
      ...rest,
      contractAddress: contractAddress || null,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
      ...coverImageUpdate,
      tags: {
        deleteMany: {},
        create: await Promise.all(
          tags.map(async (tagName) => {
            const tagSlug = slugify(tagName)
            const tag = await db.tag.upsert({
              where: { slug: tagSlug },
              create: { name: tagName, slug: tagSlug },
              update: {},
            })
            return { tagId: tag.id }
          })
        ),
      },
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
