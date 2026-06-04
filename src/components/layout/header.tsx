import Link from "next/link"
import Image from "next/image"
import { auth, signOut } from "@/lib/auth"
import { canReview } from "@/lib/review"
import { db } from "@/lib/db"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { MosaicLogo } from "@/components/brand/logo"

export async function Header() {
  const session = await auth()
  const [eligible, unreadCount] = await Promise.all([
    session?.user ? canReview(session.user.id) : Promise.resolve(false),
    session?.user
      ? db.notification.count({ where: { userId: session.user.id, read: false } })
      : Promise.resolve(0),
  ])

  return (
    <header className="sticky top-0 z-50 border-b border-brand-indigo/10 bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <MosaicLogo size="sm" />
          <span className="font-ui text-sm font-bold text-brand-navy hidden sm:inline">GenHub</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link href="/projects" className="btn-ghost py-1.5 text-sm">Projects</Link>
          <Link href="/builders" className="btn-ghost py-1.5 text-sm">Builders</Link>
          <Link href="/feed"     className="btn-ghost py-1.5 text-sm">Feed</Link>
          <Link href="/discuss"  className="btn-ghost py-1.5 text-sm">Discuss</Link>
          {eligible && (
            <Link href="/review" className="btn-ghost py-1.5 text-sm font-medium text-brand-amber-dk hover:text-brand-amber-dk">
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
              <NotificationBell initialCount={unreadCount} />
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
            className="rounded-full ring-2 ring-brand-indigo/20"
          />
        </Link>
      ) : (
        <div className="h-7 w-7 rounded-full bg-brand-indigo/15" />
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
