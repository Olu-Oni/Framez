import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
 
export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      return null;
    }
    return await ctx.db.insert("posts", {
      userId: user._id,
      userName: user.userName || "Random User",
      userAvatar: user.avatarUrl || "",
      content: args.content,
      imageUrls: args.imageUrls || [],
      createdAt: Date.now(),
      likes: 0,
    });
  },
});


export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});