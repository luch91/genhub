# GenLayer Builder Feedback

Findings from building GenHub on the GenLayer ecosystem.  
Maintained as a running record for the GenLayer team.

---

## What Was Built

GenHub is a full-stack community platform for the GenLayer builder ecosystem. Builders submit Intelligent Contract projects, post build-in-public updates, upvote each other's work, host live audio Spaces via Livekit, and follow each other's progress.

Stack: Next.js 15 App Router, TypeScript, Prisma, PostgreSQL (Neon), NextAuth v5, Livekit, Vercel Blob, Resend.

Live: [community.genhub.fun](https://community.genhub.fun)

---

## On-Chain Contract Verification

GenHub supports on-chain contract address verification via GenLayer's JSON-RPC. From a project page, the author can verify their deployed contract is live.

Implementation: `POST /api/projects/[id]/verify` calls `eth_getCode` on the `GENLAYER_RPC_URL` endpoint (default: `https://studio.genlayer.com:8443/api`). If bytecode exists at the address, `project.verified = true` is set and a verified badge appears on the project page.

**Finding:** The default RPC URL points to Studio (studionet, chainId 61999). Builders who deploy to a different environment (mainnet candidate, testnet) need to override `GENLAYER_RPC_URL`. This is not obvious from the Studio UI or docs. A clear environment reference table in the docs would help — mapping environment names to RPC URLs and chain IDs.

---

## The "Why Only GenLayer?" Field

Every project submission on GenHub requires a `genlayerAngle` field: "What's only possible on GenLayer?"

This was a deliberate product decision, not a technical requirement. It forces builders to articulate the specific GenLayer capability their project uses — validator consensus on real-world state, subjective LLM reasoning under `eq_principle`, trustless web fetches via `gl.get_webpage`, or onchain metric verification via `eth_call`.

**Finding for the GenLayer team:** The range of answers submitted to this field is a useful signal for where the ecosystem has depth and where it's thin. Projects in DeFi and tooling have strong answers. Projects in gaming and social struggle to articulate a GenLayer-specific advantage. This suggests where the ecosystem needs more example projects and documentation.

---

## Builder Activation Gap

GenHub is the social layer. The Builder Companion is the build layer. The gap between them is still manual — a builder uses the Companion to generate a project, then manually submits it to GenHub.

A future integration would allow a builder to submit their Companion-generated project to GenHub directly from the Companion's export flow. This would require GenHub to expose a submission API that accepts a project payload (title, description, genlayerAngle, contractAddress, repoUrl) authenticated via OAuth token. Not a GenLayer team dependency — but worth noting as a planned platform integration.

---

## What the Ecosystem Needs

1. A clear environment reference — studionet vs testnet vs mainnet RPC URLs and chain IDs in one place
2. More worked examples of `gl.get_webpage` + `eq_principle` use cases beyond DeFi
3. A canonical answer to "What's only possible on GenLayer?" for each of the 10 project tag categories — would directly help builders fill in the `genlayerAngle` field
4. Clearer documentation on contract address portability across environments (studionet → production)
