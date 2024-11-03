import {query, mutation} from "./_generated/server";
import {v} from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const getUser = query({
  args: {id: v.id("users")},
  handler: async ({db}, {id}) => {
    const user = await db
      .query("users")
      .filter((u) => u.eq(u.field("_id"), id))
      .unique();
    return user;
  },
});

export const changeStatus = mutation({
  args: {
    id: v.id("users"),
    classmateId: v.optional(v.id("users")),
    status: v.union(
      v.literal("fighting"),
      v.literal("waiting"),
      v.literal("won"),
      v.literal("lost"),
      v.literal("null")
    ),
    classmateStatus: v.optional(
      v.union(
        v.literal("fighting"),
        v.literal("waiting"),
        v.literal("won"),
        v.literal("lost"),
        v.literal("null")
      )
    ),
  },
  handler: async ({db}, {id, status, classmateId, classmateStatus}) => {
    const user = await db.get(id);
    await db.patch(id, {status});

    if (classmateId && classmateStatus) {
      await db.patch(classmateId, {status: classmateStatus});
    }
    return user;
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    date: v.string(),
    school: v.string(),
    class: v.string(),
  },
  handler: async (ctx, args) => {
    const user = {...args, inFight: false, status: "null" as const};
    const newUserId = await ctx.db.insert("users", user);
    return newUserId;
  },
});
