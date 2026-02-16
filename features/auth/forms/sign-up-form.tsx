"use client";
import { FormInput, FormPasswordInput } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { GoogleOAuthButton } from "../components/google-oauth-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/dashboard");
    });
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  async function handleSignUp(values: z.infer<typeof formSchema>) {
    const res = await authClient.signUp.email(
      {
        ...values,
        callbackURL: "/login",
      },
      {
        onError: (error) => {
          toast.error("Failed to create account!", {
            description: error.error.message || "Failed to create account",
          });
        },
      },
    );

    if (res.error == null && !res.data?.user?.emailVerified) {
      toast.success("Account created successfully", {
        description: "Please check your email for a verification link",
      });
      router.push(`/verify-email?${createQueryString("email", values.email)}`);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id="signup-form"
      onSubmit={form.handleSubmit(handleSignUp)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <FormInput
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          disabled={form.formState.isSubmitting}
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          description="We'll use this to contact you. We will not share your email with anyone else."
          placeholder="m@example.com"
          autoComplete="email"
          disabled={form.formState.isSubmitting}
        />

        <FormPasswordInput
          control={form.control}
          name="password"
          label="Password"
          autoComplete="new-password"
          disabled={form.formState.isSubmitting}
        />

        <FormPasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          disabled={form.formState.isSubmitting}
        />

        <Field>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Create Account
            </LoadingSwap>
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <GoogleOAuthButton
            label="Sign up with Google"
            disabled={form.formState.isSubmitting}
          />
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Button
              nativeButton={false}
              variant="link"
              type="button"
              size="sm"
              disabled={form.formState.isSubmitting}
              render={
                form.formState.isSubmitting ? (
                  <span className="text-muted-foreground underline opacity-50">
                    Sign in
                  </span>
                ) : (
                  <Link href="/login">Sign in</Link>
                )
              }
            />
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
