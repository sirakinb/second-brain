import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    timestamp: v.number(),
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
  }).index("by_timestamp", ["timestamp"]),

  cronJobs: defineTable({
    schedule: v.string(),
    text: v.string(),
    nextRun: v.optional(v.number()),
    enabled: v.boolean(),
  }),
});
