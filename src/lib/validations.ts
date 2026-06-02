import { z } from "zod"
import { PREDEFINED_TAGS } from "./utils"

export const projectSubmitSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(150, "Tagline must be 150 characters or less"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be 5000 characters or less"),
  genlayerAngle: z
    .string()
    .min(20, "Please explain what makes this only possible on GenLayer")
    .max(1000, "Must be 1000 characters or less"),
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address")
    .optional()
    .or(z.literal("")),
  repoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  demoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  tags: z
    .array(z.enum(PREDEFINED_TAGS as [string, ...string[]]))
    .min(1, "Select at least one tag")
    .max(5, "Select up to 5 tags"),
})

export type ProjectSubmitInput = z.infer<typeof projectSubmitSchema>

export const projectUpdateSchema = z.object({
  type: z.enum(["GENERAL", "MILESTONE", "BLOCKER", "BREAKTHROUGH"]),
  content: z
    .string()
    .min(10, "Update must be at least 10 characters")
    .max(2000, "Update must be 2000 characters or less"),
})

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1000 characters or less"),
})

export type CommentInput = z.infer<typeof commentSchema>

export const discussionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be 150 characters or less"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be 5000 characters or less"),
  category: z.enum(["GENERAL", "HELP", "IDEAS", "SHOWCASE"]),
})

export type DiscussionInput = z.infer<typeof discussionSchema>

export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(2000, "Reply must be 2000 characters or less"),
})

export type ReplyInput = z.infer<typeof replySchema>

export const builderProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores"),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or less")
    .optional()
    .or(z.literal("")),
  twitterHandle: z.string().max(50).optional().or(z.literal("")),
  githubHandle: z.string().max(50).optional().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum address")
    .optional()
    .or(z.literal("")),
})

export type BuilderProfileInput = z.infer<typeof builderProfileSchema>
