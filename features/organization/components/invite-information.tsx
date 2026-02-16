"use client";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function InviteInformation({
  invitation,
}: {
  invitation: {
    id: string;
    organizationId: string;
  };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onError: (error) => {
          toast.error("Failed to accept invitation", {
            description: error.error.message || "Failed to accept invitation",
          });
        },
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          });
          router.push("/dashboard");
        },
      },
    );
  }
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onError: (error) => {
          toast.error("Failed to reject invitation", {
            description: error.error.message || "Failed to reject invitation",
          });
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  }
  return (
    <div className="flex gap-4">
      <BetterAuthActionButton className="grow" action={acceptInvite}>
        Accept
      </BetterAuthActionButton>
      <BetterAuthActionButton
        className="grow"
        variant="destructive"
        action={rejectInvite}
      >
        Reject
      </BetterAuthActionButton>
    </div>
  );
}
