import { motion } from "framer-motion"
import { db } from "@/lib/db"
import { ShowcaseGrid, type ShowcaseCard } from "./showcase-grid"

// Recognized GenLayer builders — always shown. When a builder signs up
// with a matching username, their real avatar and profile link appear automatically.
const MEMBERS = [
  { name: "Pavel",       username: "Pavel",       initials: "PV", avatarColor: "#4f46e5" },
  { name: "emark",       username: "emark",       initials: "EM", avatarColor: "#fbbf24" },
  { name: "Mr Network",  username: "mr-network",  initials: "MN", avatarColor: "#6366f1" },
  { name: "JayDeculein", username: "JayDeculein", initials: "JD", avatarColor: "#1a1a2e" },
  { name: "Dude",        username: "Dude",        initials: "DU", avatarColor: "#818cf8" },
  { name: "Gen.Dave",    username: "Gen-Dave",    initials: "GD", avatarColor: "#f59e0b" },
  { name: "Ying",        username: "Ying",        initials: "YI", avatarColor: "#4f46e5" },
  { name: "gaymused",    username: "gaymused",    initials: "GM", avatarColor: "#a5b4fc" },
]

const AVATAR_COLORS = [
  "#4f46e5", "#fbbf24", "#6366f1", "#1a1a2e",
  "#818cf8", "#f59e0b", "#a5b4fc", "#4338ca",
]

function getInitials(name: string | null, username: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  if (username) return username.slice(0, 2).toUpperCase()
  return "??"
}

function getAvatarColor(id: string): string {
  const hash = Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

async function getShowcaseCards(): Promise<ShowcaseCard[]> {
  const memberUsernames = MEMBERS.map((m) => m.username)
  const memberUsernamesLower = memberUsernames.map((u) => u.toLowerCase())

  const [matchedBuilders, dynamicCandidates] = await Promise.all([
    // Look up DB records for the hardcoded builders by username
    db.user.findMany({
      where: { username: { in: memberUsernames } },
      select: { id: true, username: true, image: true },
    }),
    // Find new builders with 5+ published projects not already in the hardcoded list
    db.user.findMany({
      where: {
        username: { not: null },
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
    }),
  ])

  // Username → DB record lookup (case-insensitive)
  const matchMap = new Map(
    matchedBuilders.map((b) => [b.username!.toLowerCase(), b])
  )

  // Hardcoded cards — always present, enriched with real data when available
  const hardcodedCards: ShowcaseCard[] = MEMBERS.map((m) => {
    const dbUser = matchMap.get(m.username.toLowerCase())
    return {
      key:             m.username,
      displayName:     m.name,
      initials:        m.initials,
      avatarColor:     m.avatarColor,
      image:           dbUser?.image ?? null,
      profileUsername: dbUser?.username ?? null,
    }
  })

  // Dynamic cards — builders with 5+ published projects not in the hardcoded list
  const dynamicCards: ShowcaseCard[] = dynamicCandidates
    .filter(
      (b) =>
        b._count.projects >= 5 &&
        b.username &&
        !memberUsernamesLower.includes(b.username.toLowerCase())
    )
    .slice(0, 8)
    .map((b) => ({
      key:             b.id,
      displayName:     b.name ?? b.username ?? "Builder",
      initials:        getInitials(b.name, b.username),
      avatarColor:     getAvatarColor(b.id),
      image:           b.image,
      profileUsername: b.username ?? null,
      projectCount:    b._count.projects,
    }))

  return [...hardcodedCards, ...dynamicCards]
}

export async function ShowcaseSection() {
  const cards = await getShowcaseCards()

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

        <ShowcaseGrid cards={cards} />
      </div>
    </section>
  )
}
