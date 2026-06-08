# GenHub

The open-access community platform for GenLayer builders. Submit Intelligent Contract projects, build in public, discover what others are creating, and connect with fellow developers in the GenLayer ecosystem.

**Live:** [community.genhub.fun](https://community.genhub.fun)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Development Scripts](#development-scripts)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Community Curation](#community-curation)
- [Submission Credits](#submission-credits)
- [Follow System](#follow-system)
- [Notifications](#notifications)
- [Email Notifications](#email-notifications)
- [On-chain Contract Verification](#on-chain-contract-verification)
- [Remix Flow](#remix-flow)
- [Profile Management](#profile-management)
- [Cron Jobs](#cron-jobs)
- [API Reference](#api-reference)

---

## Overview

GenHub is a full-stack web application built with Next.js 15 App Router. It is the central gathering place for the GenLayer developer community — an open-access platform where builders submit projects, share build logs, discuss ideas, and follow each other's progress.

Projects go live instantly on submission and are community-curated through upvotes. A project must earn 5 upvotes within 2 weeks to remain in the gallery. If it doesn't, the author is notified and can resubmit.

---

## Features

### Project Gallery
- Submit Intelligent Contract projects with title, tagline, full description, and a required **"Why only GenLayer?"** field
- Optional contract address, repository URL, and demo URL
- Tag-based filtering (DeFi, AI Oracle, Gaming, Social, Tooling, Infrastructure, NFT, DAO, Identity, Data)
- Sort by newest, most upvoted, or most active
- Contract addresses can be verified on-chain via GenLayer's JSON-RPC

### Community Curation
- Projects publish instantly on submission — no review gate
- A project must earn **5 upvotes within 2 weeks** to stay in the gallery
- Projects that don't reach the threshold are marked `EXPIRED` and removed
- The author receives an in-app and email notification and can resubmit from their project page
- The 2-week clock resets on every resubmit

### Build-in-Public Feed
- Post updates tied to any of your projects
- Update types: **General**, **Milestone**, **Blocker**, **Breakthrough**
- Filter the feed by update type
- Each update can receive comments

### Builder Profiles
- Profile page at `/builders/[username]`
- Displays name, avatar, bio, social links (Twitter, GitHub, website), wallet address, and all published projects
- Follower/following counts and project/update stats
- Profile editing at `/settings` — display name, avatar, bio, handles, wallet address

### Follow System
- Follow/unfollow any builder from their profile
- Following subscribes you to their new project and update notifications
- Cannot follow yourself

### Notifications
- Bell icon in the header with unread count badge
- Dropdown shows the last 20 notifications
- Full history at `/notifications` — grouped by Today, Yesterday, This week, Older
- Visiting `/notifications` marks all as read

### Discussion Board
- Community forum at `/discuss`
- Categories: **General**, **Help**, **Ideas**, **Showcase**
- Threaded replies

### Comments
- Comments on project pages
- Sign-in required; authors can delete their own comments

### Upvoting
- One upvote per user per project
- Author earns +1 credit at 5, 10, and 25 upvotes (each milestone independently, tracked by `upvoteCreditsAwarded`)
- Author receives an in-app + email notification at each milestone

### Onboarding
- First-time OAuth sign-in redirects to `/onboarding`
- User picks a username and writes a bio before reaching the app
- All protected pages redirect to `/onboarding` if the user has no username

### "Remix This" Fork Flow
- Any builder can fork another builder's project from the project page
- Remix retains a visible attribution banner linking back to the source project
- The original `remixedFromId` is stored on the forked project

### Builder Sessions
- Schedule YouTube-embedded live or recorded sessions at `/sessions`
- Sessions embed directly on GenHub — viewers never leave the site
- Supports one-off and recurring sessions with optional recurrence description
- Paste any YouTube URL format (watch, youtu.be, /live/) — the video ID is extracted automatically
- Sessions have three states: **Scheduled** (shows date), **Live** (embed appears), **Ended** (replay embed)

### GenHub Space (Live Audio)
- Host live audio rooms at `/spaces` powered by [Livekit](https://livekit.io)
- Any signed-in builder can start a space and become the host
- Listeners can raise their hand; the host sees raised hands in real time and can admit them as speakers
- Host can remove speakers mid-session; admitted speakers get an unmute button automatically
- Inline end-space confirmation — no disruptive browser prompts
- Optional X Space URL — paste an X (Twitter) Spaces link to cross-post; a join button appears on the card and inside the room
- 6-hour token TTL prevents silent mid-session disconnects
- Automatic WebSocket reconnection on mobile screen lock / network drop
- All builders are notified when a space goes live

### Online Presence
- A small green dot appears next to a builder's username when they were active within the last 5 minutes
- Presence is tracked via a throttled ping (`POST /api/user/ping`) sent every 4 minutes by the client

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.5.19 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.17 |
| ORM | Prisma | ^6.19.3 |
| Database | PostgreSQL | 16 (Neon recommended) |
| Authentication | NextAuth v5 | ^5.0.0-beta.25 |
| Auth Adapter | @auth/prisma-adapter | ^2.7.2 |
| Validation | Zod | ^3.23.8 |
| File Storage | Vercel Blob | ^2.4.0 |
| Email | Resend (raw fetch) | — |
| Live Audio | Livekit | livekit-server-sdk ^2.15, livekit-client ^2.19 |
| Animation | Framer Motion | ^11 |
| Runtime | Node.js | 24 LTS |
| Deployment | Vercel | — |

---

## Project Structure

```
genhub/
├── prisma/
│   ├── schema.prisma        # Full database schema
│   └── seed.ts              # Seed script
├── src/
│   ├── app/
│   │   ├── (auth)/login/    # OAuth sign-in page
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── builders/[username]/follow/
│   │   │   ├── comments/
│   │   │   ├── cron/expire-projects/  # Daily expiry cron
│   │   │   ├── discussions/
│   │   │   ├── feed/
│   │   │   ├── notifications/
│   │   │   ├── projects/
│   │   │   │   └── [id]/
│   │   │   │       ├── resubmit/
│   │   │   │       ├── review/
│   │   │   │       ├── upvote/
│   │   │   │       └── verify/
│   │   │   ├── sessions/              # Builder sessions API
│   │   │   │   └── [id]/
│   │   │   ├── spaces/                # Livekit spaces API
│   │   │   │   └── [id]/
│   │   │   │       ├── admit/
│   │   │   │       ├── end/
│   │   │   │       ├── my-role/
│   │   │   │       ├── participants/
│   │   │   │       ├── raise-hand/
│   │   │   │       ├── remove-speaker/
│   │   │   │       └── token/
│   │   │   └── user/
│   │   │       ├── avatar/  # Vercel Blob avatar upload
│   │   │       └── ping/    # Presence heartbeat
│   │   ├── builders/
│   │   │   ├── page.tsx          # Builder directory
│   │   │   └── [username]/       # Builder profile
│   │   ├── discuss/
│   │   ├── feed/
│   │   ├── notifications/
│   │   ├── onboarding/           # First-time username setup
│   │   ├── projects/
│   │   │   ├── page.tsx          # Project gallery
│   │   │   ├── submit/
│   │   │   ├── remix/[slug]/     # Fork a project
│   │   │   └── [slug]/           # Project detail + edit
│   │   ├── sessions/             # Sessions listing + schedule form
│   │   │   └── schedule/
│   │   ├── spaces/               # Spaces listing + create form + live room
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── review/               # Review queue (retained, hidden from nav)
│   │   ├── settings/             # Profile editing
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   └── providers.tsx
│   ├── components/
│   │   ├── brand/
│   │   ├── builders/
│   │   ├── comments/
│   │   ├── discuss/
│   │   ├── feed/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── notifications/
│   │   ├── projects/
│   │   │   ├── project-card.tsx
│   │   │   ├── remix-button.tsx
│   │   │   ├── resubmit-button.tsx
│   │   │   ├── submit-form.tsx
│   │   │   ├── upvote-button.tsx
│   │   │   └── verify-button.tsx
│   │   ├── sessions/
│   │   │   ├── session-card.tsx
│   │   │   ├── schedule-form.tsx
│   │   │   └── youtube-embed.tsx
│   │   └── spaces/
│   │       ├── space-card.tsx
│   │       ├── create-form.tsx
│   │       └── space-room.tsx
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config (GitHub + Google)
│   │   ├── db.ts             # Prisma singleton
│   │   ├── email.ts          # Resend raw fetch helper
│   │   ├── notifications.ts  # notifyUser() + notifyFollowers() + notifyAllBuilders()
│   │   ├── review.ts         # canReview() — retained for future peer review gate
│   │   ├── utils.ts          # cn(), slugify(), extractYouTubeId(), generateRoomName()
│   │   └── validations.ts    # Zod schemas
│   └── types/
│       └── next-auth.d.ts    # Session type augmentation
├── vercel.json               # Cron job schedule
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- A PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- GitHub and/or Google OAuth app credentials

### 1. Clone the repository

```bash
git clone https://github.com/luch91/genhub.git
cd genhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all required values. Also create a `.env` file for the Prisma CLI:

```bash
echo 'DATABASE_URL="your-connection-string"' > .env
```

### 4. Push the schema and generate the client

```bash
npm run db:push
npm run db:generate
```

### 5. Seed the database (optional)

```bash
npm run db:seed
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth secret — `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | Yes | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | Yes | GitHub OAuth app client secret |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL (e.g. `https://community.genhub.fun`) |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob token for avatar uploads |
| `RESEND_API_KEY` | Optional | Resend API key — emails are silently skipped if absent |
| `EMAIL_FROM` | Optional | Sender address (default: `GenHub <noreply@genhub.fun>`) |
| `GENLAYER_RPC_URL` | Optional | GenLayer JSON-RPC URL (default: `https://studio.genlayer.com:8443/api`) |
| `LIVEKIT_API_KEY` | Yes (Spaces) | Livekit API key — from [cloud.livekit.io](https://cloud.livekit.io) |
| `LIVEKIT_API_SECRET` | Yes (Spaces) | Livekit API secret |
| `NEXT_PUBLIC_LIVEKIT_URL` | Yes (Spaces) | Livekit WSS URL (e.g. `wss://your-app.livekit.cloud`) |

### OAuth callback URLs

**GitHub** — add to your OAuth app under "Authorization callback URL":
```
http://localhost:3000/api/auth/callback/github
https://community.genhub.fun/api/auth/callback/github
```

**Google** — add to Authorized redirect URIs:
```
http://localhost:3000/api/auth/callback/google
https://community.genhub.fun/api/auth/callback/google
```

---

## Database

GenHub uses **PostgreSQL 16**. [Neon](https://neon.tech) is recommended.

### Models

| Model | Purpose |
|-------|---------|
| `User` | Builder — username, bio, social links, wallet, credits, reputation |
| `Account` / `Session` / `VerificationToken` | NextAuth tables |
| `Project` | Submitted project with status, tags, publishedAt |
| `ProjectTag` | Project ↔ Tag join table |
| `Tag` | Predefined tag labels |
| `ProjectUpdate` | Build-in-public feed post |
| `ProjectReview` | Community review (Approved/Rejected) |
| `Comment` | Comment on a project or update |
| `Upvote` | One per user per project |
| `Discussion` | Discussion board thread |
| `Reply` | Reply to a discussion |
| `Follow` | Builder-to-builder follow |
| `Notification` | In-app notification |
| `BuilderSession` | YouTube-embedded session (Scheduled / Live / Ended) |
| `Space` | Livekit audio room (Scheduled / Live / Ended) |
| `SpaceParticipant` | User in a Space with role (Host / Speaker / Listener) |

### Project status flow

```
SUBMIT → PUBLISHED (instantly, publishedAt = now)
              ↓  (< 5 upvotes after 14 days, via cron)
           EXPIRED
              ↓  (author resubmits, publishedAt reset)
           PUBLISHED
```

---

## Development Scripts

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build (runs prisma generate first)
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit

npm run db:generate  # Regenerate Prisma client
npm run db:push      # Sync schema to DB (dev, no migration file)
npm run db:migrate   # Create migration + apply (production)
npm run db:studio    # Prisma Studio at localhost:5555
npm run db:seed      # Seed with sample data
```

---

## Architecture

### Rendering

- **Server Components by default** — pages fetch data directly with Prisma
- **`"use client"`** only for interactivity: forms, buttons, dropdowns, the notification bell, the upvote button

### Authentication

```ts
// Server components and API routes
const session = await auth()
if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

// Client components
const { data: session } = useSession()
```

NextAuth v5 uses database sessions with `PrismaAdapter`. The session type is augmented in `src/types/next-auth.d.ts` to expose `session.user.id` (string) and `session.user.username` (string | null).

### Onboarding redirect

Every protected page checks for a missing username:

```ts
const session = await auth()
if (session?.user && !session.user.username) redirect("/onboarding")
```

### Database access

```ts
import { db } from "@/lib/db"
```

The Prisma singleton prevents connection pool exhaustion in development.

### Validation

All forms are validated with Zod on both client and server. Schemas live in `src/lib/validations.ts`.

---

## Domain Model

### User (Builder)

- `username` — unique, set during onboarding; URL key for profile
- `name` — display name, editable; may differ from OAuth name
- `image` — avatar URL; defaults to OAuth avatar, overridable via Vercel Blob upload
- `bio`, `twitterHandle`, `githubHandle`, `website`, `walletAddress`
- `submissionCredits` — starts at 2; spent on submission, earned back via upvote milestones, build updates, and comments
- `reputationScore` — tracked but not actively gated (reserved for future use)
- `lastSeenAt` — updated by presence ping; used for the online green dot (5-minute window)
- `lastBuildUpdateCredit` / `lastCommentCredit` — rate-limit timestamps for activity credit awards

### Project

- `slug` — unique, URL-safe identifier derived from title
- `genlayerAngle` — required: "What's only possible on GenLayer?"
- `contractAddress` + `verified` — optional on-chain proof
- `status` — `DRAFT | PENDING_REVIEW | PUBLISHED | ARCHIVED | EXPIRED` (new projects go directly to `PUBLISHED`)
- `publishedAt` — set when first published; reset on resubmit; used by the expiry cron
- `upvoteCreditsAwarded` — integer 0–3 tracking how many upvote milestone credits have been given
- `remixedFromId` — nullable self-relation for the remix fork flow

---

## Community Curation

Projects go live the moment they are submitted. The `publishedAt` timestamp starts the 2-week clock.

The daily cron job (`/api/cron/expire-projects`) runs at midnight UTC and:
1. Finds all `PUBLISHED` projects where `publishedAt ≤ 14 days ago`
2. Filters to those with fewer than 5 upvotes
3. Sets their status to `EXPIRED`
4. Sends an in-app + email notification to each author

Authors can resubmit from their project page. On resubmit, `status` returns to `PUBLISHED` and `publishedAt` resets to the current time — the full 2-week window starts again, no credit cost.

The threshold constants live in `src/lib/utils.ts`:
```ts
UPVOTES_FOR_CREDIT: 5      // also the gallery survival threshold
EXPIRY_DAYS: 14
```

---

## Submission Credits

| Action | Credits | Notes |
|--------|---------|-------|
| Account created | +2 | Starting balance |
| Project submitted | −1 | Costs one credit |
| Project hits 5 upvotes | +1 | First milestone |
| Project hits 10 upvotes | +1 | Second milestone |
| Project hits 25 upvotes | +1 | Third milestone |
| Post a MILESTONE or BREAKTHROUGH update | +1 | Max once per 24 hours |
| Leave a comment | +1 | Max once per 7 days (global, not per project) |

Zero credits = cannot submit until one is earned back. Rate limits are tracked via `lastBuildUpdateCredit` and `lastCommentCredit` on the `User` model.

---

## Follow System

- Follow/unfollow via `POST /api/builders/[username]/follow`
- Cannot follow yourself
- Following subscribes you to new project and feed update notifications
- Follower count displayed on builder profiles

---

## Notifications

### In-app

All notifications are stored in the `Notification` table and shown via the bell icon in the header.

| Type | Trigger | Audience |
|------|---------|----------|
| `FOLLOW` | Someone follows you | You |
| `PROJECT_REVIEW` | A review is submitted on your project | You |
| `PROJECT_PUBLISHED` | Your project is approved and published | You |
| `PROJECT_REJECTED` | Your project is sent back with feedback | You |
| `PROJECT_EXPIRED` | Your project was removed for low upvotes | You |
| `NEW_PROJECT` | A builder publishes a new project | All builders |
| `NEW_UPDATE` | A builder you follow posts a feed update | Your followers |
| `COMMENT` | Someone comments on your project | You |
| `DISCUSSION_REPLY` | Someone replies to your discussion | You |
| `SPACE_LIVE` | A builder starts a live space | All builders |
| `UPVOTE_MILESTONE` | Your project hits 5, 10, or 25 upvotes | You (+ email) |

---

## Email Notifications

Emails are sent via the [Resend](https://resend.com) REST API using a raw `fetch` call (no SDK). If `RESEND_API_KEY` is not set, all email sending is silently skipped — the app works without it.

Email is sent for: `COMMENT`, `PROJECT_PUBLISHED`, `PROJECT_REJECTED`, `PROJECT_EXPIRED`, `FOLLOW`, `DISCUSSION_REPLY`, `UPVOTE_MILESTONE`.

The `sendEmail()` helper lives in `src/lib/email.ts`. Three helpers in `src/lib/notifications.ts` handle delivery:
- `notifyUser(userId, type, message, link)` — notify one user, send email if type is in EMAIL_TYPES
- `notifyFollowers(ofUserId, type, message, link)` — notify all followers of a user
- `notifyAllBuilders(excludeUserId, type, message, link)` — broadcast to all onboarded builders (in-app only, no email)

---

## On-chain Contract Verification

From a project page, the author can verify their contract address is deployed on GenLayer. Clicking "Verify contract" calls `POST /api/projects/[id]/verify`, which:

1. Calls `eth_getCode` on the GenLayer JSON-RPC endpoint (`GENLAYER_RPC_URL`)
2. If bytecode exists at the address, sets `project.verified = true`
3. The project page then displays a verified badge

Default RPC URL: `https://studio.genlayer.com:8443/api`.

---

## Remix Flow

Any signed-in builder (other than the project author) sees a **"Remix This Project"** button on a published project's page. Clicking it:

1. Navigates to `/projects/remix/[slug]`
2. Shows the source project details and an attribution banner
3. Pre-fills the submit form with the source project's title
4. On submit, creates a new project with `remixedFromId` pointing to the original

The forked project page shows a permanent attribution banner: *"Based on [original title]"*.

---

## Profile Management

Builders edit their profile at `/settings`. Changes are saved via `PATCH /api/user`.

**Editable fields:** display name, username, bio, Twitter handle, GitHub handle, website, wallet address.

**Avatar upload:** selecting a photo on the settings page uploads it to Vercel Blob at `avatars/[userId]` (overwrites on each upload) via `POST /api/user/avatar`. Requires `BLOB_READ_WRITE_TOKEN`.

Changing a username updates the profile URL — the settings page redirects to `/builders/[newUsername]` after saving.

---

## Cron Jobs

Defined in `vercel.json`:

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/expire-projects` | `0 0 * * *` | Expire PUBLISHED projects older than 14 days with < 5 upvotes |

Vercel automatically provides a `CRON_SECRET` environment variable in production. The cron endpoint verifies this header before running. In local development (no `CRON_SECRET` set), the endpoint runs without authentication — call it directly at `http://localhost:3000/api/cron/expire-projects`.

---

## API Reference

All routes return JSON. Errors always return `{ "error": "message" }` with the appropriate HTTP status.

### Projects

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/projects` | No | List published projects (`tag`, `sort`, `page`) |
| `POST` | `/api/projects` | Yes | Submit a project (costs 1 credit) |
| `PATCH` | `/api/projects/[id]` | Author | Update project fields |
| `POST` | `/api/projects/[id]/upvote` | Yes | Toggle upvote |
| `POST` | `/api/projects/[id]/verify` | Author | Verify contract on-chain |
| `POST` | `/api/projects/[id]/resubmit` | Author | Resubmit an expired project |
| `POST` | `/api/projects/[id]/review` | Eligible reviewer | Submit approve/reject review |

### User / Profile

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `PATCH` | `/api/user` | Yes | Update profile fields |
| `POST` | `/api/user/avatar` | Yes | Upload avatar to Vercel Blob |
| `POST` | `/api/user/ping` | Yes | Update lastSeenAt for presence (throttled to once per 60s) |

### Feed

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/feed` | No | List updates (`type`, `projectId`, `page`) |
| `POST` | `/api/feed` | Author | Post a project update |

### Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/comments` | Yes | Post a comment |
| `DELETE` | `/api/comments/[id]` | Author | Delete a comment |

### Discussions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/discussions` | No | List discussions |
| `POST` | `/api/discussions` | Yes | Create a discussion |
| `DELETE` | `/api/discussions/[id]` | Author | Delete a discussion |
| `POST` | `/api/discussions/[id]/replies` | Yes | Post a reply |

### Builders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/builders/[username]/follow` | Yes | Toggle follow/unfollow |

### Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/notifications` | Yes | Get notifications (`page`) |
| `POST` | `/api/notifications` | Yes | Mark all as read |
| `POST` | `/api/notifications/[id]/read` | Yes | Mark one as read |

### Sessions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/sessions` | No | List all sessions |
| `POST` | `/api/sessions` | Yes | Schedule a session |
| `PATCH` | `/api/sessions/[id]` | Host | Update session fields |
| `DELETE` | `/api/sessions/[id]` | Host | Delete a session |

### Spaces

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/spaces` | No | List all spaces |
| `POST` | `/api/spaces` | Yes | Create a space + Livekit room |
| `POST` | `/api/spaces/[id]/token` | Yes | Get Livekit join token (upserts participant) |
| `POST` | `/api/spaces/[id]/end` | Host | End space + delete Livekit room |
| `POST` | `/api/spaces/[id]/raise-hand` | Participant | Toggle hand raised |
| `POST` | `/api/spaces/[id]/admit` | Host | Promote listener to speaker (updates Livekit permissions live) |
| `POST` | `/api/spaces/[id]/remove-speaker` | Host | Demote speaker back to listener |
| `GET` | `/api/spaces/[id]/participants` | Host | List all participants with role and handRaised status |
| `GET` | `/api/spaces/[id]/my-role` | Participant | Get current user's role in the space |

### Cron

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/cron/expire-projects` | `CRON_SECRET` | Run project expiry job |

---

## License

MIT
