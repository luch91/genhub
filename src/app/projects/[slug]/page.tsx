import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate, UPDATE_TYPE_LABELS, UPDATE_TYPE_COLORS } from "@/lib/utils"

type PageProps = { params: Promise<{ slug: string }> }

async function getProject(slug: string) {
  return db.project.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      updates: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { comments: true } },
        },
      },
      _count: { select: { upvotes: true, comments: true, updates: true } },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.tagline,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {project.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/projects?tag=${tag.slug}`}
                  className="badge border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <p className="mt-2 text-lg text-slate-400">{project.tagline}</p>
          </div>

          {/* Cover image */}
          {project.coverImage && (
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <Image
                src={project.coverImage}
                alt={project.title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              About
            </h2>
            <p className="whitespace-pre-wrap text-slate-300">{project.description}</p>
          </div>

          {/* GenLayer angle — the key differentiator */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-400">
              Why only GenLayer?
            </h2>
            <p className="whitespace-pre-wrap text-slate-300">{project.genlayerAngle}</p>
          </div>

          {/* Build-in-public updates */}
          {project.updates.length > 0 && (
            <div>
              <h2 className="section-heading mb-4">Build log</h2>
              <div className="space-y-3">
                {project.updates.map((update) => (
                  <div key={update.id} className="card">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`badge ${UPDATE_TYPE_COLORS[update.type]}`}
                      >
                        {UPDATE_TYPE_LABELS[update.type]}
                      </span>
                      <span className="text-xs text-slate-600">
                        {formatDate(update.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-300">
                      {update.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Stats */}
          <div className="card">
            <div className="grid grid-cols-3 gap-4 text-center">
              <SidebarStat value={project._count.upvotes} label="Upvotes" />
              <SidebarStat value={project._count.updates} label="Updates" />
              <SidebarStat value={project._count.comments} label="Comments" />
            </div>
          </div>

          {/* Author */}
          <div className="card">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Builder
            </h3>
            <Link
              href={`/builders/${project.author.username ?? project.author.id}`}
              className="flex items-center gap-3 hover:opacity-80"
            >
              {project.author.image ? (
                <Image
                  src={project.author.image}
                  alt={project.author.name ?? ""}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-slate-700" />
              )}
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {project.author.name}
                </div>
                {project.author.username && (
                  <div className="text-xs text-slate-500">@{project.author.username}</div>
                )}
              </div>
            </Link>
          </div>

          {/* Links */}
          {(project.contractAddress || project.repoUrl || project.demoUrl) && (
            <div className="card space-y-2">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Links
              </h3>
              {project.contractAddress && (
                <LinkRow
                  label={project.verified ? "Contract (verified)" : "Contract"}
                  href={`https://explorer.genlayer.com/address/${project.contractAddress}`}
                  value={`${project.contractAddress.slice(0, 6)}…${project.contractAddress.slice(-4)}`}
                  verified={project.verified}
                />
              )}
              {project.repoUrl && (
                <LinkRow label="Repository" href={project.repoUrl} value="View source" />
              )}
              {project.demoUrl && (
                <LinkRow label="Demo" href={project.demoUrl} value="Try it" />
              )}
            </div>
          )}

          {/* Submitted */}
          <p className="text-center text-xs text-slate-700">
            Submitted {formatDate(project.createdAt)}
          </p>
        </aside>
      </div>
    </div>
  )
}

function SidebarStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

function LinkRow({
  label,
  href,
  value,
  verified,
}: {
  label: string
  href: string
  value: string
  verified?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-mono text-xs text-violet-400 hover:text-violet-300"
      >
        {value}
        {verified && <span className="text-emerald-400">✓</span>}
      </a>
    </div>
  )
}
