# ADR-002: Community Curation and Credit System

**Date:** 2026-05-20  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

A community platform without curation becomes a graveyard of abandoned projects. The challenge: keep the project gallery healthy without a human moderation bottleneck or a high-friction review gate that discourages submissions.

---

## Decision

### Instant Publish + Expiry Curation

Projects go live the moment they are submitted — no review gate. The `publishedAt` timestamp starts a 2-week clock.

A daily cron job (`/api/cron/expire-projects`, runs at midnight UTC via `vercel.json`) finds all `PUBLISHED` projects where `publishedAt ≤ 14 days ago` with fewer than 5 upvotes, sets them to `EXPIRED`, and notifies the author via in-app + email notification.

Authors can resubmit from their project page. On resubmit, `status` returns to `PUBLISHED` and `publishedAt` resets — the full 2-week window starts again, no credit cost.

```
PUBLISHED → (< 5 upvotes after 14 days, cron) → EXPIRED → (author resubmits) → PUBLISHED
```

Constants in `src/lib/utils.ts`:
```ts
UPVOTES_FOR_CREDIT: 5   // gallery survival threshold
EXPIRY_DAYS: 14
```

### Submission Credits

Credits prevent spam without blocking genuine builders.

| Action | Credits | Notes |
|--------|---------|-------|
| Account created | +2 | Starting balance |
| Project submitted | −1 | Costs one credit |
| Project hits 5 upvotes | +1 | First milestone |
| Project hits 10 upvotes | +1 | Second milestone |
| Project hits 25 upvotes | +1 | Third milestone |
| Post MILESTONE or BREAKTHROUGH update | +1 | Max once per 24h |
| Leave a comment | +1 | Max once per 7 days (global) |

Zero credits = cannot submit until one is earned back. Rate limits tracked via `lastBuildUpdateCredit` and `lastCommentCredit` on `User`.

### Why This Design

The alternative was peer review (PENDING_REVIEW → human approves → PUBLISHED). This was implemented in the schema (`ProjectReview` model, `PENDING_REVIEW` status, `review.ts` helper) but not surfaced in the UI. The instant-publish + expiry model was chosen instead because:

- Lower friction for builders — work is visible immediately
- Community upvotes are the quality signal, not a single reviewer's judgment
- The 2-week window is long enough for genuine work to gain traction
- The review infrastructure remains in the schema for future use if needed

The `review/` route exists but is hidden from nav. `canReview()` in `src/lib/review.ts` is retained for a future peer review gate.
