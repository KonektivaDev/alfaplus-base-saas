"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
});

export function OrganizationBasicDataUpdateForm({
  organization,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  organization: { name: string; slug: string };
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: organization,
  });

  async function handleOrganizationBasicDataUpdate(
    data: z.infer<typeof formSchema>,
  ) {
    const res = await authClient.organization.update({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    if (res.error) {
      toast.error("Failed to update profile", {
        description: res.error.message || "Failed to update profile",
      });
    } else {
      toast.success("Profile updated successfully");
    }

    form.reset(data);
    router.refresh();
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="profile-update-form"
      onSubmit={form.handleSubmit(handleOrganizationBasicDataUpdate)}
    >
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          autoComplete="organization-name"
          disabled={form.formState.isSubmitting}
        />

        <FormInput
          control={form.control}
          name="slug"
          label="Slug"
          autoComplete="organization-slug"
          disabled={form.formState.isSubmitting}
        />

        <Button
          type="submit"
          className="w-fit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
