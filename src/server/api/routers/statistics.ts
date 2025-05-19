import { DrinkType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const statisticsRouter = createTRPCRouter({
  // Get statistics for the current session
  getCurrentSessionStats: protectedProcedure
    .input(
      z.object({
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
          return null; // No session found
        }
      }

      // Get the session with all drinks
      const session = await ctx.db.drinkSession.findUnique({
        where: {
          id: sessionId,
          userId: ctx.session.user.id, // Ensure the session belongs to the current user
        },
        include: {
          drinks: true,
        },
      });

      if (!session) {
        return null;
      }

      // Calculate drink type distribution
      const drinkTypeDistribution = {
        [DrinkType.BEER]: 0,
        [DrinkType.WINE]: 0,
        [DrinkType.COCKTAIL]: 0,
        [DrinkType.SHOT]: 0,
      };

      session.drinks.forEach((drink) => {
        drinkTypeDistribution[drink.drinkType]++;
      });

      // Calculate drinks per hour
      const drinksPerHour = new Map<number, number>();
      
      if (session.drinks.length > 0) {
        const sessionStart = new Date(session.date);
        
        session.drinks.forEach((drink) => {
          const drinkTime = new Date(drink.timestamp);
          const hoursSinceStart = Math.floor(
            (drinkTime.getTime() - sessionStart.getTime()) / (1000 * 60 * 60)
          );
          
          drinksPerHour.set(
            hoursSinceStart,
            (drinksPerHour.get(hoursSinceStart) || 0) + 1
          );
        });
      }

      // Convert Map to array for easier consumption in the frontend
      const drinksPerHourArray = Array.from(drinksPerHour.entries()).map(
        ([hour, count]) => ({
          hour,
          count,
        })
      ).sort((a, b) => a.hour - b.hour);

      // Calculate average drinks per hour
      const sessionDurationHours = session.drinks.length > 0
        ? (new Date().getTime() - new Date(session.date).getTime()) / (1000 * 60 * 60)
        : 0;
      
      const avgDrinksPerHour = sessionDurationHours > 0
        ? session.drinks.length / sessionDurationHours
        : 0;

      return {
        totalDrinks: session.totalDrinks,
        totalAlcohol: session.totalAlcohol,
        avgDrinksPerHour: avgDrinksPerHour,
        drinkTypeDistribution,
        drinksPerHour: drinksPerHourArray,
      };
    }),

  // Get all-time statistics for the user
  getAllTimeStats: protectedProcedure.query(async ({ ctx }) => {
    // Get all sessions for the user
    const sessions = await ctx.db.drinkSession.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        drinks: true,
      },
    });

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDrinks: 0,
        totalAlcohol: 0,
        avgDrinksPerSession: 0,
        drinkTypeDistribution: {
          [DrinkType.BEER]: 0,
          [DrinkType.WINE]: 0,
          [DrinkType.COCKTAIL]: 0,
          [DrinkType.SHOT]: 0,
        },
      };
    }

    // Calculate total drinks and alcohol
    const totalDrinks = sessions.reduce((sum, session) => sum + session.totalDrinks, 0);
    const totalAlcohol = sessions.reduce((sum, session) => sum + session.totalAlcohol, 0);

    // Calculate average drinks per session
    const avgDrinksPerSession = totalDrinks / sessions.length;

    // Calculate drink type distribution
    const drinkTypeDistribution = {
      [DrinkType.BEER]: 0,
      [DrinkType.WINE]: 0,
      [DrinkType.COCKTAIL]: 0,
      [DrinkType.SHOT]: 0,
    };

    sessions.forEach((session) => {
      session.drinks.forEach((drink) => {
        drinkTypeDistribution[drink.drinkType]++;
      });
    });

    return {
      totalSessions: sessions.length,
      totalDrinks,
      totalAlcohol,
      avgDrinksPerSession,
      drinkTypeDistribution,
    };
  }),
});