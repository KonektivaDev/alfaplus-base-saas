"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FormPasswordInput } from "@/components/common/form";
import { useState } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const error = searchParams.get("error") as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleResetPassword(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    await authClient.resetPassword(
      {
        newPassword: values.password,
        token: token,
      },
      {
        onError: (error) => {
          toast.error("Failed to reset password", {
            description: error.error.message || "Failed to reset password",
          });
        },
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.push("/login");
        },
      }
    );

    setIsLoading(false);
  }

  if (token == null || error != null) {
    return (
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        id="reset-password-form"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Invalid or expired token
            </p>
          </div>
          <Field>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => router.push("/login")}
            >
              Back to login
            </Button>
          </Field>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="reset-password-form"
      onSubmit={form.handleSubmit(handleResetPassword)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below and update your password
          </p>
        </div>

        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          autoComplete="new-password"
        />

        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            <LoadingSwap isLoading={isLoading}>Update Password</LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
