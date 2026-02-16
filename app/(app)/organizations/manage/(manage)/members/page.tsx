import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ManageOrganizationMembersDataTable } from "@/features/organization/components/manage-organization-members-data-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default function OrganizationsManageMembersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const members = await auth.api.listMembers({
    headers: await headers(),
  });

  return (
    <div>
      <ManageOrganizationMembersDataTable members={members.members} />
    </div>
  );
}
