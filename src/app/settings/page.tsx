import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProfileForm } from "./profile-form"

export const metadata: Metadata = { title: "Edit profile" }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (!session.user.username) redirect("/onboarding")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      bio: true,
      twitterHandle: true,
      githubHandle: true,
      website: true,
      walletAddress: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-black text-brand-navy">Edit profile</h1>
        <p className="mt-2 text-sm text-brand-navy/50">
          Update your public builder profile.
        </p>
      </div>
      <ProfileForm defaultValues={user} />
    </div>
  )
}
