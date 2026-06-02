import { db } from "./db"
import type { NotificationType } from "@prisma/client"

export async function notifyUser(
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  await db.notification.create({
    data: { userId, type, message, link: link ?? null },
  })
}

export async function notifyFollowers(
  ofUserId: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  const followers = await db.follow.findMany({
    where: { followingId: ofUserId },
    select: { followerId: true },
  })
  if (followers.length === 0) return

  await db.notification.createMany({
    data: followers.map((f) => ({
      userId: f.followerId,
      type,
      message,
      link: link ?? null,
    })),
  })
}
