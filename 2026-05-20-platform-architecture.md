# ADR-001: Full-Stack Platform Architecture

**Date:** 2026-05-20  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

The GenLayer ecosystem had no central place for builders to share work, build in public, or find each other. The Builder Companion (a separate tool) solved the zero-to-project problem. GenHub solves the zero-to-community problem — a persistent, social, full-stack platform where shipped work lives.

---

## Decision

Build a full-stack Next.js 15 (App Router) community platform. Server Components by default — pages fetch data directly with Prisma. `"use client"` only for interactivity: forms, buttons, the notification bell, upvote toggles.

**Stack:**

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 App Router | Server Components + streaming, full-stack in one repo |
| Language | TypeScript | Type safety across DB, API, and UI |
| ORM | Prisma | Type-safe queries, migration management |
| Database | PostgreSQL (Neon) | Relational data, JSON support, free tier for launch |
| Auth | NextAuth v5 + PrismaAdapter | Database sessions, GitHub + Google OAuth |
| Validation | Zod | Client + server validation from shared schemas |
| File storage | Vercel Blob | Avatar uploads, zero infrastructure |
| Email | Resend (raw fetch) | No SDK dependency, silently skips if key absent |
| Live audio | Livekit | WebRTC-based Spaces with full host controls |
| Animation | Framer Motion | Client Components only — never Server Components |
| Deployment | Vercel | Native Next.js platform, cron job support |

---

## Key Patterns

**Authentication:** `auth()` from `@/lib/auth` in all Server Components and API routes. `useSession()` in Client Components via `SessionProvider`.

**Database:** `db` singleton from `@/lib/db`. Never instantiate `PrismaClient` directly — prevents connection pool exhaustion in dev.

**Validation:** Zod schemas in `src/lib/validations.ts`, applied on both client (user feedback) and server (correctness).

**Slugs:** Derived from project title via `slugify()`. Uniqueness enforced at DB level. Collisions get a random suffix.

**Next.js 15 params:** Always `await params` — they are a `Promise` in Next.js 15.

---

## Onboarding Redirect

Every protected page checks for a missing username:

```ts
const session = await auth()
if (session?.user && !session.user.username) redirect("/onboarding")
```

First-time OAuth sign-in → `/onboarding` → username + bio → app. No user reaches the app without a username.

---

## What This Is Not

GenHub is not a GenLayer deployment tool — that's Shipyard. It's not a learning tool — that's the Builder Companion. It's the social layer: where builders who have already shipped show their work and connect with each other.
