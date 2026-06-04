import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { builderProfileSchema } from "@/lib/validations"

export async function PATCH(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const result = builderProfileSchema.partial().safeParse(body)
  if (!result.success) {
    return Response.json({ error: result.error.flatten().fieldErrors }, { status: 422 })
  }

  if (result.data.username) {
    const taken = await db.user.findUnique({
      where: { username: result.data.username },
      select: { id: true },
    })
    if (taken && taken.id !== session.user.id) {
      return Response.json({ error: "Username is already taken" }, { status: 409 })
    }
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(result.data.name !== undefined && { name: result.data.name || null }),
      ...(result.data.username !== undefined && { username: result.data.username }),
      ...(result.data.bio !== undefined && { bio: result.data.bio || null }),
      ...(result.data.twitterHandle !== undefined && { twitterHandle: result.data.twitterHandle || null }),
      ...(result.data.githubHandle !== undefined && { githubHandle: result.data.githubHandle || null }),
      ...(result.data.website !== undefined && { website: result.data.website || null }),
      ...(result.data.walletAddress !== undefined && { walletAddress: result.data.walletAddress || null }),
    },
  })

  return Response.json(user)
}
