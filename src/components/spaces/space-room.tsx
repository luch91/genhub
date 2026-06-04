"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  LiveKitRoom,
  useParticipants,
  useLocalParticipant,
  useRoomContext,
  RoomAudioRenderer,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { ConnectionState, type ReconnectContext } from "livekit-client"
import { cn } from "@/lib/utils"

// ── Participant tile ──────────────────────────────────────────────────────────

function ParticipantTile({
  identity,
  name,
  role,
  isSpeaking,
  isCurrentUser,
}: {
  identity:      string
  name?:         string
  role:          string
  isSpeaking:    boolean
  isCurrentUser: boolean
}) {
  const initial = (name ?? identity)?.[0]?.toUpperCase() ?? "?"
  const isHost  = role === "HOST"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200",
        isHost ? "bg-brand-amber text-white" : "bg-brand-indigo text-white",
        isSpeaking && "ring-4 ring-offset-2 ring-offset-white",
        isSpeaking && isHost  ? "ring-brand-amber"  : "",
        isSpeaking && !isHost ? "ring-brand-indigo" : "",
      )}>
        {initial}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-brand-navy leading-tight">
          {name ?? identity}{isCurrentUser && " (you)"}
        </p>
        <p className="text-[10px] font-mono text-brand-navy/40 uppercase tracking-wide mt-0.5">
          {role.toLowerCase()}
        </p>
      </div>
    </div>
  )
}

// ── Connection state banner ───────────────────────────────────────────────────

function ConnectionBanner({ state }: { state: ConnectionState }) {
  if (state === ConnectionState.Connected) return null

  const messages: Partial<Record<ConnectionState, string>> = {
    [ConnectionState.Reconnecting]: "Reconnecting...",
    [ConnectionState.Connecting]:   "Connecting...",
    [ConnectionState.Disconnected]: "Disconnected — refresh to rejoin",
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber-dk text-xs font-mono">
      <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
      {messages[state] ?? "Connecting..."}
    </div>
  )
}

// ── Inner room — must be inside <LiveKitRoom> ─────────────────────────────────

function SpaceRoomInner({
  spaceId,
  hostId,
  currentUserId,
  role,
  onEnd,
}: {
  spaceId:       string
  hostId:        string
  currentUserId: string
  role:          string
  onEnd:         () => void
}) {
  const participants                              = useParticipants()
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const room                                      = useRoomContext()
  const [handRaised, setHandRaised]               = useState(false)
  const [connectionState, setConnectionState]     = useState<ConnectionState>(ConnectionState.Connecting)

  const isHost     = currentUserId === hostId
  const canPublish = isHost || role === "SPEAKER"

  useEffect(() => {
    if (!room) return
    const handler = (state: ConnectionState) => setConnectionState(state)
    room.on("connectionStateChanged", handler)
    return () => { room.off("connectionStateChanged", handler) }
  }, [room])

  const toggleMic = useCallback(() => {
    localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
  }, [localParticipant, isMicrophoneEnabled])

  const raiseHand = useCallback(async () => {
    await fetch(`/api/spaces/${spaceId}/raise-hand`, { method: "POST" })
    setHandRaised((prev) => !prev)
  }, [spaceId])

  const endSpace = useCallback(async () => {
    const replayUrl = window.prompt("Paste a YouTube replay URL (optional):")
    await fetch(`/api/spaces/${spaceId}/end`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ replayUrl: replayUrl ?? "" }),
    })
    onEnd()
  }, [spaceId, onEnd])

  const speakers      = participants.filter((p) => p.permissions?.canPublish)
  const listenerCount = participants.filter((p) => !p.permissions?.canPublish).length

  return (
    <div className="flex flex-col gap-6">
      <RoomAudioRenderer />
      <ConnectionBanner state={connectionState} />

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
          <span className="font-mono text-brand-indigo text-xs uppercase tracking-widest">Live Space</span>
        </span>
        <span className="text-brand-navy/40 text-xs font-mono">{listenerCount} listening</span>
      </div>

      <div>
        <p className="text-xs font-mono text-brand-navy/40 uppercase tracking-widest mb-4">Speakers</p>
        <div className="flex flex-wrap gap-8">
          {speakers.map((p) => (
            <ParticipantTile
              key={p.identity}
              identity={p.identity}
              name={p.name}
              role={p.identity === hostId ? "HOST" : "SPEAKER"}
              isSpeaking={p.isSpeaking}
              isCurrentUser={p.identity === currentUserId}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-brand-indigo/10 flex-wrap">
        {canPublish && (
          <button
            onClick={toggleMic}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors",
              isMicrophoneEnabled
                ? "bg-brand-indigo hover:bg-brand-indigo/85 text-white"
                : "bg-brand-navy/8 hover:bg-brand-navy/15 text-brand-navy/55"
            )}
          >
            {isMicrophoneEnabled ? "🎙 Mute" : "🎙 Unmute"}
          </button>
        )}

        {!canPublish && (
          <button
            onClick={raiseHand}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors",
              handRaised
                ? "bg-brand-amber text-white"
                : "bg-brand-navy/8 hover:bg-brand-navy/15 text-brand-navy/55"
            )}
          >
            {handRaised ? "✋ Lower Hand" : "✋ Raise Hand"}
          </button>
        )}

        {isHost && (
          <button
            onClick={endSpace}
            className="ml-auto px-5 py-2.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
          >
            End Space
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SpaceRoom({
  spaceId,
  hostId,
  currentUserId,
}: {
  spaceId:       string
  hostId:        string
  currentUserId: string
}) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [role,  setRole]  = useState<string>("LISTENER")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/spaces/${spaceId}/token`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token)
          setRole(data.role ?? "LISTENER")
        } else {
          setError(data.error ?? "Could not join space")
        }
      })
      .catch(() => setError("Connection failed — check your internet and refresh"))
  }, [spaceId])

  const handleEnd = useCallback(() => {
    router.push("/spaces")
  }, [router])

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
        ⚠️ {error}
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center gap-2 text-brand-navy/50 text-sm">
        <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
        Connecting to space...
      </div>
    )
  }

  return (
    // reconnectPolicy implements the ReconnectPolicy interface correctly.
    // nextRetryDelayInMs returns null after 3 retries to stop retrying.
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      audio={true}
      video={false}
      connect={true}
      options={{
        reconnectPolicy: {
          nextRetryDelayInMs: (context: ReconnectContext) =>
            context.retryCount < 3
              ? Math.min(1000 * Math.pow(2, context.retryCount), 10000)
              : null,
        },
      }}
    >
      <SpaceRoomInner
        spaceId={spaceId}
        hostId={hostId}
        currentUserId={currentUserId}
        role={role}
        onEnd={handleEnd}
      />
    </LiveKitRoom>
  )
}
