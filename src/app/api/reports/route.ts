import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const VALID_TYPES = ["comment", "discussion", "update", "reply"]

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { type, contentId, reason } = await req.json()

  if (!VALID_TYPES.includes(type) || !contentId) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const existing = await db.report.findUnique({
    where: { reporterId_type_contentId: { reporterId: session.user.id, type, contentId } },
  })
  if (existing) return Response.json({ error: "Already reported" }, { status: 409 })

  const report = await db.report.create({
    data: { type, contentId, reason: reason || null, reporterId: session.user.id },
  })
  return Response.json(report, { status: 201 })
}
