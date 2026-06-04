import Link from "next/link"

type Props = {
  slug: string
  currentUserId?: string
  authorId: string
}

export function RemixButton({ slug, currentUserId, authorId }: Props) {
  if (!currentUserId || currentUserId === authorId) return null
  return (
    <Link
      href={`/projects/remix/${slug}`}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-amber/25 bg-brand-amber/8 px-4 py-2.5 font-ui text-sm font-medium text-brand-amber-dk transition-colors hover:bg-brand-amber/15"
    >
      ⟳ Remix This Project
    </Link>
  )
}
