import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { notifyUser } from "@/lib/notifications"

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  const candidates = await db.project.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null, lte: cutoff },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      authorId: true,
      _count: { select: { upvotes: true } },
    },
  })

  const toExpire = candidates.filter((p) => p._count.upvotes < 5)

  await Promise.all(
    toExpire.map(async (project) => {
      await db.project.update({
        where: { id: project.id },
        data: { status: "EXPIRED" },
      })
      await notifyUser(
        project.authorId,
        "PROJECT_EXPIRED",
        `Your project "${project.title}" was removed from the gallery — it didn't reach 5 upvotes within 2 weeks. Visit your project page to resubmit.`,
        `/projects/${project.slug}`
      )
    })
  )

  return Response.json({ expired: toExpire.length, ids: toExpire.map((p) => p.id) })
}
