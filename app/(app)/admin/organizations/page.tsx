import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { OrganizationsListDataTable } from "@/features/admin/components/organizations-list-data-table";
import { getOrganizations } from "@/features/organization/actions/organization";
import { CreateOrganizationDialog } from "@/features/organization/components/create-organization-dialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Admin Organizations",
  description: "Manage organizations in the admin dashboard",
};

export default function AdminOrganizationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const reqHeaders = await headers();

  const hasAccess = await auth.api.userHasPermission({
    headers: reqHeaders,
    body: {
      permission: {
        organization: ["list"],
      },
    },
  });
  if (!hasAccess.success) redirect("/dashboard");

  const [
    canCreateOrganization,
    canUpdateOrganization,
    canDeleteOrganization,
    organizations,
  ] = await Promise.all([
    auth.api.userHasPermission({
      headers: reqHeaders,
      body: {
        permission: {
          organization: ["create"],
        },
      },
    }),
    auth.api.userHasPermission({
      headers: reqHeaders,
      body: {
        permission: {
          organization: ["update"],
        },
      },
    }),
    auth.api.userHasPermission({
      headers: reqHeaders,
      body: {
        permission: {
          organization: ["delete"],
        },
      },
    }),

    getOrganizations(),
  ]);

  return (
    <div className="bg-background">
      <div className="border-border bg-background border-b pt-0 pb-4 md:pb-6">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-2">
              <PageHeaderTitle>
                Organizations
                <span className="text-muted-foreground ml-2 font-normal">
                  ({organizations.length})
                </span>
              </PageHeaderTitle>
              <PageHeaderDescription>
                Here is a list of all organizations in the system.
              </PageHeaderDescription>
            </div>
            {canCreateOrganization.success && (
              <div>
                <CreateOrganizationDialog createAsAdmin />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <OrganizationsListDataTable
          organizations={organizations}
          canEditOrganization={canUpdateOrganization.success}
          canDeleteOrganization={canDeleteOrganization.success}
        />
      </div>
    </div>
  );
}
