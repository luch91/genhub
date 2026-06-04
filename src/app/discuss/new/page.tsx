import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { NewDiscussionForm } from "@/components/discuss/new-discussion-form"

export const metadata: Metadata = { title: "New discussion" }

export default async function NewDiscussionPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-brand-navy">New discussion</h1>
        <p className="mt-2 text-brand-navy/55">
          Ask a question, share an idea, or start a conversation.
        </p>
      </div>
      <NewDiscussionForm />
    </div>
  )
}
