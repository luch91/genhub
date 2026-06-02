import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SubmitForm } from "@/components/projects/submit-form"

export const metadata: Metadata = { title: "Submit a project" }

export default async function SubmitProjectPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Submit a project</h1>
        <p className="mt-2 text-slate-400">
          Share what you&apos;ve built on GenLayer with the community.
        </p>
      </div>
      <SubmitForm />
    </div>
  )
}
