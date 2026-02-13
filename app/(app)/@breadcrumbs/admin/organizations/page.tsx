import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer";

export default function AdminOrganizationsBreadcrumbs() {
  const breadcrumbs = [
    {
      label: "Admin Dashboard",
      href: "/admin/users",
      isCurrent: false,
    },
    {
      label: "Organizations",
      href: "/admin/organizations",
      isCurrent: true,
    },
  ];

  return <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />;
}
