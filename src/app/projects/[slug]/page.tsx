import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { formatDate, UPDATE_TYPE_LABELS, UPDATE_TYPE_COLORS, projectCoverGradient } from "@/lib/utils"
import { CommentSection } from "@/components/comments/comment-section"
import { UpvoteButton } from "@/components/projects/upvote-button"
import { VerifyButton } from "@/components/projects/verify-button"
import { RemixButton } from "@/components/projects/remix-button"
import { ResubmitButton } from "@/components/projects/resubmit-button"

type PageProps = { params: Promise<{ slug: string }> }

async function getProject(slug: string, userId?: string) {
  const project = await db.project.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      tags:   { include: { tag: { select: { id: true, name: true, slug: true } } } },
      updates: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { comments: true } },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, username: true, image: true } } },
      },
      _count:   { select: { upvotes: true, comments: true, updates: true } },
      reviews:  { select: { decision: true, feedback: true } },
      remixedFrom: { select: { id: true, title: true, slug: true } },
    },
  })

  if (!project) return null
  if (project.status === "PUBLISHED") return project
  if (project.status === "PENDING_REVIEW" && project.authorId === userId) return project
  if (project.status === "DRAFT"          && project.authorId === userId) return project
  if (project.status === "EXPIRED"        && project.authorId === userId) return project
  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const session = await auth()
  const project = await getProject(slug, session?.user?.id)
  if (!project) return {}
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: "website",
      ...(project.coverImage && {
        images: [{ url: project.coverImage, width: 1200, height: 630, alt: project.title }],
      }),
    },
    twitter: {
      card: project.coverImage ? "summary_large_image" : "summary",
      title: project.title,
      description: project.tagline,
      ...(project.coverImage && { images: [project.coverImage] }),
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const session = await auth()
  const project = await getProject(slug, session?.user?.id)
  if (!project) notFound()

  const approvals         = project.reviews.filter((r) => r.decision === "APPROVED").length
  const rejections        = project.reviews.filter((r) => r.decision === "REJECTED").length
  const rejectionFeedback = project.reviews.filter((r) => r.decision === "REJECTED" && r.feedback).map((r) => r.feedback)

  const hasUpvoted = session?.user
    ? await db.upvote.findUnique({
        where: { userId_projectId: { userId: session.user.id, projectId: project.id } },
      }).then(Boolean)
    : false

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Remixed-from attribution */}
      {project.remixedFrom && (
        <div className="mb-6 rounded-xl border border-brand-amber/25 bg-brand-amber/8 px-5 py-3">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-amber-dk">Remix</p>
          <p className="mt-0.5 text-sm text-brand-navy/65">
            Based on{" "}
            <Link
              href={`/projects/${project.remixedFrom.slug}`}
              className="font-semibold text-brand-navy hover:text-brand-indigo transition-colors"
            >
              {project.remixedFrom.title}
            </Link>
          </p>
        </div>
      )}

      {/* Status banners */}
      {project.status === "EXPIRED" && session?.user?.id === project.authorId && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="font-ui font-semibold text-red-700">Removed from gallery</p>
          <p className="mt-1 text-sm text-red-600">
            This project didn&apos;t reach 5 upvotes within 2 weeks of publishing. Resubmit to give it another chance — the 2-week clock resets.
          </p>
          <ResubmitButton projectId={project.id} />
        </div>
      )}
      {project.status === "PENDING_REVIEW" && (
        <div className="mb-6 rounded-xl border border-brand-amber/30 bg-brand-amber/8 px-5 py-4">
          <p className="font-ui font-semibold text-brand-amber-dk">Under review</p>
          <p className="mt-1 text-sm text-brand-amber-dk/70">
            Your project needs 3 community approvals before it goes live.{" "}
            {approvals}/3 approvals · {rejections}/3 rejections
          </p>
        </div>
      )}
      {project.status === "DRAFT" && rejectionFeedback.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="font-ui font-semibold text-red-700">Needs revision</p>
          <p className="mt-1 text-sm text-red-600">
            Your project was rejected. Address the feedback below and resubmit.
          </p>
          <ul className="mt-3 space-y-1">
            {rejectionFeedback.map((f, i) => (
              <li key={i} className="text-sm text-red-600">· {f}</li>
            ))}
          </ul>
        </div>
      )}

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
                  className="badge border border-brand-indigo/15 bg-brand-indigo/5 text-brand-indigo/60 hover:text-brand-indigo transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-black text-brand-navy">{project.title}</h1>
              {session?.user?.id === project.authorId && (
                <Link
                  href={`/projects/${project.slug}/edit`}
                  className="shrink-0 rounded-lg border border-brand-indigo/20 px-3 py-1.5 font-ui text-xs font-medium text-brand-navy/55 transition-colors hover:border-brand-indigo/40 hover:text-brand-navy"
                >
                  Edit
                </Link>
              )}
            </div>
            <p className="mt-2 text-lg text-brand-navy/55">{project.tagline}</p>
          </div>

          {/* Cover image / placeholder */}
          <div className="overflow-hidden rounded-xl border border-brand-indigo/10">
            {project.coverImage ? (
              <Image src={project.coverImage} alt={project.title} width={800} height={400} className="w-full object-cover" />
            ) : (
              <div className="h-52 w-full" style={{ background: projectCoverGradient(project.id) }} />
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">About</h2>
            <p className="whitespace-pre-wrap text-brand-navy/70">{project.description}</p>
          </div>

          {/* GenLayer angle */}
          <div className="genlayer-angle">
            <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-indigo">
              Why only GenLayer?
            </h2>
            <p className="whitespace-pre-wrap text-brand-navy/70">{project.genlayerAngle}</p>
          </div>

          {/* Build log */}
          {project.updates.length > 0 && (
            <div>
              <h2 className="section-heading mb-4">Build log</h2>
              <div className="space-y-3">
                {project.updates.map((update) => (
                  <div key={update.id} className="card">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`badge ${UPDATE_TYPE_COLORS[update.type]}`}>
                        {UPDATE_TYPE_LABELS[update.type]}
                      </span>
                      <span className="text-xs text-brand-navy/40">{formatDate(update.createdAt)}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-brand-navy/70">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="card">
            <CommentSection
              projectId={project.id}
              initialComments={project.comments}
              currentUserId={session?.user?.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Upvote + stats */}
          <div className="card">
            <div className="flex items-center gap-4">
              <UpvoteButton
                projectId={project.id}
                initialCount={project._count.upvotes}
                initialUpvoted={hasUpvoted}
                currentUserId={session?.user?.id}
              />
              <div className="flex flex-1 flex-col gap-3">
                <SidebarStat value={project._count.updates}  label="Updates" />
                <SidebarStat value={project._count.comments} label="Comments" />
              </div>
            </div>
          </div>

          {/* Actions */}
          {project.status === "PUBLISHED" && (
            <div className="space-y-2">
              <RemixButton
                slug={project.slug}
                currentUserId={session?.user?.id}
                authorId={project.authorId}
              />
              {session?.user?.id === project.authorId &&
                project.contractAddress &&
                !project.verified && (
                  <VerifyButton projectId={project.id} />
                )}
            </div>
          )}

          {/* Author */}
          <div className="card">
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">Builder</h3>
            <Link
              href={`/builders/${project.author.username ?? project.author.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {project.author.image ? (
                <Image src={project.author.image} alt={project.author.name ?? ""} width={36} height={36} className="rounded-full" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-brand-indigo/15" />
              )}
              <div>
                <div className="font-ui text-sm font-semibold text-brand-navy">{project.author.name}</div>
                {project.author.username && (
                  <div className="font-mono text-xs text-brand-navy/45">@{project.author.username}</div>
                )}
              </div>
            </Link>
          </div>

          {/* Links */}
          {(project.contractAddress || project.repoUrl || project.demoUrl) && (
            <div className="card space-y-2">
              <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-brand-navy/40">Links</h3>
              {project.contractAddress && (
                <LinkRow
                  label={project.verified ? "Contract (verified)" : "Contract"}
                  href={`https://explorer.genlayer.com/address/${project.contractAddress}`}
                  value={`${project.contractAddress.slice(0, 6)}…${project.contractAddress.slice(-4)}`}
                  verified={project.verified}
                />
              )}
              {project.repoUrl  && <LinkRow label="Repository" href={project.repoUrl}  value="View source" />}
              {project.demoUrl  && <LinkRow label="Demo"       href={project.demoUrl}  value="Try it" />}
            </div>
          )}

          <p className="text-center font-mono text-xs text-brand-navy/35">
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
      <div className="font-display text-xl font-black text-brand-navy">{value}</div>
      <div className="text-xs text-brand-navy/40">{label}</div>
    </div>
  )
}

function LinkRow({ label, href, value, verified }: { label: string; href: string; value: string; verified?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-brand-navy/45">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-mono text-xs text-brand-indigo hover:text-brand-indigo/80 transition-colors"
      >
        {value}
        {verified && <span className="text-emerald-600">✓</span>}
      </a>
    </div>
  )
}
