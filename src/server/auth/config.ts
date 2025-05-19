import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
    CredentialsProvider({
      id: "demo-credentials",
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a demo account for testing purposes
        if (
          credentials?.username === "demo" &&
          credentials?.password === "demo"
        ) {
          const demoUserId = "demo-user";
          const demoUserEmail = "demo@example.com";

          // Try to find the user by their ID
          let user = await db.user.findUnique({
            where: { id: demoUserId },
          });

          if (!user) {
            // User with demoUserId does not exist, so try to create them.
            // First, check if the email is already taken by another user.
            const existingUserWithEmail = await db.user.findUnique({
              where: { email: demoUserEmail },
            });

            if (
              existingUserWithEmail &&
              existingUserWithEmail.id !== demoUserId
            ) {
              // The email "demo@example.com" is in use by a different user ID.
              console.error(
                `Cannot create demo user: email ${demoUserEmail} is already in use by user ${existingUserWithEmail.id}.`,
              );
              return null; // Prevent login due to conflict
            }

            // Proceed to create the demo user
            try {
              user = await db.user.create({
                data: {
                  id: demoUserId,
                  name: "Demo User",
                  email: demoUserEmail,
                  image: null,
                  // 'onboarded' will default to false as per the Prisma schema
                },
              });
            } catch (error) {
              console.error("Error creating demo user:", error);
              return null; // Failed to create user
            }
          }
          // Return the user object (either found or newly created)
          return user;
        }
        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user, token }) => {
      // Get the user ID from the user object, token, or use demo-user as fallback
      const userId = user?.id ?? token?.sub ?? token?.id ?? "demo-user";

      return {
        ...session,
        user: {
          ...session.user,
          id: userId,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
