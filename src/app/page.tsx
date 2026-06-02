import { db } from "@/lib/db"
import { Hero } from "@/components/landing/hero"
import { BentoGrid } from "@/components/landing/bento-grid"
import { HowItWorks } from "@/components/landing/how-it-works"
import { LiveStats } from "@/components/landing/live-stats"
import { TechMarquee } from "@/components/landing/tech-marquee"
import { FinalCTA } from "@/components/landing/final-cta"

async function getStats() {
  try {
    const [projectCount, builderCount, upvoteCount] = await Promise.all([
      db.project.count({ where: { status: "PUBLISHED" } }),
      db.user.count({ where: { username: { not: null } } }),
      db.upvote.count(),
    ])
    return { projectCount, builderCount, upvoteCount }
  } catch {
    return { projectCount: 0, builderCount: 0, upvoteCount: 0 }
  }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="overflow-x-hidden" style={{ background: "#050505" }}>
      <Hero />
      <BentoGrid />
      <HowItWorks />
      <LiveStats stats={stats} />
      <TechMarquee />
      <FinalCTA />
    </div>
  )
}
