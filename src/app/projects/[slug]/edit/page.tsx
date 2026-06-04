import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { EditForm } from "@/components/projects/edit-form"

export const metadata: Metadata = { title: "Edit project" }

type PageProps = { params: Promise<{ slug: string }> }

export default async function EditProjectPage({ params }: PageProps) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const project = await db.project.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } } },
  })

  if (!project) notFound()
  if (project.authorId !== session.user.id) notFound()

  const defaults = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    tagline: project.tagline,
    description: project.description,
    genlayerAngle: project.genlayerAngle,
    contractAddress: project.contractAddress,
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    coverImage: project.coverImage,
    tags: project.tags.map((pt) => pt.tag.name),
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-black text-brand-navy">Edit project</h1>
        <p className="mt-2 text-brand-navy/55">{project.title}</p>
      </div>
      <EditForm defaults={defaults} />
    </div>
  )
}
