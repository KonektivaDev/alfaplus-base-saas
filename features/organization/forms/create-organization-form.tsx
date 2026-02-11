"use client";

import { FormInput } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export function CreateOrganizationForm({
  className,
  onOpenChange,
  afterCreate,
  ...props
}: React.ComponentProps<"form"> & {
  onOpenChange: (open: boolean) => void;
  afterCreate: (organizationId: string) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateOrganization(data: z.infer<typeof formSchema>) {
    const slug = data.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-");
    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });

    if (res.error) {
      toast.error("Error creating organization", {
        description: res.error.message || "Failed to create organization",
      });
    } else {
      form.reset();
      onOpenChange(false);
      afterCreate(res.data.id);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="create-organization-form"
      onSubmit={form.handleSubmit(handleCreateOrganization)}
    >
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          autoComplete="organization-name"
        />
      </FieldGroup>

      <Field>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Create
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </Field>
    </form>
  );
}
