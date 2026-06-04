import { db } from "./db"
import { sendEmail } from "./email"
import type { NotificationType } from "@prisma/client"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

const EMAIL_TYPES = new Set<NotificationType>([
  "COMMENT",
  "PROJECT_PUBLISHED",
  "PROJECT_REJECTED",
  "PROJECT_EXPIRED",
  "FOLLOW",
  "DISCUSSION_REPLY",
])

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function notifyUser(
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) {
  await db.notification.create({
    data: { userId, type, message, link: link ?? null },
  })

  if (EMAIL_TYPES.has(type)) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })
    if (user?.email) {
      const href = link ? `${APP_URL}${link}` : APP_URL
      const safeMessage = escapeHtml(message)
      await sendEmail({
        to: user.email,
        subject: `GenHub: ${message}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
            <div style="margin-bottom:24px">
              <span style="font-size:20px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px">GenHub</span>
            </div>
            <p style="color:#1a1a2e;font-size:15px;line-height:1.6;margin:0 0 20px">${safeMessage}</p>
            ${link ? `<a href="${href}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:99px;font-size:14px;font-weight:600">View on GenHub →</a>` : ""}
            <p style="color:#1a1a2e;opacity:0.4;font-size:12px;margin-top:32px">
              You're receiving this because you have an account on GenHub.
            </p>
          </div>
        `,
      })
    }
  }
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

  // Send emails for follower notifications (fire-and-forget, non-blocking)
  if (EMAIL_TYPES.has(type)) {
    const followerIds = followers.map((f) => f.followerId)
    db.user
      .findMany({ where: { id: { in: followerIds } }, select: { email: true, name: true } })
      .then(async (users) => {
        const href = link ? `${APP_URL}${link}` : APP_URL
        const safeMessage = escapeHtml(message)
        for (const user of users) {
          if (!user.email) continue
          await sendEmail({
            to: user.email,
            subject: `GenHub: ${message}`,
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
                <div style="margin-bottom:24px">
                  <span style="font-size:20px;font-weight:900;color:#1a1a2e;letter-spacing:-0.5px">GenHub</span>
                </div>
                <p style="color:#1a1a2e;font-size:15px;line-height:1.6;margin:0 0 20px">${safeMessage}</p>
                ${link ? `<a href="${href}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:99px;font-size:14px;font-weight:600">View on GenHub →</a>` : ""}
                <p style="color:#1a1a2e;opacity:0.4;font-size:12px;margin-top:32px">
                  You're receiving this because you follow this builder on GenHub.
                </p>
              </div>
            `,
          })
        }
      })
      .catch(() => {})
  }
}
