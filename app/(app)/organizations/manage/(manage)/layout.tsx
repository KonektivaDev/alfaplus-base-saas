import { OrganizationMembersNavigation } from "@/features/organization/components/members-navigation";

export default function OrganizationsManageMembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <OrganizationMembersNavigation />
      {children}
    </div>
  );
}
