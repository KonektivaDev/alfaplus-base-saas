import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer";

export default function OrganizationsManageBreadcrumbs() {
  const breadcrumbs = [
    {
      label: "Organization",
      href: "/organizations/manage",
      isCurrent: false,
    },
    {
      label: "Basic Information",
      href: "/organizations/manage",
      isCurrent: true,
    },
  ];

  return <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />;
}
