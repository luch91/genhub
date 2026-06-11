import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export const middleware = auth((req) => {
  const { nextUrl, auth: session } = req as NextRequest & { auth: { user?: { isBanned?: boolean } } | null }

  // Let the banned page and auth routes through to avoid redirect loops
  if (
    nextUrl.pathname.startsWith("/banned") ||
    nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  if (session?.user?.isBanned) {
    return NextResponse.redirect(new URL("/banned", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
