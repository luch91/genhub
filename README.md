# GenHub

The community platform for GenLayer builders. Submit Intelligent Contract projects, build in public, discover what others are creating, and connect with fellow developers in the GenLayer ecosystem.

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
- [Review System](#review-system)
- [Submission Credits](#submission-credits)
- [Reputation System](#reputation-system)
- [Follow System](#follow-system)
- [Notifications](#notifications)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## Overview

GenHub is a full-stack web application built with Next.js 15 (App Router). It serves as the central gathering place for the GenLayer developer community — a quality-gated platform where builders submit projects, share build logs, discuss ideas, and follow each other's progress.

Every project submission goes through a community review process before it goes live. This keeps the platform high-signal and ensures only genuine GenLayer projects reach the gallery.

---

## Features

### Project Gallery
- Builders submit Intelligent Contract projects with a title, tagline, full description, and a required **"Why only GenLayer?"** field that explains what makes the project only possible on GenLayer
- Projects can include a contract address, repository URL, and demo URL
- Tag-based filtering (DeFi, AI Oracle, Gaming, Social, Tooling, Infrastructure, NFT, DAO, Identity, Data)
- Sort by newest, most upvoted, or most active
- Contract addresses can be marked as verified

### Community Review Gate
- All submitted projects land in `PENDING_REVIEW` — they are not immediately public
- Builders with at least one published project are eligible to review others
- **3 approvals** → project is automatically published
- **3 rejections** → project is sent back to `DRAFT` with reviewer feedback
- Reviewers can optionally leave feedback on approvals; feedback is required on rejections
- Author sees a live approval/rejection progress bar on their project page while it is under review
- Rejected projects show all reviewer feedback to the author so they know exactly what to fix

### Build-in-Public Feed
- Builders post updates tied to their projects
- Update types: **General**, **Milestone**, **Blocker**, **Breakthrough**
- Updates are filterable by type on the feed page
- Each update can receive comments

### Builder Profiles
- Every registered user gets a profile page at `/builders/[username]`
- Profile shows bio, social links (Twitter, GitHub, website), wallet address, and all published projects
- Follower and following counts are displayed
- Projects and update counts shown as stats

### Follow System
- Follow/unfollow any builder from their profile page
- Follower count updates in real time
- Cannot follow yourself
- Following a builder triggers notifications for their activity

### Notifications
- Bell icon in the header with a real-time unread count badge
- Dropdown shows the last 20 notifications
- Full notifications page at `/notifications` — grouped by Today, Yesterday, This week, Older
- Visiting `/notifications` automatically marks all as read
- Individual notifications can be marked read from the dropdown

**Notification triggers:**
| Event | Recipient |
|-------|-----------|
| Someone follows you | You |
| A review is submitted on your project | You (with running count) |
| Your project reaches 3 approvals and is published | You |
| Your project reaches 3 rejections and is sent back | You |
| A builder you follow submits a new project | You |
| A builder you follow posts a feed update | You |
| Someone comments on your project | You |
| Someone replies to your discussion | You |

### Discussion Board
- Community forum at `/discuss`
- Categories: **General**, **Help**, **Ideas**, **Showcase**
- Discussions can be pinned by admins
- Threaded replies
- Discussions bump to the top when a new reply is posted

### Comments
- Comments on project pages
- Authors can delete their own comments
- Sign-in required to comment

### Upvoting
- One upvote per user per project
- Upvoting a project that hits 5 upvotes restores one submission credit to the author (one-time per project)
- Upvotes also increment the author's reputation score (+5)

### Review Queue
- Accessible at `/review` — only visible in the nav to eligible reviewers
- Shows all pending projects the current user has not yet reviewed and did not author
- Displays approval/rejection progress bars per project
- Full project detail view with existing reviewer feedback before submitting a review

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
| Class Utilities | clsx + tailwind-merge | latest |
| Runtime | Node.js | 24 LTS |
| Deployment | Vercel | — |

---

## Project Structure

```
genlayer-builders-hub/
├── prisma/
│   ├── schema.prisma        # Full database schema
│   └── seed.ts              # Seed script (sample builders + projects)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/       # OAuth sign-in page
│   │   ├── actions/
│   │   │   └── projects.ts  # Server action: createProject
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth route handler
│   │   │   ├── builders/[username]/follow/
│   │   │   ├── comments/
│   │   │   ├── discussions/
│   │   │   ├── feed/
│   │   │   ├── notifications/
│   │   │   └── projects/
│   │   │       └── [id]/
│   │   │           ├── review/
│   │   │           └── upvote/
│   │   ├── builders/
│   │   │   ├── page.tsx          # Builder directory
│   │   │   └── [username]/       # Builder profile
│   │   ├── discuss/
│   │   │   ├── page.tsx          # Discussion board
│   │   │   ├── new/              # New discussion form
│   │   │   └── [id]/             # Discussion thread
│   │   ├── feed/                 # Build-in-public feed
│   │   ├── notifications/        # Full notifications page
│   │   ├── projects/
│   │   │   ├── page.tsx          # Project gallery
│   │   │   ├── submit/           # Submit project form
│   │   │   └── [slug]/           # Individual project page
│   │   ├── review/
│   │   │   ├── page.tsx          # Review queue
│   │   │   └── [id]/             # Review a specific project
│   │   ├── globals.css           # Tailwind directives + CSS variables
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── providers.tsx         # SessionProvider wrapper
│   ├── components/
│   │   ├── builders/
│   │   │   ├── builder-card.tsx
│   │   │   └── follow-button.tsx
│   │   ├── comments/
│   │   │   └── comment-section.tsx
│   │   ├── discuss/
│   │   │   ├── discussion-card.tsx
│   │   │   ├── new-discussion-form.tsx
│   │   │   └── reply-form.tsx
│   │   ├── feed/
│   │   │   └── feed-item.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── notifications/
│   │   │   └── notification-bell.tsx
│   │   ├── projects/
│   │   │   ├── project-card.tsx
│   │   │   └── submit-form.tsx
│   │   └── review/
│   │       └── review-form.tsx
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config (GitHub + Google providers)
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── notifications.ts  # notifyUser() + notifyFollowers() helpers
│   │   ├── review.ts         # canReview() — Option A/B gate
│   │   ├── utils.ts          # cn(), slugify(), formatRelativeDate(), constants
│   │   └── validations.ts    # Zod schemas for all forms and APIs
│   └── types/
│       └── index.ts          # TypeScript types extending Prisma models
├── .env.example
├── .env.local                # Local secrets (not committed)
├── .gitignore
├── CLAUDE.md                 # Codebase documentation for AI-assisted development
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- A PostgreSQL database (Neon free tier recommended)
- GitHub and/or Google OAuth app credentials

### 1. Clone the repository

```bash
git clone https://github.com/luch91/genlayer-builders-hub.git
cd genlayer-builders-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See [Environment Variables](#environment-variables) for details.

Also create a `.env` file (used by Prisma CLI):

```bash
echo 'DATABASE_URL="your-connection-string-here"' > .env
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Seed the database (optional)

Loads two sample builders, two sample projects, and two sample feed updates:

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

### `.env.local` (Next.js)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret — generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Public base URL — `http://localhost:3000` for local dev |

### `.env` (Prisma CLI)

Prisma reads from `.env`, not `.env.local`. This file only needs `DATABASE_URL`.

```
DATABASE_URL="postgresql://..."
```

Both files are gitignored.

### Setting up OAuth providers

**GitHub:** Go to [github.com/settings/applications/new](https://github.com/settings/applications/new)
- Callback URL: `http://localhost:3000/api/auth/callback/github`

**Google:** Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## Database

GenHub uses **PostgreSQL 16**. [Neon](https://neon.tech) is recommended for both local development (serverless) and production.

### Schema overview

| Model | Purpose |
|-------|---------|
| `User` | Builder profile — username, bio, social links, wallet address, submission credits, reputation score |
| `Account` | NextAuth OAuth account links |
| `Session` | NextAuth sessions |
| `VerificationToken` | NextAuth email verification tokens |
| `Project` | Submitted project with status, tags, contract address |
| `ProjectTag` | Join table between Project and Tag |
| `Tag` | Predefined tag labels |
| `ProjectUpdate` | Build-in-public feed posts (Milestone / Blocker / Breakthrough / General) |
| `ProjectReview` | Community review decision (Approved / Rejected) with optional feedback |
| `Comment` | Comments on projects or project updates |
| `Upvote` | One per user per project |
| `Discussion` | Community discussion board thread |
| `Reply` | Reply to a discussion thread |
| `Follow` | Builder-to-builder follow relationship |
| `Notification` | In-app notification with type, message, link, and read state |

### Project status flow

```
DRAFT → PENDING_REVIEW → PUBLISHED
                    ↘
                     DRAFT (if 3 rejections)
```

Submissions cost one credit and land in `PENDING_REVIEW`. Three community approvals publish the project. Three rejections return it to `DRAFT` with feedback.

---

## Development Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check — no emit

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:push      # Sync schema to DB without a migration file (dev only)
npm run db:migrate   # Create migration file + apply (use for production changes)
npm run db:studio    # Open Prisma Studio GUI at localhost:5555
npm run db:seed      # Seed the database with sample data
```

---

## Architecture

### Rendering strategy

- **Server Components by default** — all pages fetch data directly on the server using Prisma
- **Client Components** (`"use client"`) only where interactivity is required: forms, toggles, dropdowns, the notification bell
- No separate API calls from pages — data is co-located with the page that needs it

### Authentication

`auth()` from `@/lib/auth` is used in Server Components and API routes:

```ts
const session = await auth()
if (!session?.user) return new Response("Unauthorized", { status: 401 })
```

Client components use `useSession()` from `next-auth/react` via the `SessionProvider` in `providers.tsx`.

### Database access

Always import `db` from `@/lib/db`. The singleton pattern prevents connection pool exhaustion in development:

```ts
import { db } from "@/lib/db"
```

### Form validation

Every form is validated with Zod on both the client (for immediate user feedback) and server (for correctness). All schemas are defined in `src/lib/validations.ts`.

### Notification system

Notifications are created server-side using two helpers from `src/lib/notifications.ts`:

```ts
// Notify one user
await notifyUser(userId, "COMMENT", "Alice commented on your project", "/projects/my-project")

// Notify all followers of a user
await notifyFollowers(authorId, "NEW_UPDATE", "Alice posted an update on MyProject", "/projects/my-project")
```

### Review eligibility

The `canReview()` function in `src/lib/review.ts` contains the single eligibility check. Currently **Option A** — must have at least one published project. To evolve to **Option B** (reputation-based), replace the body with the commented-out reputation check.

### Slug generation

Project slugs are derived from the title via `slugify()`. If a collision is detected, a short random suffix is appended.

### Next.js 15 dynamic params

All dynamic route pages `await` their params:

```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
```

---

## Domain Model

### User (Builder)

A registered community member. Created on first OAuth sign-in. Key fields:

- `username` — unique, set during onboarding
- `bio`, `twitterHandle`, `githubHandle`, `website`, `walletAddress`
- `submissionCredits` — starts at 2, spent on project submissions, earned back at 5 upvotes
- `reputationScore` — incremented by publishing (+10) and hitting 5 upvotes (+5)

### Project

The core entity. Key fields:

- `slug` — unique, URL-safe identifier derived from title
- `genlayerAngle` — required field: "What's only possible on GenLayer?"
- `contractAddress` + `verified` — optional on-chain proof
- `status` — `DRAFT | PENDING_REVIEW | PUBLISHED | ARCHIVED`
- `creditRestored` — ensures credit is only restored once per project milestone

### ProjectUpdate

A "build in public" post tied to a project. Types: `GENERAL | MILESTONE | BLOCKER | BREAKTHROUGH`. These populate the community feed.

### ProjectReview

A review from an eligible builder. `decision: APPROVED | REJECTED`. Feedback is optional on approval, required on rejection. One review per reviewer per project (enforced at DB level).

---

## Review System

### Eligibility (Option A — current)

A builder can review others' projects once they have **at least one published project** of their own. This is checked by `canReview()` in `src/lib/review.ts`.

The "Review" nav link only appears for eligible builders.

### Evolving to Option B (reputation-gated)

When the community is large enough to warrant it, open `src/lib/review.ts` and replace the body of `canReview()` with the commented-out reputation check:

```ts
const user = await db.user.findUnique({ where: { id: userId }, select: { reputationScore: true } })
return (user?.reputationScore ?? 0) >= REVIEW_THRESHOLDS.MIN_REPUTATION_TO_REVIEW
```

`MIN_REPUTATION_TO_REVIEW` is set to `50` in `src/lib/utils.ts`.

### Thresholds

All review thresholds live in `REVIEW_THRESHOLDS` in `src/lib/utils.ts`:

```ts
APPROVALS_NEEDED: 3
REJECTIONS_NEEDED: 3
UPVOTES_FOR_CREDIT: 5
MIN_REPUTATION_TO_REVIEW: 50
```

---

## Submission Credits

| Action | Credit change |
|--------|--------------|
| Account created | +2 (starting balance) |
| Project submitted | −1 |
| Published project reaches 5 upvotes | +1 (once per project) |

If a builder has 0 credits, they cannot submit until they earn one back. Credits are designed to prevent spam while rewarding builders whose work resonates with the community.

---

## Reputation System

Reputation is stored on `User.reputationScore` and is the foundation for the Option B review gate.

| Event | Reputation change |
|-------|-----------------|
| Project published (3 approvals) | +10 |
| Published project reaches 5 upvotes | +5 |

Reputation is append-only — it never decreases. This means long-term contributors always maintain their eligibility.

---

## Follow System

- Any signed-in builder can follow any other builder
- A builder cannot follow themselves
- Following is toggled via `POST /api/builders/[username]/follow`
- Follower count is displayed on builder profiles
- Following a builder subscribes you to their activity notifications (new projects, feed updates)

---

## Notifications

Notifications are stored in the `Notification` table and delivered in-app only. There is no email delivery at this time.

### Notification types

| Type | Meaning |
|------|---------|
| `FOLLOW` | Someone started following you |
| `PROJECT_REVIEW` | A review was submitted on your project |
| `PROJECT_PUBLISHED` | Your project reached 3 approvals and is now live |
| `PROJECT_REJECTED` | Your project reached 3 rejections and needs revision |
| `NEW_PROJECT` | A builder you follow submitted a new project |
| `NEW_UPDATE` | A builder you follow posted a feed update |
| `COMMENT` | Someone commented on your project |
| `DISCUSSION_REPLY` | Someone replied to your discussion |

### Reading notifications

- **Bell dropdown** — shows last 20, mark-all-read button, click to navigate
- **`/notifications` page** — full history grouped by date, auto-marks all read on visit

---

## API Reference

All API routes return JSON. Errors always include `{ "error": "message" }` with the appropriate HTTP status code.

### Projects

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List published projects (supports `tag`, `sort`, `page` query params) |
| `POST` | `/api/projects` | Submit a new project (requires auth + credits) |
| `GET` | `/api/projects/[id]` | Get a single project |
| `PATCH` | `/api/projects/[id]` | Update a project (author only) |
| `DELETE` | `/api/projects/[id]` | Delete a project (author only) |
| `POST` | `/api/projects/[id]/upvote` | Toggle upvote on a project |
| `GET` | `/api/projects/[id]/review` | Get review summary for a project |
| `POST` | `/api/projects/[id]/review` | Submit a review (eligible reviewers only) |

### Feed

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/feed` | List project updates (supports `type`, `projectId`, `page`) |
| `POST` | `/api/feed` | Post a project update (project author only) |

### Comments

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/comments` | Post a comment on a project or update |
| `DELETE` | `/api/comments/[id]` | Delete a comment (author only) |

### Discussions

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/discussions` | List discussions (supports `category`, `page`) |
| `POST` | `/api/discussions` | Create a discussion (requires auth) |
| `GET` | `/api/discussions/[id]` | Get a discussion with all replies |
| `DELETE` | `/api/discussions/[id]` | Delete a discussion (author only) |
| `POST` | `/api/discussions/[id]/replies` | Post a reply (requires auth) |

### Builders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/builders` | List builders |
| `POST` | `/api/builders/[username]/follow` | Toggle follow/unfollow |

### Notifications

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/notifications` | Get notifications for current user (supports `page`) |
| `POST` | `/api/notifications` | Mark all notifications as read |
| `POST` | `/api/notifications/[id]/read` | Mark one notification as read |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler (OAuth callbacks) |

---

## Roadmap

### Completed
- [x] Project gallery with tag and sort filtering
- [x] Project submission with community review gate
- [x] Build-in-public feed with update types
- [x] Builder profiles
- [x] Comments on projects
- [x] Community discussion board with threaded replies
- [x] Upvoting with credit restoration
- [x] Submission credit system
- [x] Reputation scoring (foundation for Option B review gate)
- [x] Community review queue (Option A: published project required)
- [x] Follow system
- [x] In-app notifications

### Planned
- [ ] Builder onboarding flow (username selection after first OAuth sign-in)
- [ ] Project editing and resubmission after rejection
- [ ] Appeal mechanism for repeatedly rejected projects
- [ ] Email notifications
- [ ] On-chain contract address verification
- [ ] "Remix This" project fork flow
- [ ] Weekly community challenges and bounties
- [ ] Review eligibility upgrade to Option B (reputation-gated) when community scales
- [ ] Live streaming for builders (pending: active feed, notification infrastructure already in place)
- [ ] Admin dashboard for pinning discussions and moderating content

---

## License

MIT
