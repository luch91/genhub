import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { db } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [GitHub, Google],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.username = (user as unknown as { username: string | null }).username ?? null
      }
      // Allow client-side update() calls to refresh username in the token
      if (trigger === "update" && session?.username !== undefined) {
        token.username = session.username
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.username = (token.username as string | null) ?? null
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
