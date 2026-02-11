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

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function afterCreate(organizationId: string) {
    await authClient.organization.setActive({
      organizationId,
    });
    await setActiveOrganization(organizationId);
    router.push("/dashboard");
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
