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
      mediaVariant="destructive"
      action={() => authClient.deleteUser({ callbackURL: "/" })}
      areYouSureTitle="Delete Account Permanently"
      areYouSureDescription="Are you sure you want to delete your account? This action cannot be undone."
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
