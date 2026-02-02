"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
});

export function ProfileUpdateForm({
  user,
  className,
  ...props
}: React.ComponentProps<"form"> & {
  user: { name: string; email: string };
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  async function handleProfileUpdate(data: z.infer<typeof formSchema>) {
    const res = await authClient.updateUser({
      name: data.name,
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
      onSubmit={form.handleSubmit(handleProfileUpdate)}
    >
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          disabled
          placeholder="m@example.com"
          autoComplete="email"
        />


        <Button type="submit" className="w-fit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
