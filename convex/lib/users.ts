import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
 
export const getCurrentSession = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    if (sessionId === null) {
      return null;
    }
    return await ctx.db.get(sessionId);
  },
});
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    if (!user) return null;
    
    // Convert storage ID to URL
    const avatarUrl = user.userAvatar 
      ? await ctx.storage.getUrl(user.userAvatar)
      : null;
    
    return {
      ...user,
      userAvatar: avatarUrl,
    };
  },
});

export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    userName: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: any = {};
    if (args.fullName !== undefined) updates.fullName = args.fullName;
    if (args.userName !== undefined) updates.userName = args.userName;
    if (args.avatarStorageId !== undefined) updates.userAvatar = args.avatarStorageId;

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});