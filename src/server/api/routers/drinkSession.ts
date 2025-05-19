import { DrinkType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// Helper function to calculate alcohol content in grams
const calculateAlcoholContent = (drinkType: DrinkType, volume: number): number => {
  // Alcohol percentage by volume for different drink types
  const alcoholPercentage = {
    [DrinkType.BEER]: 0.05, // 5%
    [DrinkType.WINE]: 0.12, // 12%
    [DrinkType.COCKTAIL]: 0.15, // 15%
    [DrinkType.SHOT]: 0.40, // 40%
  };

  // Alcohol density is approximately 0.789 g/ml
  const alcoholDensity = 0.789;

  // Calculate alcohol content in grams
  // Formula: volume (ml) * alcohol percentage * alcohol density (g/ml)
  return volume * alcoholPercentage[drinkType] * alcoholDensity;
};

export const drinkSessionRouter = createTRPCRouter({
  // Get the current active session or create a new one
  getCurrentSession: protectedProcedure.query(async ({ ctx }) => {
    // Get the current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Try to find an existing session for today
    let session = await ctx.db.drinkSession.findFirst({
      where: {
        userId: ctx.session.user.id,
        date: {
          gte: today,
        },
      },
      include: {
        drinks: {
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    // If no session exists, create a new one
    if (!session) {
      session = await ctx.db.drinkSession.create({
        data: {
          userId: ctx.session.user.id,
          date: new Date(),
        },
        include: {
          drinks: true,
        },
      });
    }

    return session;
  }),

  // Add a drink to the current session
  addDrink: protectedProcedure
    .input(
      z.object({
        drinkType: z.nativeEnum(DrinkType),
        volume: z.number().int().positive(),
        sessionId: z.string().optional(), // Optional: if not provided, will use current session
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get the session ID (either provided or current session)
      let sessionId = input.sessionId;
      if (!sessionId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Try to find an existing session for today
        const session = await ctx.db.drinkSession.findFirst({
          where: {
            userId: ctx.session.user.id,
            date: {
              gte: today,
            },
          },
        });

        // If no session exists, create a new one
        if (session) {
          sessionId = session.id;
        } else {
          const newSession = await ctx.db.drinkSession.create({
            data: {
              userId: ctx.session.user.id,
              date: new Date(),
            },
          });
          sessionId = newSession.id;
        }
      }

      // Calculate alcohol content
      const alcoholContent = calculateAlcoholContent(input.drinkType, input.volume);

      // Create the drink entry
      const drink = await ctx.db.drinkEntry.create({
        data: {
          sessionId,
          drinkType: input.drinkType,
          volume: input.volume,
          timestamp: new Date(),
        },
      });

      // Update session stats
      await ctx.db.drinkSession.update({
        where: { id: sessionId },
        data: {
          totalDrinks: { increment: 1 },
          totalAlcohol: { increment: alcoholContent },
        },
      });

      return drink;
    }),

  // Get all sessions for the current user
  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.drinkSession.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        drinks: true,
      },
    });
  }),

  // Get a specific session by ID
  getSessionById: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.drinkSession.findUnique({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id, // Ensure the session belongs to the current user
        },
        include: {
          drinks: {
            orderBy: {
              timestamp: "desc",
            },
          },
        },
      });
    }),

  // Get recent drinks from the current session
  getRecentDrinks: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        sessionId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // If sessionId is provided, use it; otherwise, get the current session
      let sessionId = input.sessionId;
      if (!sessionId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const session = await ctx.db.drinkSession.findFirst({
          where: {
            userId: ctx.session.user.id,
            date: {
              gte: today,
            },
          },
        });

        if (session) {
          sessionId = session.id;
        } else {
          return []; // No session found
        }
      }

      // Get recent drinks
      return ctx.db.drinkEntry.findMany({
        where: {
          sessionId,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: input.limit,
      });
    }),
});