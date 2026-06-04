import { motion } from "framer-motion"
import { db } from "@/lib/db"
import { ShowcaseGrid } from "./showcase-grid"

async function getTopBuilders() {
  const candidates = await db.user.findMany({
    where: {
      projects: { some: { status: "PUBLISHED" } },
    },
    orderBy: { reputationScore: "desc" },
    take: 50,
    select: {
      id:       true,
      name:     true,
      username: true,
      image:    true,
      _count: {
        select: {
          projects: { where: { status: "PUBLISHED" } },
        },
      },
    },
  })

  return candidates.filter((b) => b._count.projects >= 5).slice(0, 8)
}

export async function ShowcaseSection() {
  const builders = await getTopBuilders()

  if (builders.length === 0) return null

  return (
    <section id="community" className="relative overflow-hidden bg-brand-cream px-6 py-24">
      {/* Tile pattern background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
            Who&apos;s Building
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            Meet the GenLayer
            <br />
            Builder Community
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-brand-navy/55">
            Real builders. All building in public.
          </p>
        </motion.div>

        <ShowcaseGrid builders={builders} />
      </div>
    </section>
  )
}
