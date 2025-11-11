import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../_generated/server";
 
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
    return await ctx.db.get(userId);
  },
});