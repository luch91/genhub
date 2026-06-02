"use client"

import { useEffect, useRef, useCallback } from "react"
import { Howl } from "howler"

// Module-level mute state shared across all hook instances
let _muted = false
const _listeners = new Set<() => void>()

export function setSoundMuted(muted: boolean) {
  _muted = muted
  _listeners.forEach((fn) => fn())
}

export function getSoundMuted() {
  return _muted
}

type SoundKey = "hover" | "click" | "tick"

const SOUND_SRCS: Record<SoundKey, string> = {
  hover: "/sounds/hover.mp3",
  click: "/sounds/click.mp3",
  tick: "/sounds/tick.mp3",
}

const SOUND_VOLUMES: Record<SoundKey, number> = {
  hover: 0.15,
  click: 0.3,
  tick: 0.08,
}

export function useSound() {
  const sounds = useRef<Partial<Record<SoundKey, Howl>>>({})
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Load sounds lazily — fail silently if files are missing
    const keys: SoundKey[] = ["hover", "click", "tick"]
    keys.forEach((key) => {
      try {
        sounds.current[key] = new Howl({
          src: [SOUND_SRCS[key]],
          volume: SOUND_VOLUMES[key],
          preload: false,
          onloaderror: () => {
            // Sound file missing — gracefully no-op
            delete sounds.current[key]
          },
        })
      } catch {
        // Howler not available in this environment
      }
    })

    return () => {
      Object.values(sounds.current).forEach((h) => h?.unload())
      sounds.current = {}
    }
  }, [])

  const play = useCallback((key: SoundKey) => {
    if (_muted || reduced.current) return
    sounds.current[key]?.play()
  }, [])

  return { play }
}
