"use client";

import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./better-auth-action-button";

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-fit"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({ callbackURL: "/" })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
