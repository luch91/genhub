import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projectSubmitSchema } from "@/lib/validations"
import { slugify, generateSlugSuffix } from "@/lib/utils"
import { notifyFollowers } from "@/lib/notifications"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get("tag")
  const sort = searchParams.get("sort")
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = 20

  const orderBy =
    sort === "upvoted"
      ? { upvotes: { _count: "desc" as const } }
      : sort === "active"
      ? { updates: { _count: "desc" as const } }
      : { createdAt: "desc" as const }

  const where = {
    status: "PUBLISHED" as const,
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
  }

  const [items, total] = await Promise.all([
    db.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
        _count: { select: { upvotes: true, comments: true, updates: true } },
      },
    }),
    db.project.count({ where }),
  ])

  return Response.json({
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const result = projectSubmitSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const author = await db.user.findUnique({
    where: { id: session.user.id },
    select: { submissionCredits: true },
  })
  if (!author || author.submissionCredits < 1) {
    return Response.json(
      { error: "You have no submission credits. Earn them back by contributing to the community." },
      { status: 403 }
    )
  }

  const { tags, contractAddress, repoUrl, demoUrl, ...rest } = result.data
  const remixedFromId = (body.remixedFromId as string | undefined) ?? null

  const baseSlug = slugify(rest.title)
  let slug = baseSlug
  const existing = await db.project.findUnique({ where: { slug } })
  if (existing) slug = `${baseSlug}-${generateSlugSuffix()}`

  const project = await db.project.create({
    data: {
      ...rest,
      slug,
      contractAddress: contractAddress || null,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
      remixedFromId,
      status: "PENDING_REVIEW",
      authorId: session.user.id,
      tags: {
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

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, username: true },
  })
  const actorName = me?.name ?? me?.username ?? "A builder"

  await Promise.all([
    db.user.update({
      where: { id: session.user.id },
      data: { submissionCredits: { decrement: 1 } },
    }),
    notifyFollowers(
      session.user.id,
      "NEW_PROJECT",
      `${actorName} submitted a new project: "${project.title}"`,
      `/projects/${project.slug}`
    ),
  ])

  return Response.json(project, { status: 201 })
}
