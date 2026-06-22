# SPEC-001: v2 — Sessions Nav, Downvote UI, Tag Picker, Bounties

**Date:** 2026-06-22  
**Status:** Planned  
**Author:** Judith (Luchi) Ekeleme

---

## Scope

Four features carried from v1 into v2:

---

### 1. Sessions Nav + Twitch Integration

Sessions are currently hidden from nav. The YouTube embed flow is fully functional. The blocker is a decision on Twitch integration.

**Option A — Unhide Sessions as YouTube-only**
Remove the nav block. Ship Sessions as a YouTube-embed feature. Twitch can be added later as a second embed type when ready.

**Option B — Wait for Twitch**
Keep Sessions hidden until a Twitch embed is ready. Adds `twitchUrl` field to `BuilderSession`. `YoutubeEmbed` component becomes `SessionEmbed` that handles both.

**Recommendation:** Option A. The feature works. Builders want it. Twitch can be a v2.1 addition — it doesn't need to gate the Sessions launch.

---

### 2. Downvote UI

The `Downvote` model and `POST /api/projects/[id]/downvote` API exist. Need a UI button on project cards and project pages — similar to `upvote-button.tsx`.

**Consideration:** Downvote weight in the curation model. Currently only upvotes count toward the 5-upvote threshold. A downvote that offsets an upvote would be a curation mechanic change, not just a UI addition. Decide before building the button.

---

### 3. Sessions/Spaces Tag Picker

The `Tag` model has a relation to both `BuilderSession` and `Space`. The schema supports tags on both. The `schedule-form.tsx` and `create-form.tsx` don't expose tag selection yet.

Simple addition: add a `<TagPicker />` component (already exists pattern from project submit form) to both forms. Wire to the existing tag relation on submit.

---

### 4. Weekly Community Challenges / Bounties

Not yet scoped. Requires a new data model.

**Proposed schema sketch:**
```
Bounty
  id, title, description, reward (text), deadline
  status: OPEN | CLOSED | AWARDED
  createdBy → User (admin only)
  submissions → BountySubmission[]

BountySubmission
  bountyId, projectId, submittedBy → User
  status: PENDING | ACCEPTED | REJECTED
```

Admin creates bounties. Builders submit existing projects as entries. Admin awards winner. Winner gets a badge or credit boost.

**Dependency:** Admin panel already exists. Bounty management would be an admin panel addition.

---

## Success Criteria

- [ ] Sessions visible in nav, YouTube embed working for all builders
- [ ] Downvote button renders on project cards with correct curation weight decision documented
- [ ] Tag picker on Sessions and Spaces creation forms
- [ ] Bounty schema migrated and admin can create a bounty
