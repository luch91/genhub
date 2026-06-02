import { db } from "./db"
// import { REVIEW_THRESHOLDS } from "./utils" // uncomment for Option B

/**
 * Option A: builder must have at least 1 published project.
 * To evolve to Option B (reputation-gated), replace the body with:
 *   const user = await db.user.findUnique({ where: { id: userId }, select: { reputationScore: true } })
 *   return (user?.reputationScore ?? 0) >= REVIEW_THRESHOLDS.MIN_REPUTATION_TO_REVIEW
 */
export async function canReview(userId: string): Promise<boolean> {
  const count = await db.project.count({
    where: { authorId: userId, status: "PUBLISHED" },
  })
  return count >= 1
}
