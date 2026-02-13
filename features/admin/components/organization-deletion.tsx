"use client";

import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/lib/auth-client";

export function OrganizationDeletion({
  organizationId,
}: {
  organizationId: string;
}) {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-fit"
      successMessage="Organization deleted successfully."
      areYouSureDescription="Are you sure you want to delete this organization? All data associated with this organization will be deleted. This action cannot be undone."
      action={() => authClient.organization.delete({ organizationId })}
    >
      Delete Organization Permanently
    </BetterAuthActionButton>
  );
}
