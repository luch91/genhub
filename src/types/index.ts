import type { Project, User, ProjectUpdate, Tag, Comment, Upvote } from "@prisma/client"

export type { ProjectStatus, UpdateType } from "@prisma/client"

export type ProjectWithRelations = Project & {
  author: Pick<User, "id" | "name" | "username" | "image">
  tags: { tag: Pick<Tag, "id" | "name" | "slug"> }[]
  _count: { upvotes: number; comments: number; updates: number }
}

export type ProjectUpdateWithRelations = ProjectUpdate & {
  author: Pick<User, "id" | "name" | "username" | "image">
  project: Pick<Project, "id" | "slug" | "title">
  _count: { comments: number }
}

export type BuilderWithRelations = User & {
  _count: { projects: number; updates: number }
}

export type CommentWithAuthor = Comment & {
  author: Pick<User, "id" | "name" | "username" | "image">
}

export type UpvoteWithUser = Upvote & {
  user: Pick<User, "id">
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
