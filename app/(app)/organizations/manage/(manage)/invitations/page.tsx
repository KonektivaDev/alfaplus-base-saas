import { ManageOrganizationInvitationsDataTable } from "@/features/organization/components/manage-organization-invitations-data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitations",
  description: "Manage organization invitations",
};

export default function OrganizationsManageMembersInvitationsPage() {
  return (
    <div>
      <ManageOrganizationInvitationsDataTable />
    </div>
  );
}
