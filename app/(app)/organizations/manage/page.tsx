import {
  Section,
  SectionContent,
  SectionDescription,
  SectionGroup,
  SectionHeader,
  SectionSeparator,
  SectionTitle,
} from "@/components/ui/section";
import { OrganizationDeletion } from "@/features/admin/components/organization-deletion";
import { OrganizationBasicDataUpdateForm } from "@/features/organization/forms/basic-data-update-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Organization - Basic Information",
  description: "Manage organization basic information",
};

export default function OrganizationManagePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (organization == null) redirect("/onboarding");

  return (
    <SectionGroup>
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Basic information</SectionTitle>
              <SectionDescription>
                View and update organization basic information.
              </SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <OrganizationBasicDataUpdateForm
            organization={{ name: organization.name, slug: organization.slug }}
          />
        </SectionContent>
      </section>
      <SectionSeparator />
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Delete Organization</SectionTitle>
              <SectionDescription>
                This will permanently delete your organization. Please note that
                this action is irreversible, so proceed with caution.
              </SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <OrganizationDeletion organizationId={organization.id} />
        </SectionContent>
      </section>
    </SectionGroup>
  );
}
