"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormPasswordInput, FormSwitch } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });

  async function handleChangePassword(data: z.infer<typeof formSchema>) {
    await authClient.changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.password,
        revokeOtherSessions: data.revokeOtherSessions,
      },
      {
        onError: (error) => {
          toast.error("Failed to change password", {
            description: error.error.message || "Failed to change password",
          });
        },
        onSuccess: () => {
          toast.success("Password changed successfully");
          form.reset();
        },
      },
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="change-password-form"
      onSubmit={form.handleSubmit(handleChangePassword)}
    >
      <FieldGroup>
        <FormPasswordInput
          control={form.control}
          name="currentPassword"
          label="Current Password"
          autoComplete="current-password"
        />

        <FormPasswordInput
          control={form.control}
          name="password"
          label="New Password"
          autoComplete="new-password"
        />

        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm New Password"
          autoComplete="new-password"
        />

        <FormSwitch
          control={form.control}
          name="revokeOtherSessions"
          label="Logout other sessions"
          description="Logout other sessions to prevent unauthorized access to your account. This will log you out of all other devices."
        />

        <Button
          type="submit"
          className="w-fit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Change Password
          </LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
