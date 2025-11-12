import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  // Users table
  users: defineTable({
    userName: v.optional(v.string()),
    fullName: v.optional(v.string()),
    email: v.string(),
    userAvatar:v.optional(v.id("_storage")),
    prefersDark: v.optional(v.boolean()),
  }),

  // Posts table
  posts: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    userAvatar: v.optional(v.id("_storage")),
    content: v.string(),
    imageUrls: v.optional(v.array(v.id("_storage"))),
    createdAt: v.number(),
    likes:v.number(),
  }).index("by_user", ["userId"]).index("by_createdAt", ["createdAt"]),
});

export default schema;

export type Post = {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  content: string;
  imageUrls?: string[];
  createdAt: number;
  likes: number;
};