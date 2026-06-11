import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ reportId: string }> }

export async function PATCH(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user?.isAdmin) return Response.json({ error: "Forbidden" }, { status: 403 })

  const { reportId } = await params
  await db.report.update({ where: { id: reportId }, data: { resolved: true } })
  return new Response(null, { status: 204 })
}
