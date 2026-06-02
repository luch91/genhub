import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const alice = await db.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Chen",
      email: "alice@example.com",
      username: "alicechen",
      bio: "Building at the intersection of AI and decentralized systems. Core contributor on GenLayer.",
      githubHandle: "alicechen",
      twitterHandle: "alicechen_dev",
    },
  })

  const bob = await db.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Nakamura",
      email: "bob@example.com",
      username: "bnakamura",
      bio: "DeFi developer exploring AI-native smart contracts.",
      githubHandle: "bnakamura",
    },
  })

  const aiOracleTag = await db.tag.upsert({
    where: { slug: "ai-oracle" },
    update: {},
    create: { name: "AI Oracle", slug: "ai-oracle" },
  })

  const defiTag = await db.tag.upsert({
    where: { slug: "defi" },
    update: {},
    create: { name: "DeFi", slug: "defi" },
  })

  const toolingTag = await db.tag.upsert({
    where: { slug: "tooling" },
    update: {},
    create: { name: "Tooling", slug: "tooling" },
  })

  const project1 = await db.project.upsert({
    where: { slug: "on-chain-sentiment-oracle" },
    update: {},
    create: {
      slug: "on-chain-sentiment-oracle",
      title: "On-Chain Sentiment Oracle",
      tagline: "An Intelligent Contract that reads live social data and feeds market sentiment on-chain.",
      description:
        "This oracle fetches sentiment signals from public data sources and translates them into an on-chain score that other contracts can consume. No trusted third party — the AI reasoning is transparent and verifiable.",
      genlayerAngle:
        "Traditional oracles can only bring in structured numerical data. This project uses GenLayer's ability to run LLM inference inside a contract to interpret unstructured text and produce a structured output. That's impossible on any other chain.",
      status: "PUBLISHED",
      authorId: alice.id,
      tags: { create: [{ tagId: aiOracleTag.id }, { tagId: defiTag.id }] },
    },
  })

  await db.project.upsert({
    where: { slug: "genlayer-dev-toolkit" },
    update: {},
    create: {
      slug: "genlayer-dev-toolkit",
      title: "GenLayer Dev Toolkit",
      tagline: "A CLI and local testing harness for Intelligent Contract development.",
      description:
        "Spin up a local GenLayer environment, write Intelligent Contracts in Python, run deterministic tests, and get AI-assisted debugging — all from one CLI.",
      genlayerAngle:
        "Testing AI-driven contracts requires a fundamentally different approach than standard Solidity tests. This toolkit provides the reproducibility layer that GenLayer's AI execution model needs.",
      status: "PUBLISHED",
      authorId: bob.id,
      tags: { create: [{ tagId: toolingTag.id }] },
    },
  })

  await db.projectUpdate.create({
    data: {
      type: "MILESTONE",
      content:
        "Just shipped v0.3 of the sentiment oracle. It now handles multiple data sources and aggregates them before producing the on-chain score. Accuracy is up 40% on our test set.",
      projectId: project1.id,
      authorId: alice.id,
    },
  })

  await db.projectUpdate.create({
    data: {
      type: "BLOCKER",
      content:
        "Running into nondeterminism issues when the LLM output contains floating point values. Investigating whether we need to snap to fixed-point arithmetic before writing to state.",
      projectId: project1.id,
      authorId: alice.id,
    },
  })

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
