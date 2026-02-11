import { betterAuth } from "better-auth";
import { admin as adminPlugin, organization } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "@/features/auth/lib/send-verification-email";
import { sendResetPasswordEmail } from "@/features/auth/lib/send-reset-password-email";
import { revalidateUsersCache } from "@/features/user/db/users-cache";
import { ac, roles } from "./permissions";
import { getInitialOrganizationService } from "@/features/organization/services/organization-service";

export const auth = betterAuth({
  appName: "Alfa+",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        required: false,
        fieldName: "activeOrganizationId",
      },
    },
  },
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
    session: {
      create: {
        before: async (session) => {
          const [error, result] = await getInitialOrganizationService(
            session.userId,
          );

          if (error != null || result == null) {
            return { data: session };
          }

          return {
            data: {
              ...session,
              activeOrganizationId: result.activeOrganizationId,
            },
          };
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
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin: roles.admin,
        user: roles.user,
      },
    }),
    organization({
      teams: {
        enabled: true,
      },
    }),
    nextCookies(),
  ],
});
