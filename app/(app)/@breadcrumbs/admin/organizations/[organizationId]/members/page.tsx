import { BreadCrumbsRenderer } from "@/components/common/bread-crumbs-renderer";
import { getOrganizationIdTag } from "@/features/organization/db/organizations-cache";
import { db } from "@/lib/prisma";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

type Props = { params: Promise<{ organizationId: string }> };

export default function AdminOrganizationBreadcrumbs(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: Props) {
  const { organizationId } = await params;
  const organization = await getOrganization(organizationId);
  if (organization == null) return null;

  const breadcrumbs = [
    {
      label: "Admin Dashboard",
      href: "/admin/users",
      isCurrent: false,
    },
    {
      label: "Organizations",
      href: "/admin/organizations",
      isCurrent: false,
    },
    {
      label: organization.name,
      href: `/admin/organizations/${organizationId}`,
      isCurrent: false,
    },
    {
      label: "Members",
      href: `/admin/organizations/${organizationId}/members`,
      isCurrent: true,
    },
  ];

  return <BreadCrumbsRenderer breadcrumbs={breadcrumbs} />;
}

async function getOrganization(id: string) {
  "use cache";
  cacheTag(getOrganizationIdTag(id));

  return db.organization.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
}
