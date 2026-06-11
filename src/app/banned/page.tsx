import type { Metadata } from "next"
import { signOut } from "@/lib/auth"

export const metadata: Metadata = { title: "Account Suspended" }

export default function BannedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-red-400 mb-3">
        Account Suspended
      </p>
      <h1 className="font-display text-3xl font-black text-brand-navy mb-4">
        Your account has been suspended
      </h1>
      <p className="max-w-md text-brand-navy/55 text-sm leading-relaxed mb-8">
        Your GenHub account has been suspended for violating our community guidelines.
        If you believe this is a mistake, please reach out to the GenHub team.
      </p>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button type="submit" className="btn-primary py-2 px-6">
          Sign out
        </button>
      </form>
    </div>
  )
}
