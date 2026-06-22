# v1 Feature Status

**Date:** 2026-06-22  
**Status:** v1 live at community.genhub.fun

---

## Shipped

| Feature | Notes |
|---------|-------|
| Project gallery | Tag filtering, sort by newest/upvoted/active. Auto-publishes instantly. |
| Community curation | 5 upvotes in 14 days to survive. Cron runs daily at midnight UTC. |
| Build-in-public feed | GENERAL, MILESTONE, BLOCKER, BREAKTHROUGH update types. Filter by type. |
| Builder profiles | `/builders/[username]`. Name, avatar, bio, social links, wallet, project history. |
| Follow system | Follow/unfollow. Cannot follow yourself. Subscribes to new project + update notifications. |
| In-app notifications | Bell icon, dropdown (last 20), full history page. Grouped by recency. |
| Email notifications | Via Resend. Silently skips if `RESEND_API_KEY` absent. |
| Discussion board | GENERAL, HELP, IDEAS, SHOWCASE categories. Threaded replies. |
| Comments | On projects and feed updates. Authors can delete their own. |
| Upvoting | One per user per project. DB-level unique constraint. |
| Submission credits | +2 on signup, -1 on submit, +1 at upvote milestones and activity. |
| Onboarding | First-time OAuth → `/onboarding` → username + bio → app. |
| Remix fork flow | Any builder can fork a project. Attribution banner on forked project page. |
| On-chain verification | `eth_getCode` via GenLayer JSON-RPC. Verified badge on project page. |
| Online presence | Green dot via `lastSeenAt`. Presence ping every 4 minutes, throttled to once per 60s. |
| Admin panel | User management, project moderation, discussion moderation, report resolution. |
| Mobile navigation | Hamburger menu. |
| GenHub Spaces | Live audio via Livekit. Host controls: raise hand, admit, remove speaker. X Space fallback. |
| Builder Sessions | YouTube embeds. SCHEDULED / LIVE / ENDED states. Hidden from nav pending Twitch integration. |
| Avatar upload | Vercel Blob at `avatars/[userId]`. Overwrites on each upload. |
| Report system | Any builder can report content. Admin resolves via admin panel. |
| Downvotes | Schema and API exist (`Downvote` model, `/api/projects/[id]/downvote`). UI not yet surfaced. |

---

## In Progress / Planned

| Feature | Status |
|---------|--------|
| Sessions/Spaces tag picker | UI not built. Schema supports it (Tag relation on both models). |
| Sessions edit form | `PATCH /api/sessions/[id]` exists. No UI yet. |
| Weekly community challenges / bounties | Not started. |
| Downvote UI | API exists, no button in UI. |
| Peer review gate | Full infrastructure exists (`ProjectReview` model, `review.ts`, `PENDING_REVIEW` status, `/review` route). Not surfaced. Retained for future activation. |
| Twitch integration for Sessions | Blocked sessions nav item pending this. YouTube embed works fully. |

---

## Known Decisions Worth Noting

**Instant publish over review gate.** The peer review infrastructure is fully built but was deliberately not activated. Instant publish with community curation was chosen for lower friction at launch. The review gate can be switched on without schema changes.

**Sessions hidden from nav.** The Sessions feature is complete and functional. It's hidden pending a decision on Twitch integration. Accessing `/sessions` directly works.

**Resend as raw fetch.** No SDK. Keeps the dependency list clean. Email failing silently when the key is absent is intentional — the platform works without email.
