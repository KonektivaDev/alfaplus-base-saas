import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Section, SectionContent, SectionDescription, SectionGroup, SectionHeader, SectionSeparator, SectionTitle } from "@/components/ui/section";
import { SetPasswordButton } from "@/features/auth/components/set-password-button";
import { ChangePasswordForm } from "@/features/user/forms/change-password-form";
import { ProfileUpdateForm } from "@/features/user/forms/profile-update-form";
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "User Settings",
  description: "Manage your user settings",
}

export default async function UserSettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  )
}

async function SuspendedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) redirect("/login");

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const hasPasswordAccount = accounts.some(
    (account) => account.providerId === "credential"
  );

  return (
    <SectionGroup>
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Basic information</SectionTitle>
              <SectionDescription>View and update your personal details.</SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <ProfileUpdateForm user={session.user} />
        </SectionContent>
      </section>
      <SectionSeparator />
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Change password</SectionTitle>
              <SectionDescription>Update your password to keep your account secure.</SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          {hasPasswordAccount ? <ChangePasswordForm /> : <SetPasswordButton email={session.user.email} />}
        </SectionContent>
      </section>
    </SectionGroup>
  )
}