import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer";

export default function OrganizationsManageMembersBreadcrumbs() {
  const breadcrumbs = [
    {
      label: "Organization",
      href: "/organizations/manage",
      isCurrent: false,
    },
    {
      label: "Invitations",
      href: "/organizations/manage/invitations",
      isCurrent: true,
    },
  ];

  return <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />;
}
