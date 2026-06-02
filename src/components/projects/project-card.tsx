import Link from "next/link"
import Image from "next/image"
import type { ProjectWithRelations } from "@/types"
import { formatRelativeDate } from "@/lib/utils"

type Props = { project: ProjectWithRelations }

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex flex-col gap-4 transition-colors hover:border-slate-700"
    >
      {/* Cover image */}
      {project.coverImage && (
        <div className="-mx-6 -mt-6 overflow-hidden rounded-t-xl">
          <Image
            src={project.coverImage}
            alt={project.title}
            width={400}
            height={200}
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {project.tags.slice(0, 3).map(({ tag }) => (
          <span
            key={tag.id}
            className="badge border border-slate-700 bg-slate-800 text-slate-500 text-xs"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Title and tagline */}
      <div>
        <h3 className="font-semibold text-slate-100 group-hover:text-white">
          {project.title}
          {project.verified && (
            <span className="ml-2 text-xs text-emerald-400">✓</span>
          )}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.tagline}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-xs text-slate-600">
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
          <span>{project._count.upvotes} ↑</span>
          <span>{project._count.updates} updates</span>
        </div>
      </div>
    </Link>
  )
}
