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
    avatarUrl: v.optional(v.string()),
    prefersDark: v.optional(v.boolean()),
  }),

  // Posts table
  posts: defineTable({
    userId: v.id("users"),
    userName: v.string(),
    userAvatar: v.optional(v.string()),
    content: v.string(),
    imageUrls: v.optional(v.array(v.string())),
    createdAt: v.number(),
    likes:v.number(),
  }).index("by_user", ["userId"]),
});

export default schema;