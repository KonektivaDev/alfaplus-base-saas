import { LoadingSpinner } from "@/components/common/loading-spinner";
import { PageAside } from "@/components/common/page-aside";
import { SubPagesSelector } from "@/components/common/sub-pages-selector";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { getOrganizationIdTag } from "@/features/organization/db/organizations-cache";
import { db } from "@/lib/prisma";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
};

export default function AdminOrganizationLayout(props: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedLayout params={props.params}>{props.children}</SuspendedLayout>
    </Suspense>
  );
}

async function SuspendedLayout({ children, params }: Props) {
  const { organizationId } = await params;
  const organization = await getOrganization(organizationId);
  if (organization == null) return null;

  const subPages = [
    {
      title: "Basic Information",
      href: `/admin/organizations/${organizationId}`,
    },
    {
      title: "Members",
      href: `/admin/organizations/${organizationId}/members`,
    },
    {
      title: "Teams",
      href: `/admin/organizations/${organizationId}/teams`,
    },
    {
      title: "Billing",
      href: `/admin/organizations/${organizationId}/billing`,
    },
  ];

  return (
    <>
      <PageHeader size="sm">
        <PageHeaderContainer>
          <PageHeaderContent>
            <div className="space-y-1">
              <PageHeaderTitle>{organization.name}</PageHeaderTitle>
              <PageHeaderDescription>
                Manage organization settings and members
              </PageHeaderDescription>
            </div>
            <PageHeaderActions className="block md:hidden">
              <SubPagesSelector pages={subPages} />
            </PageHeaderActions>
          </PageHeaderContent>
        </PageHeaderContainer>
      </PageHeader>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row">
          <PageAside pages={subPages} />
          <main className="flex-1">
            <div className="container mx-auto px-0 py-4 md:py-6 md:pl-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

async function getOrganization(organizationId: string) {
  "use cache";
  cacheTag(getOrganizationIdTag(organizationId));
  return db.organization.findUnique({
    where: { id: organizationId },
    select: {
      name: true,
    },
  });
}
