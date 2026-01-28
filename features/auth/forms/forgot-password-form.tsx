"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form";
import { useState } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgotPassword(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: "/reset-password",
      },
      {
        onError: (error) => {
          toast.error("Failed to reset password", {
            description: error.error.message || "Failed to reset password",
          });
        },
        onSuccess: () => {
          toast.success("Reset password link sent to your email");
        },
      }
    );

    setIsLoading(false);
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="forgot-password-form"
      onSubmit={form.handleSubmit(handleForgotPassword)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to reset your password
          </p>
        </div>
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          placeholder="m@example.com"
          autoComplete="email"
        />
        <Field>
          <Button type="submit" disabled={isLoading}>
            <LoadingSwap isLoading={isLoading}>Reset Password</LoadingSwap>
          </Button>
          <FieldDescription className="text-center">
            Already remember your password?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
