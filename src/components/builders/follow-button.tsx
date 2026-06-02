"use client"

import { useState } from "react"

type Props = {
  username: string
  initialFollowing: boolean
  initialCount: number
  currentUserId?: string
}

export function FollowButton({ username, initialFollowing, initialCount, currentUserId }: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  if (!currentUserId) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          {count} {count === 1 ? "follower" : "followers"}
        </span>
        <a href="/login" className="btn-primary text-sm">
          Follow
        </a>
      </div>
    )
  }

  async function toggle() {
    setLoading(true)
    const res = await fetch(`/api/builders/${username}/follow`, { method: "POST" })
    if (res.ok) {
      const json = await res.json()
      setFollowing(json.following)
      setCount(json.count)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">
        {count} {count === 1 ? "follower" : "followers"}
      </span>
      <button
        onClick={toggle}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          following
            ? hovered
              ? "btn-secondary text-sm text-red-400 hover:border-red-700"
              : "btn-secondary text-sm"
            : "btn-primary text-sm"
        }
      >
        {loading ? "..." : following ? (hovered ? "Unfollow" : "Following") : "Follow"}
      </button>
    </div>
  )
}
