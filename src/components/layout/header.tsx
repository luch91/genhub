import Link from "next/link"
import Image from "next/image"
import { auth, signOut } from "@/lib/auth"
import { canReview } from "@/lib/review"

export async function Header() {
  const session = await auth()
  const eligible = session?.user ? await canReview(session.user.id) : false

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold">
            GL
          </span>
          <span className="hidden sm:inline">Builders Hub</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link href="/projects" className="btn-ghost py-1.5 text-sm">
            Projects
          </Link>
          <Link href="/builders" className="btn-ghost py-1.5 text-sm">
            Builders
          </Link>
          <Link href="/feed" className="btn-ghost py-1.5 text-sm">
            Feed
          </Link>
          <Link href="/discuss" className="btn-ghost py-1.5 text-sm">
            Discuss
          </Link>
          {eligible && (
            <Link href="/review" className="btn-ghost py-1.5 text-sm text-amber-400 hover:text-amber-300">
              Review
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/projects/submit" className="btn-primary hidden py-1.5 text-sm sm:inline-flex">
                Submit
              </Link>
              <UserMenu user={session.user} />
            </>
          ) : (
            <Link href="/login" className="btn-primary py-1.5 text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function UserMenu({
  user,
}: {
  user: { name?: string | null; image?: string | null; username?: string | null }
}) {
  return (
    <div className="flex items-center gap-2">
      {user.image ? (
        <Link href={user.username ? `/builders/${user.username}` : "#"}>
          <Image
            src={user.image}
            alt={user.name ?? ""}
            width={28}
            height={28}
            className="rounded-full"
          />
        </Link>
      ) : (
        <div className="h-7 w-7 rounded-full bg-slate-700" />
      )}
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button type="submit" className="btn-ghost py-1 text-xs">
          Sign out
        </button>
      </form>
    </div>
  )
}
