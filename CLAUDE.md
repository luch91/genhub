# GenLayer Builders Hub

A community platform for GenLayer builders — submit projects, build in public, and discover what others are creating with Intelligent Contracts.

## What This Is

A full-stack Next.js web application where the GenLayer developer community gathers to:
- Submit and showcase Intelligent Contract projects
- Post build-in-public updates (milestones, blockers, breakthroughs)
- Discover and upvote other builders' work
- Verify deployed contract addresses
- Connect with other builders via profiles
- Join and host live audio rooms (GenHub Space) powered by Livekit, with optional X Space fallback
- Sessions (YouTube embeds) — code intact, hidden from nav pending Twitch integration

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Full-stack, server components, server actions |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS | Utility-first, zero runtime CSS |
| ORM | Prisma | Type-safe queries, migration management |
| Database | PostgreSQL | Relational data with JSON support |
| Auth | NextAuth v5 | OAuth providers + Prisma adapter |
| Validation | Zod | Runtime validation + TypeScript inference |
| Live audio | Livekit | WebRTC-based audio rooms for Spaces |
| Deployment | Vercel | Native Next.js platform |

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Route group — login
│   ├── builders/           # Builder directory + profiles
│   ├── feed/               # Build-in-public feed
│   ├── projects/           # Gallery, submit, individual project
│   ├── sessions/           # Builder sessions (YouTube embeds)
│   │   └── schedule/       # Schedule a session form
│   ├── spaces/             # Live audio rooms (Livekit)
│   │   ├── create/         # Create a space form
│   │   └── [id]/           # Live space room page
│   ├── api/                # API route handlers
│   │   ├── sessions/       # GET/POST sessions, PATCH/DELETE [id]
│   │   ├── spaces/         # GET/POST spaces + [id]/ token/end/raise-hand/admit/participants/my-role/remove-speaker
│   │   └── user/           # PATCH profile, POST avatar, POST ping (presence)
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   ├── globals.css
│   └── providers.tsx
├── components/
│   ├── layout/             # Header, footer
│   ├── projects/           # ProjectCard, SubmitForm, etc.
│   ├── sessions/           # SessionCard, YoutubeEmbed, ScheduleForm
│   ├── spaces/             # SpaceCard, SpaceRoom, CreateForm
│   ├── builders/
│   └── feed/
├── lib/
│   ├── auth.ts
│   ├── db.ts               # Prisma client singleton
│   ├── notifications.ts    # notifyUser(), notifyFollowers(), notifyAllBuilders()
│   ├── utils.ts            # cn(), slugify(), extractYouTubeId(), generateRoomName()
│   └── validations.ts      # Zod schemas for all forms/APIs
└── types/
    └── index.ts
prisma/
└── schema.prisma           # Full database schema
```

## Domain Model

**User (Builder)** — A registered member with a username, bio, optional wallet address, and social links. Tracks `submissionCredits`, `reputationScore`, `lastSeenAt` (presence), `lastBuildUpdateCredit`, and `lastCommentCredit` (credit rate-limiting).

**Project** — A GenLayer project submission with title, tagline, description, and a required `genlayerAngle` field ("What's only possible on GenLayer?"). Has optional verified `contractAddress`, `repoUrl`, and `demoUrl`. `upvoteCreditsAwarded` (0–3) tracks how many milestone credits have been given to the author.

**ProjectUpdate** — A "build in public" feed post tied to a project. Type is one of `MILESTONE | BLOCKER | BREAKTHROUGH | GENERAL`. These populate the main community feed.

**Comment** — Can be left on a Project or a ProjectUpdate.

**Upvote** — One per user per project. DB-level unique constraint prevents duplicates.

**Tag** — Labels on projects (DeFi, AI Oracle, Gaming, Social, Tooling, etc.). Many-to-many via `ProjectTag`.

## Development Commands

```bash
npm run dev           # Start dev server with Turbopack
npm run build         # Production build
npm run lint          # ESLint
npm run typecheck     # TypeScript check, no emit
npm run db:generate   # Regenerate Prisma client after schema change
npm run db:push       # Push schema changes to DB (dev only, no migration file)
npm run db:migrate    # Create migration + apply (use for production changes)
npm run db:studio     # Open Prisma Studio GUI
npm run db:seed       # Seed DB with sample builders, projects, and updates
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret — run `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `https://community.genhub.fun`) |
| `LIVEKIT_API_KEY` | Livekit API key — from cloud.livekit.io |
| `LIVEKIT_API_SECRET` | Livekit API secret |
| `NEXT_PUBLIC_LIVEKIT_URL` | Livekit WSS URL (e.g. `wss://your-app.livekit.cloud`) |

## Key Patterns

### Authentication
Use `auth()` from `@/lib/auth` in Server Components and API routes:
```ts
const session = await auth()
if (!session?.user) return new Response("Unauthorized", { status: 401 })
```
For client components, use `useSession()` from `next-auth/react` (requires `SessionProvider` in `providers.tsx`).

### Database Access
Always import `db` from `@/lib/db`. Never instantiate `PrismaClient` directly — the singleton prevents connection pool exhaustion in dev.

### Form Validation
Every submission is validated with Zod on both client (user feedback) and server (correctness). All schemas are in `src/lib/validations.ts`.

### Server Actions
Forms use Server Actions in `src/app/actions/`. Actions call `auth()` to verify the session, validate with Zod, then write to the DB.

### Dynamic Route Params (Next.js 15)
Params are a `Promise` in Next.js 15. Always `await` them:
```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
```

### Slugs
Project slugs are derived from the title via `slugify()` in `@/lib/utils`. Uniqueness is enforced in the DB. Collisions get a short random suffix appended.

## Conventions

- **File naming**: `kebab-case` files, `PascalCase` component exports
- **Imports**: Always use the `@/` path alias for internal imports
- **Server vs. Client**: Default to Server Components. Add `"use client"` only when you need hooks, event handlers, or browser APIs
- **Tailwind classes**: Use `cn()` from `@/lib/utils` when combining conditional Tailwind classes
- **API errors**: All API routes return `{ error: string }` JSON on failure with the appropriate HTTP status code
- **Tags**: Use the `PREDEFINED_TAGS` constant from `@/lib/utils` for the canonical tag list — do not let users create arbitrary tags

## Feature Status

- [x] Project submission, gallery, tag filtering — auto-publishes instantly, no peer review
- [x] Builder profiles, follow system
- [x] Build-in-public feed
- [x] Upvoting with 2-week expiry cron
- [x] Comment threads
- [x] On-chain contract address verification
- [x] Builder onboarding (username selection post-OAuth)
- [x] "Remix This" project fork flow
- [x] Email notifications (Resend)
- [x] Discussion board
- [x] In-app notifications with bell icon — SPACE_LIVE and NEW_PROJECT broadcast to all; UPVOTE_MILESTONE emails author
- [x] Credit system — +1 at 5/10/25 upvotes; +1 for MILESTONE/BREAKTHROUGH updates (daily); +1 for comments (weekly)
- [x] Online presence — green dot via lastSeenAt + PresencePing + OnlineDot
- [x] Mobile hamburger navigation
- [x] GenHub Space — live audio rooms via Livekit with host controls (raise hand, admit, remove speaker, X Space fallback)
- [x] Sessions — YouTube-embedded sessions (`/sessions`), hidden from nav; code intact for Twitch
- [ ] Sessions / Spaces tag picker
- [ ] Sessions edit form (PATCH /api/sessions/[id] exists, no UI yet)
- [ ] Weekly community challenges / bounties

## Important Windows Dev Notes

- **EPERM on `db:generate`**: The dev server locks the Prisma query engine DLL. Kill all node processes (`Stop-Process -Name node -Force` in PowerShell) before running `db:generate` or `db:push`, then restart the dev server.
- **framer-motion** must only be used in Client Components (`"use client"`). Never import `motion.*` in Server Components.
