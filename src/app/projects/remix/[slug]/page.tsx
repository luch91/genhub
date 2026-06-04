import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { RemixForm } from "./remix-form"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await db.project.findUnique({ where: { slug }, select: { title: true } })
  if (!project) return {}
  return { title: `Remix: ${project.title}` }
}

export default async function RemixProjectPage({ params }: PageProps) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const source = await db.project.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      tagline: true,
      description: true,
      genlayerAngle: true,
      tags: { include: { tag: { select: { name: true } } } },
    },
  })
  if (!source) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <Link
          href={`/projects/${slug}`}
          className="mb-4 inline-flex text-sm text-brand-navy/45 hover:text-brand-navy transition-colors"
        >
          ← Back to original
        </Link>
        <div className="mt-4 rounded-xl border border-brand-amber/25 bg-brand-amber/8 px-4 py-3">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-amber-dk">
            Remixing
          </p>
          <p className="mt-0.5 font-ui text-sm font-semibold text-brand-navy">
            {source.title}
          </p>
        </div>
        <h1 className="mt-6 font-display text-3xl font-black text-brand-navy">Submit a remix</h1>
        <p className="mt-2 text-brand-navy/55">
          Build on top of this project. Describe what you&apos;re changing or extending.
        </p>
      </div>

      <RemixForm
        remixedFromId={source.id}
        defaultTitle={`Remix of ${source.title}`}
        defaultTags={source.tags.map((t) => t.tag.name)}
      />
    </div>
  )
}
