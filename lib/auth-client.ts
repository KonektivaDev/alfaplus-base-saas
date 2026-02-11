import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { auth } from "./auth";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles: { admin: roles.admin, user: roles.user } }),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});
