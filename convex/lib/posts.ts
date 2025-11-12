import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrls: v.optional(v.array(v.id("_storage"))),
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
      userAvatar: user.userAvatar || undefined,
      content: args.content,
      imageUrls: args.imageUrls ?? [],
      createdAt: Date.now(),
      likes: 0,
    });
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    // update avatar url to storage id
    return await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        const userAvatarUrl = user?.userAvatar
          ? await ctx.storage.getUrl(user.userAvatar)
          : null;

        // Convert storage IDs to URLs
        const imageUrls = (await Promise.all(
  (post.imageUrls || []).map(id => ctx.storage.getUrl(id))
)).filter((url): url is string => url !== null);

        return {
          ...post,
          userAvatar: userAvatarUrl,
          imageUrls,
          imageStorageIds: post.imageUrls || [],
        };
      })
    );
  },
});

// Get current user's posts
export const getUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db.get(userId);
    if (!user) return [];

    const userAvatarUrl = user.userAvatar 
      ? await ctx.storage.getUrl(user.userAvatar)
      : null;

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    return await Promise.all(
  posts.map(async (post) => {
    const imageUrls = (await Promise.all(
      (post.imageUrls || []).map(id => ctx.storage.getUrl(id))
    )).filter((url): url is string => url !== null);

    return {
      ...post,
      userName: user.userName || "Unknown User",
      userAvatar: userAvatarUrl,
      imageUrls,
      imageStorageIds: post.imageUrls || [], 
    };
  })
);
  },
});

// Delete a post
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== userId) throw new Error("Not authorized");

    await ctx.db.delete(args.postId);
    return { success: true };
  },
});

// Update a post
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    content: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.userId !== userId) throw new Error("Not authorized");

    const updates: any = {};
    if (args.content !== undefined) updates.content = args.content;
    if (args.imageUrls !== undefined) updates.imageUrls = args.imageUrls;

    await ctx.db.patch(args.postId, updates);
    return { success: true };
  },
});
