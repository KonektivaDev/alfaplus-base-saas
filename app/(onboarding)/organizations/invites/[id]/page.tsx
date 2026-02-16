import { LoadingSpinner } from "@/components/common/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InviteInformation } from "@/features/organization/components/invite-information";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Organization Invitation",
  description: "Organization Invitation",
};

export default async function OrganizationInvitePage({
  params,
}: PageProps<"/organizations/invites/[id]">) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage params={params} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (session == null) {
    redirect(
      `/login?callbackURL=${encodeURIComponent(`/organizations/invites/${id}`)}`,
    );
  }

  const invitation = await auth.api
    .getInvitation({
      headers: h,
      query: {
        id,
      },
    })
    .catch(() => redirect("/"));

  return (
    <div className="container mx-auto my-6 max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the{" "}
            <span className="font-bold">{invitation.organizationName}</span>{" "}
            organization as an{" "}
            <span className="font-bold">{invitation.role}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}
