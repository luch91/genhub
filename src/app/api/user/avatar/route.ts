import { NextRequest } from "next/server"
import { put, del } from "@vercel/blob"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

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
    return Response.json({ error: "File must be under 2 MB" }, { status: 422 })
  }

  try {
    // Read current avatar URL before overwriting so we can delete the old blob
    const current = await db.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    })

    // addRandomSuffix: true gives a unique URL on every upload so the browser
    // and CDN never serve a stale cached version of the previous avatar
    const blob = await put(`avatars/${session.user.id}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    await db.user.update({
      where: { id: session.user.id },
      data: { image: blob.url },
    })

    // Clean up the previous blob — skip OAuth provider images (GitHub, Google)
    if (current?.image?.includes("blob.vercel-storage.com")) {
      await del(current.image).catch(() => {})
    }

    return Response.json({ url: blob.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed"
    console.error("[avatar upload]", message)
    return Response.json({ error: message }, { status: 500 })
  }
}
