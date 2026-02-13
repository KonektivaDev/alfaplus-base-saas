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
import { AdminCreateOrganizationForm } from "../forms/admin-create-organization-form";
import { PlusIcon } from "lucide-react";

export function CreateOrganizationDialog({
  createAsAdmin = false,
}: {
  createAsAdmin?: boolean;
}) {
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
      {createAsAdmin ? (
        <DialogTrigger
          render={
            <Button variant="outline">
              <PlusIcon className="size-4" />
              Create Organization
            </Button>
          }
        />
      ) : (
        <DialogTrigger render={<Button>Create Organization</Button>} />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            {createAsAdmin
              ? "Create a new organization and assign an owner."
              : "Create a new organization to manage your teams and cases."}
          </DialogDescription>
        </DialogHeader>
        {createAsAdmin ? (
          <AdminCreateOrganizationForm onOpenChange={setOpen} />
        ) : (
          <CreateOrganizationForm
            onOpenChange={setOpen}
            afterCreate={afterCreate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
