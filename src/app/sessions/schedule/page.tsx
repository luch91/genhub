import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ScheduleSessionForm } from "@/components/sessions/schedule-form"

export default async function ScheduleSessionPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="text-[11px] font-mono tracking-widest text-brand-indigo uppercase mb-1">
          Builder Sessions
        </p>
        <h1 className="font-display text-3xl font-black text-brand-navy">Schedule a Session</h1>
        <p className="mt-2 text-brand-navy/55">
          Share a live or upcoming YouTube session with the GenLayer builder community.
        </p>
      </div>
      <ScheduleSessionForm />
    </div>
  )
}
