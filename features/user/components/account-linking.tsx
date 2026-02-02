"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS, SupportedOAuthProvider } from "@/lib/o-auth-providers";
import { formatDate } from "@/lib/utils";
import { LinkIcon, PlusIcon, ShieldIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  return (
    <div className="space-y-4">
      {currentAccounts.length === 0 ?
        (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <LinkIcon />
                  </EmptyMedia>
                  <EmptyTitle>No linked accounts found</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t linked any accounts yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        )
        :
        (
          <div className="space-y-3">
            {currentAccounts.map((account) => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}

      <div className="space-y-2">
        <h3 className="text-base font-medium">Link Other Accounts</h3>
        <div className="grid gap-3">
          {SUPPORTED_OAUTH_PROVIDERS.filter(
            (provider) =>
              !currentAccounts.find((acc) => acc.providerId === provider)
          ).map((provider) => (
            <AccountCard key={provider} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    Icon: ShieldIcon,
  };

  function linkAccount() {
    return authClient.linkSocial({
      provider,
      callbackURL: "/user/account",
    });
  }

  function unlinkAccount() {
    if (account == null) {
      return Promise.resolve({ error: { message: "Account not found" } });
    }
    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {<providerDetails.Icon className="size-5" />}
            <div>
              <p className="font-medium ">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-xs text-muted-foreground">
                  Connect your {providerDetails.name} account for easier login.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Linked on {formatDate(account.createdAt)}
                </p>
              )}
            </div>
          </div>

          {account == null ? (
            <BetterAuthActionButton
              variant="outline"
              size="sm"
              action={linkAccount}
            >
              <PlusIcon />
              Link
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
            >
              <Trash2Icon />
              Unlink
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}