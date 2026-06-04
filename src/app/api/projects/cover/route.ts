import { NextRequest } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get("file")

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided" }, { status: 422 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "File must be JPEG, PNG, WebP, or GIF" }, { status: 422 })
  }

  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File must be under 5 MB" }, { status: 422 })
  }

  const blob = await put(`covers/${session.user.id}`, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return Response.json({ url: blob.url })
}
