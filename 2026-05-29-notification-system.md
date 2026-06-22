# ADR-004: Notification System

**Date:** 2026-05-29  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

A community platform needs notifications that are useful without being noisy. The system needs to handle personal notifications (someone followed you, commented on your project) and ecosystem broadcasts (a space just went live, a new project was published).

---

## Decision

Three delivery functions in `src/lib/notifications.ts`:

```ts
notifyUser(userId, type, message, link)
// Notify one user. Sends email if type is in EMAIL_TYPES.

notifyFollowers(ofUserId, type, message, link)
// Notify all followers of a user.

notifyAllBuilders(excludeUserId, type, message, link)
// Broadcast to all onboarded builders. In-app only, no email.
```

---

## Notification Types

| Type | Trigger | Audience | Email |
|------|---------|----------|-------|
| `FOLLOW` | Someone follows you | You | ✅ |
| `PROJECT_PUBLISHED` | Your project is published | You | ✅ |
| `PROJECT_REJECTED` | Your project is rejected | You | ✅ |
| `PROJECT_EXPIRED` | Low upvotes after 14 days | You | ✅ |
| `PROJECT_REVIEW` | A review is submitted | You | ❌ |
| `UPVOTE_MILESTONE` | 5, 10, or 25 upvotes | You | ✅ |
| `COMMENT` | Someone comments on your project | You | ✅ |
| `DISCUSSION_REPLY` | Someone replies to your discussion | You | ✅ |
| `NEW_UPDATE` | A builder you follow posts an update | Your followers | ❌ |
| `NEW_PROJECT` | A builder publishes a project | All builders | ❌ |
| `SPACE_LIVE` | A space goes live | All builders | ❌ |

---

## Email Delivery

Via Resend REST API using a raw `fetch` call — no SDK. `sendEmail()` helper in `src/lib/email.ts`.

If `RESEND_API_KEY` is not set, all email sending is silently skipped. The app is fully functional without it. This was a deliberate decision for local development and staging environments.

Sender: `GenHub <noreply@genhub.fun>` (configurable via `EMAIL_FROM` env var).

---

## UI

- Bell icon in header with unread count badge
- Dropdown shows the last 20 notifications inline
- Full history at `/notifications` — grouped by Today, Yesterday, This week, Older
- Visiting `/notifications` marks all as read (single `POST /api/notifications`)
- Individual mark-read via `POST /api/notifications/[id]/read`

---

## `upvoteCreditsAwarded` Tracking

Upvote milestone notifications use an integer field on `Project` (0–3) to track which milestones have already triggered. Each milestone (5, 10, 25 upvotes) fires independently. Prevents duplicate notifications and duplicate credit awards on the same project.
