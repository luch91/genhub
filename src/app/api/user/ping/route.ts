import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const THROTTLE_MS = 60_000 // only write to DB at most once per minute

export async function POST() {
  const session = await auth()
  if (!session?.user) return Response.json({ ok: false }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { lastSeenAt: true },
  })

  const stale =
    !user?.lastSeenAt ||
    Date.now() - user.lastSeenAt.getTime() > THROTTLE_MS

  if (stale) {
    await db.user.update({
      where: { id: session.user.id },
      data: { lastSeenAt: new Date() },
    })
  }

  return Response.json({ ok: true })
}
