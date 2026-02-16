import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { OrganizationMembersDataTable } from "@/features/organization/components/organization-members-data-table";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export type Props = { params: Promise<{ organizationId: string }> };

export default async function AdminOrganizationMembersPage({ params }: Props) {
  const { organizationId } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage organizationId={organizationId} />
    </Suspense>
  );
}

async function SuspendedPage({ organizationId }: { organizationId: string }) {
  if (organizationId == null) return null;

  const h = await headers();

  const session = await auth.api.getSession({ headers: h });
  if (session == null) {
    redirect("/login");
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: h,
    body: {
      permission: {
        organization: ["list"],
      },
    },
  });

  if (!hasAccess.success) redirect("/dashboard");

  const members = await getOrganizationMembers(organizationId);

  return (
    <div className="bg-background">
      <div className="border-border bg-background border-b pt-0 pb-4 md:pb-6">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-2">
              <PageHeaderTitle>
                Members
                <span className="text-muted-foreground ml-2 font-normal">
                  ({members.length})
                </span>
              </PageHeaderTitle>
              <PageHeaderDescription>
                Here is a list of all members in the organization.
              </PageHeaderDescription>
            </div>
            {/* {canCreateUser.success && (
              <div>
                <AddUserDialog />
              </div>
            )} */}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <OrganizationMembersDataTable members={members} />
      </div>
    </div>
  );
}

async function getOrganizationMembers(organizationId: string) {
  return db.member.findMany({
    where: {
      organizationId,
    },
    select: {
      role: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });
}
