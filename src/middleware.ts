import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  if (
    session?.user &&
    !session.user.username &&
    pathname !== "/onboarding"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }
})

export const config = {
  matcher: [
    "/projects/:path*",
    "/builders/:path*",
    "/feed/:path*",
    "/discuss/:path*",
    "/review/:path*",
    "/notifications",
    "/onboarding",
  ],
}
