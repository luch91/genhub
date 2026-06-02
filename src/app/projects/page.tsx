import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/lib/db"
import { ProjectCard } from "@/components/projects/project-card"
import { PREDEFINED_TAGS } from "@/lib/utils"

export const metadata: Metadata = { title: "Projects" }

type PageProps = {
  searchParams: Promise<{ tag?: string; sort?: string }>
}

async function getProjects(tag?: string, sort?: string) {
  const orderBy =
    sort === "upvoted"
      ? { upvotes: { _count: "desc" as const } }
      : sort === "active"
      ? { updates: { _count: "desc" as const } }
      : { createdAt: "desc" as const }

  return db.project.findMany({
    where: {
      status: "PUBLISHED",
      ...(tag
        ? {
            tags: {
              some: { tag: { slug: tag } },
            },
          }
        : {}),
    },
    orderBy,
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { upvotes: true, comments: true, updates: true } },
    },
  })
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { tag, sort } = await searchParams
  const projects = await getProjects(tag, sort)

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-slate-400">
            {projects.length} project{projects.length !== 1 ? "s" : ""} built on GenLayer
          </p>
        </div>
        <Link href="/projects/submit" className="btn-primary self-start sm:self-auto">
          Submit project
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterLink href="/projects" active={!tag} label="All" />
        {PREDEFINED_TAGS.map((t) => (
          <FilterLink
            key={t}
            href={`/projects?tag=${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}`}
            active={tag === t.toLowerCase().replace(/\s+/g, "-")}
            label={t}
          />
        ))}
      </div>

      {/* Sort */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <span>Sort:</span>
        <SortLink href="/projects" sort={sort} value={undefined} label="Newest" />
        <SortLink href="/projects" sort={sort} value="upvoted" label="Most upvoted" />
        <SortLink href="/projects" sort={sort} value="active" label="Most active" />
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-16 text-center">
          <p className="text-slate-500">No projects found for this filter.</p>
          <Link href="/projects" className="mt-4 text-sm text-violet-400 hover:text-violet-300">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  )
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "badge bg-violet-600 text-white"
          : "badge border border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
      }
    >
      {label}
    </Link>
  )
}

function SortLink({
  href,
  sort,
  value,
  label,
}: {
  href: string
  sort: string | undefined
  value: string | undefined
  label: string
}) {
  const active = sort === value
  const url = value ? `${href}?sort=${value}` : href
  return (
    <Link
      href={url}
      className={active ? "font-medium text-violet-400" : "hover:text-slate-300"}
    >
      {label}
    </Link>
  )
}
