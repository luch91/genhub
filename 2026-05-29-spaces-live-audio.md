# ADR-003: GenHub Spaces — Live Audio via Livekit

**Date:** 2026-05-29  
**Status:** Implemented  
**Author:** Judith (Luchi) Ekeleme

---

## Context

Builders needed a way to connect in real time — not just async posts. The GenLayer ecosystem has no native voice/audio layer. Twitter/X Spaces is the closest analogue but fragments the community outside the platform.

---

## Decision

Build live audio rooms (GenHub Spaces) natively into the platform using Livekit (WebRTC). Any signed-in builder can start a Space and become the host.

---

## Core Mechanics

**Token lifecycle:**
- 6-hour TTL on Livekit tokens prevents silent mid-session disconnects
- `POST /api/spaces/[id]/token` upserts the participant record and issues a fresh token on each join

**Host controls (all via API + Livekit server SDK):**
- Listeners raise hand → host sees raised hands in real time via `/api/spaces/[id]/participants`
- Host admits a listener → `POST /api/spaces/[id]/admit` updates Livekit permissions live, promotes to Speaker
- Host removes a speaker → `POST /api/spaces/[id]/remove-speaker` demotes back to Listener
- Host ends space → `POST /api/spaces/[id]/end` terminates the Livekit room and sets `status: ENDED`

**Participant roles:** `HOST | SPEAKER | LISTENER` stored in `SpaceParticipant` model.

**Reconnection:** Automatic WebSocket reconnection on mobile screen lock and network drops — handled by Livekit client SDK.

**X Space fallback:** Optional `xSpaceUrl` field on the `Space` model. If set, a "Join on X" button appears on the card and inside the room. Cross-posts to X Spaces without fragmenting the platform record.

**Notifications:** All builders are notified (`SPACE_LIVE` type, broadcast via `notifyAllBuilders()`) when a space goes live. In-app only, no email.

---

## Database Schema

```
Space
  id, title, description, status (SCHEDULED/LIVE/ENDED)
  scheduledAt, startedAt, endedAt
  roomName (unique — Livekit room identifier)
  listenerCount, replayUrl, xSpaceUrl
  hostId → User
  projectId → Project (optional — space can be tied to a project)
  participants → SpaceParticipant[]
  tags → Tag[]

SpaceParticipant
  spaceId + userId (unique composite)
  role: HOST | SPEAKER | LISTENER
  handRaised: Boolean
  joinedAt
```

---

## Sessions (YouTube Embeds)

Builder Sessions are a separate feature from Spaces. Sessions embed YouTube videos directly — no WebRTC, no Livekit. Three states: `SCHEDULED` (shows date), `LIVE` (embed appears), `ENDED` (replay embed).

YouTube URL parsing via `extractYouTubeId()` in `utils.ts` — handles watch, youtu.be, and /live/ URL formats.

Sessions are implemented and functional (`/sessions`, `BuilderSession` model, full API) but hidden from nav pending a planned Twitch integration. The code is intact.

---

## Required Environment Variables

```
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
NEXT_PUBLIC_LIVEKIT_URL   # wss://your-app.livekit.cloud
```

Spaces are disabled if these are not set — the rest of the platform works without them.
