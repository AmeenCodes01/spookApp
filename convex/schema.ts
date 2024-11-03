import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
export default defineSchema({
  users: defineTable({
    name: v.string(),
    date: v.string(),
    school: v.string(),
    class: v.string(),
    inFight: v.boolean(),
    status: v.union(
      v.literal("fighting"),
      v.literal("waiting"),
      v.literal("won"),
      v.literal("lost"),
      v.literal("null")
    ),
  }),
});
