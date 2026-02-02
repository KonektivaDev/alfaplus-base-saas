"use client";

import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant="outline"
      type="button"
      successMessage="Password reset email sent!"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </BetterAuthActionButton>
  );
}
