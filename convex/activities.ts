import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all activities, most recent first
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .order("desc")
      .take(args.limit ?? 50);
    return activities;
  },
});

// Get activities by type
export const listByType = query({
  args: {
    type: v.union(
      v.literal("tool"),
      v.literal("exec"),
      v.literal("file"),
      v.literal("api")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(args.limit ?? 50);
    return activities;
  },
});

// Log a new activity
export const log = mutation({
  args: {
    type: v.union(
      v.literal("tool"),
      v.literal("exec"),
      v.literal("file"),
      v.literal("api")
    ),
    action: v.string(),
    details: v.string(),
    tokens: v.optional(v.number()),
    status: v.union(
      v.literal("success"),
      v.literal("error"),
      v.literal("pending")
    ),
  },
  handler: async (ctx, args) => {
    const activityId = await ctx.db.insert("activities", {
      timestamp: Date.now(),
      type: args.type,
      action: args.action,
      details: args.details,
      tokens: args.tokens,
      status: args.status,
    });
    return activityId;
  },
});
