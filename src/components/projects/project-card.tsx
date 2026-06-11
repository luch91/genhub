import Link from "next/link"
import Image from "next/image"
import type { ProjectWithRelations } from "@/types"
import { formatRelativeDate, projectCoverGradient } from "@/lib/utils"

type Props = { project: ProjectWithRelations }

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex flex-col gap-4 transition-all hover:border-brand-indigo/25 hover:shadow-md"
    >
      {/* Cover image / placeholder */}
      <div className="-mx-6 -mt-6 overflow-hidden rounded-t-xl">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            width={400}
            height={200}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-36 w-full"
            style={{ background: projectCoverGradient(project.id) }}
          />
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {project.featured && (
          <span className="badge bg-brand-amber/15 text-brand-amber-dk border border-brand-amber/20 text-xs font-semibold">
            Featured
          </span>
        )}
        {project.tags.slice(0, 3).map(({ tag }) => (
          <span
            key={tag.id}
            className="badge border border-brand-indigo/15 bg-brand-indigo/5 text-brand-indigo/60 text-xs"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Title and tagline */}
      <div>
        <h3 className="font-ui font-semibold text-brand-navy group-hover:text-brand-indigo transition-colors">
          {project.title}
          {project.verified && (
            <span className="ml-2 text-xs text-emerald-600">✓</span>
          )}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-brand-navy/50">{project.tagline}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-xs text-brand-navy/40">
        <div className="flex items-center gap-2">
          {project.author.image && (
            <Image
              src={project.author.image}
              alt={project.author.name ?? ""}
              width={16}
              height={16}
              className="rounded-full"
            />
          )}
          <span>{project.author.name ?? project.author.username ?? "Builder"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-brand-indigo/60">{project._count.upvotes} ↑</span>
          <span>{project._count.updates} updates</span>
        </div>
      </div>
    </Link>
  )
}
