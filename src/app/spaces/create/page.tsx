import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateSpaceForm } from "@/components/spaces/create-form"

export default async function CreateSpacePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] font-mono tracking-widest text-brand-indigo uppercase mb-1">
          Live Audio
        </p>
        <h1 className="font-display text-3xl font-black text-brand-navy">Start a Space</h1>
        <p className="mt-2 text-brand-navy/55">
          Host a live audio room for the GenLayer builder community.
        </p>
      </div>
      <CreateSpaceForm />
    </div>
  )
}
