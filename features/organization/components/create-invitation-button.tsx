"use client";

import { FormInput } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createInviteSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim().toLowerCase(),
});

export function CreateInvitationButton() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createInviteSchema>>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleCreateInvitation(
    data: z.infer<typeof createInviteSchema>,
  ) {
    await authClient.organization.inviteMember(
      {
        email: data.email,
        role: "member",
      },
      {
        onError: (error) => {
          toast.error("Failed to invite user", {
            description: error.error.message || "Failed to invite user",
          });
        },
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PlusIcon className="size-4" />
            Create Invitation
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a user to join the organization.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          id="create-invitation-form"
          onSubmit={form.handleSubmit(handleCreateInvitation)}
        >
          <FieldGroup>
            <FormInput control={form.control} name="email" label="Email" />
          </FieldGroup>

          <Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Invite
                </LoadingSwap>
              </Button>
            </DialogFooter>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
