import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { discussionSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const pageSize = 20

  const VALID_CATEGORIES = ["GENERAL", "HELP", "IDEAS", "SHOWCASE"] as const
  type Category = (typeof VALID_CATEGORIES)[number]

  const where = category && VALID_CATEGORIES.includes(category as Category)
    ? { category: category as Category }
    : {}

  const [items, total] = await Promise.all([
    db.discussion.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        _count: { select: { replies: true } },
      },
    }),
    db.discussion.count({ where }),
  ])

  return Response.json({ items, total, page, pageSize, hasMore: page * pageSize < total })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const result = discussionSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 422 })
  }

  const discussion = await db.discussion.create({
    data: { ...result.data, authorId: session.user.id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { replies: true } },
    },
  })

  return Response.json(discussion, { status: 201 })
}
