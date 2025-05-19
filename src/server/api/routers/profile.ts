import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  // Get the current user's profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.userProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return profile;
  }),

  // Create or update the user's profile
  upsertProfile: protectedProcedure
    .input(
      z.object({
        nickname: z.string().min(1).max(50),
        age: z.number().int().min(18).max(120),
        gender: z.string().optional(),
        weight: z.number().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update the user's profile
      const profile = await ctx.db.userProfile.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          nickname: input.nickname,
          age: input.age,
          gender: input.gender,
          weight: input.weight,
        },
        create: {
          userId: ctx.session.user.id,
          nickname: input.nickname,
          age: input.age,
          gender: input.gender,
          weight: input.weight,
        },
      });

      // Mark the user as onboarded
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { onboarded: true },
      });

      return profile;
    }),

  // Get the user's onboarded status
  getUserOnboardedStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, onboarded: true },
    });

    return user;
  }),

  // Check if the user has completed onboarding (legacy procedure)
  isOnboarded: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { onboarded: true },
    });

    return user?.onboarded ?? false;
  }),
});