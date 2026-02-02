import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Section, SectionContent, SectionDescription, SectionGroup, SectionHeader, SectionSeparator, SectionTitle } from "@/components/ui/section";
import { AccountDeletion } from "@/features/auth/components/account-deletion";
import { AccountLinking } from "@/features/user/components/account-linking";
import { SessionManagement } from "@/features/user/components/session-management";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function UserAccountPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedPage />
    </Suspense>
  )
}

async function SuspendedPage() {
  const h = await headers();

  const session = await auth.api.getSession({ headers: h });
  if (session == null) {
    redirect("/login");

  }

  const [accounts, sessions] = await Promise.all([
    auth.api.listUserAccounts({ headers: h }),
    auth.api.listSessions({ headers: h }),
  ]);

  const noneCredentialAccounts = accounts.filter(
    (account) => account.providerId !== "credential"
  );

  const currentSessionToken = session.session.token;


  return (
    <SectionGroup>
      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Linked accounts</SectionTitle>
              <SectionDescription>View and update your linked accounts.</SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <AccountLinking currentAccounts={noneCredentialAccounts} />
        </SectionContent>
      </section>

      <SectionSeparator />

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Sessions</SectionTitle>
              <SectionDescription>View and manage your active sessions.</SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4">
          <SessionManagement
            sessions={sessions}
            currentSessionToken={currentSessionToken}
          />
        </SectionContent>
      </section>

      <SectionSeparator />

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-8">
        <Section className="col-span-8 lg:col-span-4">
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Delete Account</SectionTitle>
              <SectionDescription>This will permanently delete your Personal Account. Please note that this action is irreversible, so proceed with caution.</SectionDescription>
            </div>
          </SectionHeader>
        </Section>
        <SectionContent className="col-span-8 space-y-4 md:space-y-6 lg:col-span-4 flex w-full justify-end">
          <AccountDeletion />
        </SectionContent>
      </section>
    </SectionGroup>
  )
}