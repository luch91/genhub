import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { MosaicLogo } from "@/components/brand/logo"
import { OnboardingForm } from "./onboarding-form"

export const metadata: Metadata = { title: "Complete your profile" }

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.username) redirect("/projects")

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <MosaicLogo size="lg" />
          </div>
          <h1 className="font-display text-2xl font-black text-brand-navy">
            Choose your username
          </h1>
          <p className="mt-2 text-sm text-brand-navy/50">
            This is how other builders will find you on GenHub.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  )
}
