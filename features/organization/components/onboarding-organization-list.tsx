"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/utils";
import { Organization } from "better-auth/plugins";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setActiveOrganization } from "../actions/set-active-organization";

export function OnboardingOrganizationList({
  organizations,
}: {
  organizations: Organization[];
}) {
  const router = useRouter();

  const handleSelectOrganization = async (organizationId: string) => {
    authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onSuccess: async () => {
          await setActiveOrganization(organizationId);
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.error("Error setting active organization", {
            description:
              error.error.message || "Failed to set active organization",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {organizations.map((organization) => (
        <Item
          key={organization.id}
          variant="outline"
          onClick={() => handleSelectOrganization(organization.id)}
          className="cursor-pointer"
        >
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarFallback>
                {organization.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{organization.name}</ItemTitle>
            <ItemDescription>
              Created on: {formatDate(organization.createdAt)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Invite"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectOrganization(organization.id);
              }}
            >
              <ChevronRightIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
