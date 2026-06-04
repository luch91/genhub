"use client"

import { useCallback } from "react"

// Module-level mute state shared across all hook instances
let _muted = true
const _listeners = new Set<() => void>()

export function setSoundMuted(muted: boolean) {
  _muted = muted
  // Create and unlock the AudioContext now, while we're inside the trusted click
  // gesture. Hover events are not trusted by browsers, so if we wait until the
  // first play() call the context will be suspended and no sound will play.
  if (!muted) getCtx()
  _listeners.forEach((fn) => fn())
}

export function getSoundMuted() {
  return _muted
}

type SoundKey = "hover" | "click" | "tick"

// Lazy AudioContext — created on first play() after a user gesture
let _ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  try {
    if (!_ctx) _ctx = new AudioContext()
    if (_ctx.state === "suspended") _ctx.resume().catch(() => {})
    return _ctx
  } catch {
    return null
  }
}

type SoundConfig = {
  frequency: number
  duration: number
  type: OscillatorType
  volume: number
  attackTime: number
}

const SOUNDS: Record<SoundKey, SoundConfig> = {
  hover: { frequency: 880,  duration: 0.09, type: "sine", volume: 0.06, attackTime: 0.005 },
  click: { frequency: 440,  duration: 0.07, type: "sine", volume: 0.14, attackTime: 0.003 },
  tick:  { frequency: 1200, duration: 0.05, type: "sine", volume: 0.04, attackTime: 0.002 },
}

function synthesize(key: SoundKey): void {
  const ctx = getCtx()
  if (!ctx) return

  const { frequency, duration, type, volume, attackTime } = SOUNDS[key]
  const now = ctx.currentTime

  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + attackTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  osc.start(now)
  osc.stop(now + duration + 0.01)
  osc.onended = () => { osc.disconnect(); gain.disconnect() }
}

export function useSound() {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  const play = useCallback(
    (key: SoundKey) => {
      if (_muted || prefersReduced) return
      synthesize(key)
    },
    [prefersReduced]
  )

  return { play }
}
