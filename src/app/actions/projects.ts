"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { projectSubmitSchema } from "@/lib/validations"
import { slugify, generateSlugSuffix } from "@/lib/utils"

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const author = await db.user.findUnique({
    where: { id: session.user.id },
    select: { submissionCredits: true },
  })
  if (!author || author.submissionCredits < 1) {
    throw new Error("No submission credits remaining.")
  }

  const raw = {
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    genlayerAngle: formData.get("genlayerAngle"),
    contractAddress: formData.get("contractAddress"),
    repoUrl: formData.get("repoUrl"),
    demoUrl: formData.get("demoUrl"),
    tags: formData.getAll("tags"),
  }

  const result = projectSubmitSchema.safeParse(raw)
  if (!result.success) throw new Error(JSON.stringify(result.error.flatten()))

  const { tags, contractAddress, repoUrl, demoUrl, ...rest } = result.data

  const baseSlug = slugify(rest.title)
  let slug = baseSlug
  const existing = await db.project.findUnique({ where: { slug } })
  if (existing) slug = `${baseSlug}-${generateSlugSuffix()}`

  const project = await db.project.create({
    data: {
      ...rest,
      slug,
      contractAddress: contractAddress || null,
      repoUrl: repoUrl || null,
      demoUrl: demoUrl || null,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: session.user.id,
      tags: {
        create: await Promise.all(
          tags.map(async (tagName) => {
            const tagSlug = slugify(tagName)
            const tag = await db.tag.upsert({
              where: { slug: tagSlug },
              create: { name: tagName, slug: tagSlug },
              update: {},
            })
            return { tagId: tag.id }
          })
        ),
      },
    },
  })

  await db.user.update({
    where: { id: session.user.id },
    data: { submissionCredits: { decrement: 1 } },
  })

  redirect(`/projects/${project.slug}`)
}
