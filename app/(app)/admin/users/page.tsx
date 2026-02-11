import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { UsersListTable } from "@/features/admin/components/users-list-data-table";
import { AddUserDialog } from "@/features/admin/forms/add-user-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Admin Users",
  description: "Manage users in the admin dashboard",
};

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) redirect("/login");

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permission: {
        user: ["list"],
      },
    },
  });
  if (!hasAccess.success) redirect("/dashboard");

  const canCreateUser = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permission: {
        user: ["create"],
      },
    },
  });

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  });

  return (
    <div className="bg-background">
      <div className="border-border bg-background border-b pt-0 pb-4 md:pb-6">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-2">
              <PageHeaderTitle>
                Users
                <span className="text-muted-foreground ml-2 font-normal">
                  ({users.users.length})
                </span>
              </PageHeaderTitle>
              <PageHeaderDescription>
                Here is a list of all users in the system.
              </PageHeaderDescription>
            </div>
            {canCreateUser.success && (
              <div>
                <AddUserDialog />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
        <UsersListTable users={users.users} currentUserId={session?.user?.id} />
      </div>
    </div>
  );
}
