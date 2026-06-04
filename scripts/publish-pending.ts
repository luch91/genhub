import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  const pending = await db.project.findMany({
    where: { status: "PENDING_REVIEW" },
    select: { id: true, title: true },
  })

  if (pending.length === 0) {
    console.log("No projects in PENDING_REVIEW.")
    return
  }

  console.log(`Found ${pending.length} project(s) to publish:`)
  pending.forEach((p) => console.log(` · ${p.title}`))

  await db.project.updateMany({
    where: { status: "PENDING_REVIEW" },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  })

  console.log("Done — all published.")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
