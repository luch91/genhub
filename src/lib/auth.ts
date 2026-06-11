import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { db } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub, Google],
  callbacks: {
    session({ session, user }) {
      const u = user as unknown as { username: string | null; isAdmin: boolean; isBanned: boolean }
      session.user.id      = user.id
      session.user.username = u.username ?? null
      session.user.isAdmin  = u.isAdmin  ?? false
      session.user.isBanned = u.isBanned ?? false
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
