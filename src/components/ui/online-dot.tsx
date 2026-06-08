const ONLINE_MS = 5 * 60 * 1000 // 5 minutes

export function OnlineDot({
  lastSeenAt,
}: {
  lastSeenAt: Date | null | undefined
}) {
  if (!lastSeenAt) return null
  if (Date.now() - new Date(lastSeenAt).getTime() > ONLINE_MS) return null

  return (
    <span
      className="inline-block h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500"
      title="Online"
      aria-label="Online"
    />
  )
}
