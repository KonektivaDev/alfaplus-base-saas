import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/features/auth/lib/send-verification-email";
import { sendResetPasswordEmail } from "@/features/auth/lib/send-reset-password-email";
import { revalidateUsersCache } from "@/features/user/db/users";

export const auth = betterAuth({
  appName: "Alfa+",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          revalidateUsersCache(user.id);
        },
      },
      update: {
        after: async (user) => {
          revalidateUsersCache(user.id);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 1 * 24 * 60 * 60, // 1 day
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  rateLimit: {
    storage: "database",
  },
  plugins: [nextCookies()],
})