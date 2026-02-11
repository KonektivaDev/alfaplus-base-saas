import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { CreateOrganizationDialog } from "@/features/organization/components/create-organization-dialog";
import { OnboardingFooter } from "@/features/organization/components/onboarding-footer";
import { OnboardingOrganizationList } from "@/features/organization/components/onboarding-organization-list";
import { auth } from "@/lib/auth";
import { Building2Icon, FolderXIcon } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding to the application",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) redirect("/login");

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return (
    <div className="h-full w-full">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary text-primary-foreground mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
          <Building2Icon className="h-6 w-6" />
        </div>
        <CardTitle>Select an organization</CardTitle>
        <CardDescription>
          Select an organization you want to work in, or create a new one.
        </CardDescription>
      </div>

      <Card>
        <CardContent>
          {organizations.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto p-3">
              <OnboardingOrganizationList organizations={organizations} />
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderXIcon />
                </EmptyMedia>
                <EmptyTitle>No organizatios yet</EmptyTitle>
                <EmptyDescription>
                  You are not a member of any organization yet. Please create a
                  new organization or contact your administrator to be added to
                  an organization.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <CreateOrganizationDialog />
              </EmptyContent>
            </Empty>
          )}

          {organizations.length > 0 && (
            <>
              <div className="px-3">
                <Separator />
              </div>
              <div className="p-3 text-center">
                <CreateOrganizationDialog />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <OnboardingFooter email={session.user?.email} />
    </div>
  );
}
