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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function OrganizationManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedLayout>{children}</SuspendedLayout>
    </Suspense>
  );
}

async function SuspendedLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (session == null) {
    redirect("/login");
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: h,
    body: {
      permission: {
        organization: ["update"],
      },
    },
  });

  if (!hasAccess.success) redirect("/dashboard");

  const organization = await auth.api.getFullOrganization({
    headers: h,
  });
  if (organization == null) {
    redirect("/onboarding");
  }

  const subPages = [
    {
      title: "Basic Information",
      href: `/organizations/manage`,
      altActive: `/organizations/manage`,
    },
    {
      title: "Members",
      href: `/organizations/manage/members`,
      altActive: `/organizations/manage/invitations`,
    },
    {
      title: "Teams",
      href: `/organizations/manage/teams`,
      altActive: `/organizations/manage/teams`,
    },
    {
      title: "Billing",
      href: `/organizations/manage/billing`,
      altActive: `/organizations/manage/billing`,
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
                Manage your organization settings and members
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
