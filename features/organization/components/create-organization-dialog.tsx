"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateOrganizationForm } from "../forms/create-organization-form";
import { authClient } from "@/lib/auth-client";
import { setActiveOrganization } from "../actions/set-active-organization";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function afterCreate(organizationId: string) {
    setOpen(false);
    await authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onError: (error) => {
          toast.error("Error setting active organization", {
            description:
              error.error.message || "Failed to set active organization",
          });
        },
        onSuccess: () => {
          setActiveOrganization(organizationId);
          router.push("/dashboard");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Create Organization</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to manage your teams and cases.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm
          onOpenChange={setOpen}
          afterCreate={afterCreate}
        />
      </DialogContent>
    </Dialog>
  );
}
